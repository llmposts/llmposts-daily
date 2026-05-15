/**
 * QR 编码器 — 从主站 share-poster.js 移植,改写为 TypeScript。
 * 纠错等级固定 M;返回布尔矩阵(true = 深色模块)。无外部依赖。
 */

export interface QrMatrix {
  size: number;
  modules: boolean[][];
}

interface MutableMatrix extends QrMatrix {
  reserved: boolean[][];
}

// ---------- Galois Field (GF(256)) ----------
const GF_EXP: number[] = new Array(512);
const GF_LOG: number[] = new Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i += 1) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let j = 255; j < 512; j += 1) GF_EXP[j] = GF_EXP[j - 255];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

// ---------- Reed-Solomon ----------
function rsDivisor(degree: number): number[] {
  const result = new Array(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i += 1) {
    for (let j = 0; j < degree; j += 1) {
      result[j] = gfMul(result[j], root);
      if (j + 1 < degree) result[j] ^= result[j + 1];
    }
    root = gfMul(root, 2);
  }
  return result;
}

function rsRemainder(data: number[], degree: number): number[] {
  const divisor = rsDivisor(degree);
  const result = new Array(degree).fill(0);
  data.forEach((byte) => {
    const factor = byte ^ result.shift()!;
    result.push(0);
    divisor.forEach((coef, idx) => {
      result[idx] ^= gfMul(coef, factor);
    });
  });
  return result;
}

// ---------- Bit buffer ----------
class BitBuffer {
  bits: number[] = [];
  append(value: number, length: number) {
    for (let i = length - 1; i >= 0; i -= 1) {
      this.bits.push((value >>> i) & 1);
    }
  }
}

// ---------- QR config (versions 1-10, ECC level M) ----------
interface QrConfig {
  ec: number;
  blocks: Array<{ count: number; data: number }>;
  align: number[];
}

const QR_CONFIGS: Array<QrConfig | null> = [
  null,
  { ec: 10, blocks: [{ count: 1, data: 16 }], align: [] },
  { ec: 16, blocks: [{ count: 1, data: 28 }], align: [6, 18] },
  { ec: 26, blocks: [{ count: 1, data: 44 }], align: [6, 22] },
  { ec: 18, blocks: [{ count: 2, data: 32 }], align: [6, 26] },
  { ec: 24, blocks: [{ count: 2, data: 43 }], align: [6, 30] },
  { ec: 16, blocks: [{ count: 4, data: 27 }], align: [6, 34] },
  { ec: 18, blocks: [{ count: 4, data: 31 }], align: [6, 22, 38] },
  { ec: 22, blocks: [{ count: 2, data: 38 }, { count: 2, data: 39 }], align: [6, 24, 42] },
  { ec: 22, blocks: [{ count: 3, data: 36 }, { count: 2, data: 37 }], align: [6, 26, 46] },
  { ec: 26, blocks: [{ count: 4, data: 43 }, { count: 1, data: 44 }], align: [6, 28, 50] },
];

function totalDataCodewords(cfg: QrConfig): number {
  return cfg.blocks.reduce((sum, g) => sum + g.count * g.data, 0);
}

function encodeData(text: string, version: number, cfg: QrConfig): number[] | null {
  const bytes = Array.from(new TextEncoder().encode(text));
  const capacity = totalDataCodewords(cfg);
  const buf = new BitBuffer();

  buf.append(0x4, 4); // byte mode
  buf.append(bytes.length, version < 10 ? 8 : 16);
  bytes.forEach((b) => buf.append(b, 8));

  const maxBits = capacity * 8;
  if (buf.bits.length > maxBits) return null;
  buf.append(0, Math.min(4, maxBits - buf.bits.length));
  while (buf.bits.length % 8) buf.bits.push(0);

  const data: number[] = [];
  for (let i = 0; i < buf.bits.length; i += 8) {
    data.push(parseInt(buf.bits.slice(i, i + 8).join(""), 2));
  }
  for (let pad = 0; data.length < capacity; pad += 1) {
    data.push(pad % 2 ? 0x11 : 0xec);
  }
  return data;
}

function chooseVersion(text: string): number {
  for (let v = 1; v < QR_CONFIGS.length; v += 1) {
    if (encodeData(text, v, QR_CONFIGS[v]!)) return v;
  }
  return 0;
}

function interleave(data: number[], cfg: QrConfig): number[] {
  const dataBlocks: number[][] = [];
  const ecBlocks: number[][] = [];
  let offset = 0;
  cfg.blocks.forEach((group) => {
    for (let i = 0; i < group.count; i += 1) {
      const block = data.slice(offset, offset + group.data);
      offset += group.data;
      dataBlocks.push(block);
      ecBlocks.push(rsRemainder(block, cfg.ec));
    }
  });
  const result: number[] = [];
  const maxLen = Math.max(...dataBlocks.map((b) => b.length));
  for (let j = 0; j < maxLen; j += 1) {
    dataBlocks.forEach((block) => {
      if (j < block.length) result.push(block[j]);
    });
  }
  for (let k = 0; k < cfg.ec; k += 1) {
    ecBlocks.forEach((block) => result.push(block[k]));
  }
  return result;
}

