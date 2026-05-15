/**
 * Canvas 报刊式日聚合海报渲染器。1080×1620 portrait,client-side only。
 */
import { createQrMatrix, type QrMatrix } from "../lib/qr";

export interface PosterPost {
  title: string;
  summary: string;
  link: string;
  category: string;
}

export interface PosterData {
  dateKey: string; // 2026-05-14
  formalDate: string; // 二〇二六年五月十四日
  weekday: string; // 周四
  vol: string; // 2026.05.14
  posts: PosterPost[];
  categoryCounts: Array<{ category: string; count: number }>;
  url: string; // QR target
}

export type PosterTheme = "light" | "dark";

export interface PosterOptions {
  theme: PosterTheme;
  showQr: boolean;
}

const BRAND_TEXT = "AI 大模型日报";

const CAT_COLORS: Record<string, string> = {
  模型动态: "#2862c4",
  研究前沿: "#7c3aed",
  工程实践: "#15803d",
  教程指南: "#c2410c",
  行业观察: "#b91c1c",
};

const FONT_STACK =
  '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", "Helvetica Neue", Arial, sans-serif';

interface Palette {
  bg: string;
  card: string;
  text: string;
  textSoft: string;
  muted: string;
  border: string;
  borderSoft: string;
  qrModule: string;
}

function getPalette(theme: PosterTheme): Palette {
  if (theme === "light") {
    return {
      bg: "#fafaf7",
      card: "#ffffff",
      text: "#0f0f0e",
      textSoft: "#2a2a28",
      muted: "#6e6c63",
      border: "#ebe7dd",
      borderSoft: "#f4f1e9",
      qrModule: "#0f0f0e",
    };
  }
  return {
    bg: "#0c0c0b",
    card: "#161614",
    text: "#f5f3ed",
    textSoft: "#d8d5cc",
    muted: "#8b887e",
    border: "#1f1e1a",
    borderSoft: "#252420",
    qrModule: "#f5f3ed",
  };
}

function dayAccent(data: PosterData): string {
  const top = data.categoryCounts[0]?.category;
  return CAT_COLORS[top!] || "#2862c4";
}

function cleanText(s: string): string {
  return String(s).replace(/\s+/g, " ").trim();
}

function ellipsize(ctx: CanvasRenderingContext2D, line: string, maxW: number): string {
  let chars = Array.from(line);
  while (chars.length && ctx.measureText(chars.join("") + "…").width > maxW) {
    chars.pop();
  }
  return (chars.join("").trim() || line.slice(0, 1)) + "…";
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number,
  maxLines: number,
): string[] {
  const chars = Array.from(cleanText(text));
  const lines: string[] = [];
  let line = "";
  for (let i = 0; i < chars.length; i += 1) {
    const next = line + chars[i];
    if (!line || ctx.measureText(next).width <= maxW) {
      line = next;
      continue;
    }
    lines.push(line.trim());
    line = chars[i].trimStart();
    if (lines.length === maxLines) {
      lines[maxLines - 1] = ellipsize(ctx, lines[maxLines - 1], maxW);
      return lines;
    }
  }
  if (line && lines.length < maxLines) lines.push(line.trim());
  return lines;
}

function drawQr(
  ctx: CanvasRenderingContext2D,
  matrix: QrMatrix,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  const m = size / matrix.size;
  ctx.fillStyle = color;
  for (let r = 0; r < matrix.size; r += 1) {
    for (let c = 0; c < matrix.size; c += 1) {
      if (matrix.modules[r][c]) {
        ctx.fillRect(x + c * m, y + r * m, m + 0.5, m + 0.5);
      }
    }
  }
}

interface ItemDims {
  titleSize: number;
  titleLineH: number;
  titleLines: number;
  summarySize: number;
  summaryLineH: number;
  summaryLines: number;
  padTop: number;
  padBottom: number;
  gap: number;
}

function getItemDims(count: number): ItemDims {
  if (count <= 6) {
    return {
      titleSize: 26,
      titleLineH: 36,
      titleLines: 2,
      summarySize: 20,
      summaryLineH: 30,
      summaryLines: 2,
      padTop: 14,
      padBottom: 14,
      gap: 8,
    };
  }
  if (count <= 8) {
    return {
      titleSize: 24,
      titleLineH: 32,
      titleLines: 2,
      summarySize: 18,
      summaryLineH: 26,
      summaryLines: 1,
      padTop: 12,
      padBottom: 12,
      gap: 6,
    };
  }
  return {
    titleSize: 22,
    titleLineH: 30,
    titleLines: 1,
    summarySize: 18,
    summaryLineH: 26,
    summaryLines: 1,
    padTop: 12,
    padBottom: 12,
    gap: 6,
  };
}