// ---------- Matrix ops ----------
function makeMatrix(size: number): MutableMatrix {
  return {
    size,
    modules: Array.from({ length: size }, () => new Array(size).fill(false)),
    reserved: Array.from({ length: size }, () => new Array(size).fill(false)),
  };
}

function setCell(m: MutableMatrix, x: number, y: number, dark: boolean, reserve: boolean) {
  if (x < 0 || y < 0 || x >= m.size || y >= m.size) return;
  m.modules[y][x] = dark;
  if (reserve) m.reserved[y][x] = true;
}

function drawFinder(m: MutableMatrix, x: number, y: number) {
  for (let dy = -1; dy <= 7; dy += 1) {
    for (let dx = -1; dx <= 7; dx += 1) {
      const inPattern = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6;
      const dark =
        inPattern &&
        (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
      setCell(m, x + dx, y + dy, dark, true);
    }
  }
}

function drawAlign(m: MutableMatrix, cx: number, cy: number) {
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const dist = Math.max(Math.abs(dx), Math.abs(dy));
      setCell(m, cx + dx, cy + dy, dist === 2 || dist === 0, true);
    }
  }
}

function reserveFormat(m: MutableMatrix) {
  const sz = m.size;
  for (let i = 0; i <= 8; i += 1) {
    m.reserved[8][i] = true;
    m.reserved[i][8] = true;
  }
  for (let j = sz - 8; j < sz; j += 1) {
    m.reserved[8][j] = true;
    m.reserved[j][8] = true;
  }
}

function versionBits(version: number): number {
  let rem = version;
  for (let i = 0; i < 12; i += 1) {
    rem = (rem << 1) ^ (((rem >>> 11) & 1) ? 0x1f25 : 0);
  }
  return (version << 12) | rem;
}

function drawFunctional(m: MutableMatrix, version: number, cfg: QrConfig) {
  const sz = m.size;
  drawFinder(m, 0, 0);
  drawFinder(m, sz - 7, 0);
  drawFinder(m, 0, sz - 7);
  for (let i = 8; i < sz - 8; i += 1) {
    setCell(m, i, 6, i % 2 === 0, true);
    setCell(m, 6, i, i % 2 === 0, true);
  }
  cfg.align.forEach((cx) => {
    cfg.align.forEach((cy) => {
      const nearTop = cy < 9;
      const nearLeft = cx < 9;
      const nearRight = cx > sz - 10;
      if ((nearTop && nearLeft) || (nearTop && nearRight) || (cy > sz - 10 && nearLeft)) return;
      drawAlign(m, cx, cy);
    });
  });
  reserveFormat(m);
  setCell(m, 8, sz - 8, true, true);
  if (version >= 7) {
    const bits = versionBits(version);
    for (let bit = 0; bit < 18; bit += 1) {
      const dark = ((bits >>> bit) & 1) === 1;
      const a = sz - 11 + (bit % 3);
      const b = Math.floor(bit / 3);
      setCell(m, a, b, dark, true);
      setCell(m, b, a, dark, true);
    }
  }
}

function maskFn(mask: number, x: number, y: number): boolean {
  switch (mask) {
    case 0: return (x + y) % 2 === 0;
    case 1: return y % 2 === 0;
    case 2: return x % 3 === 0;
    case 3: return (x + y) % 3 === 0;
    case 4: return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0;
    case 5: return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6: return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
    case 7: return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
    default: return false;
  }
}

function placeData(m: MutableMatrix, codewords: number[]) {
  const bits: number[] = [];
  codewords.forEach((b) => {
    for (let i = 7; i >= 0; i -= 1) bits.push((b >>> i) & 1);
  });
  const sz = m.size;
  let bi = 0;
  let upward = true;
  for (let x = sz - 1; x > 0; x -= 2) {
    if (x === 6) x -= 1;
    for (let off = 0; off < sz; off += 1) {
      const y = upward ? sz - 1 - off : off;
      for (let dx = 0; dx < 2; dx += 1) {
        const xx = x - dx;
        if (m.reserved[y][xx]) continue;
        m.modules[y][xx] = bi < bits.length ? bits[bi] === 1 : false;
        bi += 1;
      }
    }
    upward = !upward;
  }
}

function cloneMatrix(m: MutableMatrix): MutableMatrix {
  return {
    size: m.size,
    modules: m.modules.map((row) => row.slice()),
    reserved: m.reserved,
  };
}