function itemHeight(d: ItemDims): number {
  return (
    d.padTop +
    d.titleLineH * d.titleLines +
    d.gap +
    d.summaryLineH * d.summaryLines +
    d.padBottom +
    1
  );
}

export async function renderPoster(
  data: PosterData,
  options: PosterOptions,
): Promise<HTMLCanvasElement> {
  const W = 1080;
  const H = 1620;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.textBaseline = "alphabetic";

  const accent = dayAccent(data);
  const pal = getPalette(options.theme);

  // ===== Frame + card =====
  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, W, H);

  const frame = 48;
  const cardX = frame;
  const cardY = frame;
  const cardW = W - frame * 2;
  const cardH = H - frame * 2;
  ctx.fillStyle = pal.card;
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = pal.border;
  ctx.lineWidth = 1;
  ctx.strokeRect(cardX + 0.5, cardY + 0.5, cardW - 1, cardH - 1);

  const padX = 56;
  const contentX = cardX + padX;
  const contentW = cardW - padX * 2;
  const contentRight = cardX + cardW - padX;

  // ===== Header =====
  let y = cardY + 60;

  // Brand
  ctx.font = `700 56px ${FONT_STACK}`;
  ctx.fillStyle = pal.text;
  ctx.textAlign = "left";
  ctx.fillText(BRAND_TEXT, contentX, y + 50);

  // VOL top-right
  ctx.font = `500 22px ${FONT_STACK}`;
  ctx.fillStyle = pal.muted;
  ctx.textAlign = "right";
  ctx.fillText(`VOL.${data.vol}`, contentRight, y + 30);
  ctx.textAlign = "left";
  y += 72;

  // Formal date
  ctx.font = `500 30px ${FONT_STACK}`;
  ctx.fillStyle = pal.textSoft;
  ctx.fillText(`${data.formalDate} · ${data.weekday}`, contentX, y + 26);
  y += 38;

  // Count line "共 N 篇 · 主打:XXX"
  ctx.font = `400 22px ${FONT_STACK}`;
  ctx.fillStyle = pal.muted;
  let lineX = contentX;
  ctx.fillText("共 ", lineX, y + 22);
  lineX += ctx.measureText("共 ").width;
  ctx.font = `700 22px ${FONT_STACK}`;
  ctx.fillStyle = accent;
  const cntStr = String(data.posts.length);
  ctx.fillText(cntStr, lineX, y + 22);
  lineX += ctx.measureText(cntStr).width;
  ctx.font = `400 22px ${FONT_STACK}`;
  ctx.fillStyle = pal.muted;
  ctx.fillText(" 篇", lineX, y + 22);
  y += 36;

  // Divider 1
  y += 8;
  ctx.strokeStyle = pal.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(contentX, y + 0.5);
  ctx.lineTo(contentRight, y + 0.5);
  ctx.stroke();
  y += 22;

  // ===== Category chips =====
  ctx.font = `500 22px ${FONT_STACK}`;
  let chipX = contentX;
  data.categoryCounts.forEach((c, idx) => {
    const cc = CAT_COLORS[c.category] || pal.muted;
    // Dot
    ctx.fillStyle = cc;
    ctx.beginPath();
    ctx.arc(chipX + 7, y + 14, 6, 0, Math.PI * 2);
    ctx.fill();
    // Cat name
    ctx.fillStyle = pal.textSoft;
    ctx.font = `500 22px ${FONT_STACK}`;
    const nameX = chipX + 20;
    ctx.fillText(c.category, nameX, y + 22);
    const nameW = ctx.measureText(c.category).width;
    // Count
    ctx.fillStyle = cc;
    ctx.font = `700 22px ${FONT_STACK}`;
    ctx.fillText(` ${c.count}`, nameX + nameW, y + 22);
    const cntW = ctx.measureText(` ${c.count}`).width;
    chipX = nameX + nameW + cntW + 28;
    if (idx < data.categoryCounts.length - 1 && chipX > contentRight - 80) {
      // Wrap chips to next row if running off (rare)
      chipX = contentX;
      y += 30;
    }
  });
  y += 30;

  // Divider 2
  y += 8;
  ctx.strokeStyle = pal.border;
  ctx.beginPath();
  ctx.moveTo(contentX, y + 0.5);
  ctx.lineTo(contentRight, y + 0.5);
  ctx.stroke();
  y += 26;

  // ===== Content items =====
  const maxItems = 10;
  const N = Math.min(data.posts.length, maxItems);
  const overflow = data.posts.length - N;

  const footerH = 170;
  const footerTop = cardY + cardH - footerH - 32;
  const contentBottom = footerTop - 22;
  const availableContent = contentBottom - y;

  // Pick density tier, then if doesn't fit shrink one tier
  let dims = getItemDims(N);
  let itemH = itemHeight(dims);
  if (itemH * N > availableContent) {
    // Drop summary to 1 line
    dims = {
      ...dims,
      summaryLines: 1,
    };
    itemH = itemHeight(dims);
  }
  if (itemH * N > availableContent && dims.titleLines === 2) {
    // Drop title to 1 line
    dims = { ...dims, titleLines: 1 };
    itemH = itemHeight(dims);
  }

  const numColW = 56;
  const titleX = contentX + numColW;
  const titleW = contentW - numColW;

  for (let i = 0; i < N; i += 1) {
    const post = data.posts[i];
    const numStr = String(i + 1).padStart(2, "0");
    const top = y;

    // Number
    ctx.font = `700 ${dims.titleSize}px ${FONT_STACK}`;
    ctx.fillStyle = accent;
    ctx.fillText(numStr, contentX, top + dims.padTop + dims.titleSize);

    // Title
    ctx.font = `700 ${dims.titleSize}px ${FONT_STACK}`;
    ctx.fillStyle = pal.text;
    const tLines = wrapText(ctx, post.title, titleW, dims.titleLines);
    tLines.forEach((line, idx) => {
      ctx.fillText(line, titleX, top + dims.padTop + dims.titleSize + idx * dims.titleLineH);
    });

    // Summary (only when there's room)
    if (dims.summaryLines > 0) {
      const sumY =
        top +
        dims.padTop +
        dims.titleSize +
        (tLines.length - 1) * dims.titleLineH +
        dims.gap +
        dims.summarySize;
      ctx.font = `400 ${dims.summarySize}px ${FONT_STACK}`;
      ctx.fillStyle = pal.textSoft;
      const sLines = wrapText(ctx, post.summary, titleW, dims.summaryLines);
      sLines.forEach((line, idx) => {
        ctx.fillText(line, titleX, sumY + idx * dims.summaryLineH);
      });
    }

    y += itemH;

    // Inter-item divider
    if (i < N - 1) {
      ctx.strokeStyle = pal.borderSoft;
      ctx.beginPath();
      ctx.moveTo(contentX, y - 0.5);
      ctx.lineTo(contentRight, y - 0.5);
      ctx.stroke();
    }
  }

  // Overflow indicator
  if (overflow > 0 && y + 30 < footerTop - 4) {
    ctx.font = `500 18px ${FONT_STACK}`;
    ctx.fillStyle = pal.muted;
    ctx.textAlign = "center";
    ctx.fillText(
      `以及另外 ${overflow} 篇  ·  扫码看全部 →`,
      cardX + cardW / 2,
      y + 22,
    );
    ctx.textAlign = "left";
  }

  // ===== Footer =====
  ctx.strokeStyle = pal.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(contentX, footerTop + 0.5);
  ctx.lineTo(contentRight, footerTop + 0.5);
  ctx.stroke();

  // QR on right (only if showQr)
  let qrDrawn = false;
  if (options.showQr) {
    const qrSize = 130;
    const qrX = contentRight - qrSize;
    const qrY = footerTop + (footerH - qrSize) / 2;
    const qrMat = createQrMatrix(data.url);
    if (qrMat) {
      drawQr(ctx, qrMat, qrX, qrY, qrSize, pal.qrModule);
      qrDrawn = true;
    }
  }

  // Footer text block: 有 QR 时贴左,无 QR 时居中(URL 行删除,只剩品牌 + tail)
  const footerCenter = footerTop + footerH / 2;
  const brandFont = `700 36px ${FONT_STACK}`;
  const tailFont = `500 22px ${FONT_STACK}`;
  const tailText = qrDrawn
    ? "扫码看完整内容 / 完整文章在 llmposts.com"
    : "完整文章在 llmposts.com";

  ctx.font = brandFont;
  const brandW = ctx.measureText(BRAND_TEXT).width;
  ctx.font = tailFont;
  const tailW = ctx.measureText(tailText).width;
  const blockMaxW = Math.max(brandW, tailW);

  const blockX = qrDrawn ? contentX : cardX + (cardW - blockMaxW) / 2;
  ctx.textAlign = "left";

  ctx.font = brandFont;
  ctx.fillStyle = pal.text;
  ctx.fillText(BRAND_TEXT, blockX, footerCenter - 6);

  ctx.font = tailFont;
  ctx.fillStyle = pal.textSoft;
  ctx.fillText(tailText, blockX, footerCenter + 34);

  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/png");
  });
}