function applyMask(m: MutableMatrix, mask: number) {
  for (let y = 0; y < m.size; y += 1) {
    for (let x = 0; x < m.size; x += 1) {
      if (!m.reserved[y][x] && maskFn(mask, x, y)) {
        m.modules[y][x] = !m.modules[y][x];
      }
    }
  }
}

function formatBits(mask: number): number {
  const data = mask;
  let rem = data;
  for (let i = 0; i < 10; i += 1) {
    rem = (rem << 1) ^ (((rem >>> 9) & 1) ? 0x537 : 0);
  }
  return (((data << 10) | rem) ^ 0x5412) & 0x7fff;
}

function drawFormat(m: MutableMatrix, mask: number) {
  const sz = m.size;
  const bits = formatBits(mask);
  const bit = (idx: number) => ((bits >>> idx) & 1) === 1;
  for (let i = 0; i <= 5; i += 1) m.modules[i][8] = bit(i);
  m.modules[7][8] = bit(6);
  m.modules[8][8] = bit(7);
  m.modules[8][7] = bit(8);
  for (let j = 9; j < 15; j += 1) m.modules[8][14 - j] = bit(j);
  for (let k = 0; k < 8; k += 1) m.modules[8][sz - 1 - k] = bit(k);
  for (let l = 8; l < 15; l += 1) m.modules[sz - 15 + l][8] = bit(l);
  m.modules[sz - 8][8] = true;
}

function penalty(m: MutableMatrix): number {
  const sz = m.size;
  let p = 0;
  let dark = 0;
  const countRuns = (line: boolean[]) => {
    let color = line[0];
    let len = 1;
    for (let i = 1; i <= line.length; i += 1) {
      if (i < line.length && line[i] === color) {
        len += 1;
      } else {
        if (len >= 5) p += 3 + (len - 5);
        color = line[i];
        len = 1;
      }
    }
  };
  for (let y = 0; y < sz; y += 1) {
    countRuns(m.modules[y]);
    for (let x = 0; x < sz; x += 1) if (m.modules[y][x]) dark += 1;
  }
  for (let x = 0; x < sz; x += 1) {
    const col: boolean[] = [];
    for (let y = 0; y < sz; y += 1) col.push(m.modules[y][x]);
    countRuns(col);
  }
  for (let y = 0; y < sz - 1; y += 1) {
    for (let x = 0; x < sz - 1; x += 1) {
      const c = m.modules[y][x];
      if (c === m.modules[y][x + 1] && c === m.modules[y + 1][x] && c === m.modules[y + 1][x + 1]) {
        p += 3;
      }
    }
  }
  const pat = [true, false, true, true, true, false, true];
  const hasPat = (line: boolean[], idx: number) => {
    for (let pi = 0; pi < pat.length; pi += 1) {
      if (line[idx + pi] !== pat[pi]) return false;
    }
    const before = idx >= 4 && !line[idx - 1] && !line[idx - 2] && !line[idx - 3] && !line[idx - 4];
    const after =
      idx + 11 <= line.length &&
      !line[idx + 7] &&
      !line[idx + 8] &&
      !line[idx + 9] &&
      !line[idx + 10];
    return before || after;
  };
  for (let r = 0; r < sz; r += 1) {
    for (let rx = 0; rx <= sz - 7; rx += 1) if (hasPat(m.modules[r], rx)) p += 40;
  }
  for (let cx = 0; cx < sz; cx += 1) {
    const col: boolean[] = [];
    for (let cy = 0; cy < sz; cy += 1) col.push(m.modules[cy][cx]);
    for (let cy = 0; cy <= sz - 7; cy += 1) if (hasPat(col, cy)) p += 40;
  }
  const total = sz * sz;
  p += Math.floor(Math.abs(dark * 20 - total * 10) / total) * 10;
  return p;
}

/** 主入口:文本 → QR 矩阵(纠错等级 M)。容量不够返回 null。 */
export function createQrMatrix(text: string): QrMatrix | null {
  const version = chooseVersion(text);
  if (!version) return null;
  const cfg = QR_CONFIGS[version]!;
  const data = encodeData(text, version, cfg);
  if (!data) return null;
  const codewords = interleave(data, cfg);
  const base = makeMatrix(17 + version * 4);
  drawFunctional(base, version, cfg);
  placeData(base, codewords);
  let best: MutableMatrix | null = null;
  let bestPen = Infinity;
  for (let mask = 0; mask < 8; mask += 1) {
    const candidate = cloneMatrix(base);
    applyMask(candidate, mask);
    drawFormat(candidate, mask);
    const pen = penalty(candidate);
    if (pen < bestPen) {
      bestPen = pen;
      best = candidate;
    }
  }
  return best ? { size: best.size, modules: best.modules } : null;
}
