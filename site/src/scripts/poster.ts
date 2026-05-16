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
  /** kept for API compatibility — currently always true */
  showQr?: boolean;
}

// Site-aligned brand: serif primary + mono kicker
const BRAND_PRIMARY = "大模型 · 邮报";
const BRAND_KICKER = "LLM DAILY";

const CAT_COLORS: Record<string, string> = {
  模型动态: "#c8553d",
  研究前沿: "#6b4ea0",
  工程实践: "#2c6f4f",
  教程指南: "#9c6b2c",
  行业观察: "#2a6f9a",
};

const ACCENT = "#c8553d";

const SANS_STACK =
  '"IBM Plex Sans", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", "Helvetica Neue", Arial, sans-serif';
const SERIF_STACK =
  '"Source Serif 4", "Noto Serif SC", "Songti SC", "STSong", Georgia, serif';
const MONO_STACK =
  '"IBM Plex Mono", "SF Mono", Menlo, ui-monospace, monospace';

interface Palette {
  bg: string;
  card: string;
  text: string;
  textSoft: string;
  muted: string;
  border: string;
  borderSoft: string;
  qrModule: string;
  qrBg: string;
}

function getPalette(theme: PosterTheme): Palette {
  if (theme === "light") {
    return {
      bg: "#fbfaf7",
      card: "#ffffff",
      text: "#1a1814",
      textSoft: "#4a463e",
      muted: "#94908a",
      border: "rgba(26, 24, 20, 0.18)",
      borderSoft: "rgba(26, 24, 20, 0.08)",
      qrModule: "#1a1814",
      qrBg: "#ffffff",
    };
  }
  return {
    bg: "#14130f",
    card: "#1d1c18",
    text: "#f4f1ea",
    textSoft: "#b9b3a6",
    muted: "#757065",
    border: "rgba(244, 241, 234, 0.22)",
    borderSoft: "rgba(244, 241, 234, 0.08)",
    qrModule: "#f4f1ea",
    qrBg: "#1d1c18",
  };
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

/**
 * Adaptive sizing — when fewer posts, each gets more breathing room and
 * a longer summary instead of being truncated.
 */
function getItemDims(count: number): ItemDims {
  if (count <= 1) {
    return {
      titleSize: 42,
      titleLineH: 56,
      titleLines: 3,
      summarySize: 24,
      summaryLineH: 38,
      summaryLines: 10,
      padTop: 20,
      padBottom: 20,
      gap: 14,
    };
  }
  if (count === 2) {
    return {
      titleSize: 34,
      titleLineH: 46,
      titleLines: 2,
      summarySize: 22,
      summaryLineH: 34,
      summaryLines: 6,
      padTop: 16,
      padBottom: 16,
      gap: 12,
    };
  }
  if (count === 3) {
    return {
      titleSize: 30,
      titleLineH: 40,
      titleLines: 2,
      summarySize: 21,
      summaryLineH: 32,
      summaryLines: 5,
      padTop: 14,
      padBottom: 14,
      gap: 10,
    };
  }
  if (count === 4) {
    return {
      titleSize: 28,
      titleLineH: 38,
      titleLines: 2,
      summarySize: 20,
      summaryLineH: 30,
      summaryLines: 4,
      padTop: 14,
      padBottom: 14,
      gap: 10,
    };
  }
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

function itemHeight(d: ItemDims, titleLines: number, summaryLines: number): number {
  return (
    d.padTop +
    d.titleLineH * titleLines +
    (summaryLines > 0 ? d.gap + d.summaryLineH * summaryLines : 0) +
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

  // ===== Masthead =====
  let y = cardY + 56;

  // Top row: just VOL number on the right (no kicker — redundant with the
  // big serif headline below)
  ctx.font = `500 18px ${MONO_STACK}`;
  ctx.fillStyle = pal.muted;
  ctx.textAlign = "right";
  ctx.fillText(`VOL.${data.vol}`, contentRight, y);
  ctx.textAlign = "left";
  y += 28;

  // Serif headline
  ctx.font = `600 72px ${SERIF_STACK}`;
  ctx.fillStyle = pal.text;
  ctx.fillText(BRAND_PRIMARY, contentX, y + 60);
  y += 88;

  // Tagline (italic serif)
  ctx.font = `italic 500 24px ${SERIF_STACK}`;
  ctx.fillStyle = pal.textSoft;
  ctx.fillText(`${data.formalDate} · ${data.weekday}`, contentX, y + 24);
  y += 38;

  // Count line "共 N 篇"
  ctx.font = `500 22px ${SANS_STACK}`;
  ctx.fillStyle = pal.muted;
  let lineX = contentX;
  ctx.fillText("今日 ", lineX, y + 22);
  lineX += ctx.measureText("今日 ").width;
  ctx.font = `700 22px ${SANS_STACK}`;
  ctx.fillStyle = ACCENT;
  const cntStr = String(data.posts.length);
  ctx.fillText(cntStr, lineX, y + 22);
  lineX += ctx.measureText(cntStr).width;
  ctx.font = `500 22px ${SANS_STACK}`;
  ctx.fillStyle = pal.muted;
  ctx.fillText(" 篇要闻", lineX, y + 22);
  y += 36;

  // Heavy divider
  y += 10;
  ctx.strokeStyle = pal.text;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(contentX, y + 0.5);
  ctx.lineTo(contentRight, y + 0.5);
  ctx.stroke();
  y += 22;

  // ===== Category chips =====
  ctx.font = `500 20px ${SANS_STACK}`;
  let chipX = contentX;
  data.categoryCounts.forEach((c, idx) => {
    const cc = CAT_COLORS[c.category] || pal.muted;
    // Dot
    ctx.fillStyle = cc;
    ctx.beginPath();
    ctx.arc(chipX + 6, y + 13, 5, 0, Math.PI * 2);
    ctx.fill();
    // Cat name
    ctx.fillStyle = pal.textSoft;
    ctx.font = `500 20px ${SANS_STACK}`;
    const nameX = chipX + 18;
    ctx.fillText(c.category, nameX, y + 20);
    const nameW = ctx.measureText(c.category).width;
    // Count (mono)
    ctx.fillStyle = pal.muted;
    ctx.font = `500 17px ${MONO_STACK}`;
    ctx.fillText(` ${c.count}`, nameX + nameW, y + 20);
    const cntW = ctx.measureText(` ${c.count}`).width;
    chipX = nameX + nameW + cntW + 28;
    if (idx < data.categoryCounts.length - 1 && chipX > contentRight - 80) {
      chipX = contentX;
      y += 30;
    }
  });
  y += 28;

  // Soft divider
  y += 6;
  ctx.strokeStyle = pal.borderSoft;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(contentX, y + 0.5);
  ctx.lineTo(contentRight, y + 0.5);
  ctx.stroke();
  y += 28;

  // ===== Content items =====
  const maxItems = 10;
  const N = Math.min(data.posts.length, maxItems);
  const overflow = data.posts.length - N;

  // Extra bottom padding so footer text doesn't crowd the card edge
  const footerH = 200;
  const footerBottomPad = 64;
  const footerTop = cardY + cardH - footerH - footerBottomPad;
  const contentBottom = footerTop - 22;
  const availableContent = contentBottom - y;

  // Pick density tier, then if it doesn't fit shrink (drop summary lines first).
  let dims = getItemDims(N);
  let curSummaryLines = dims.summaryLines;
  let curTitleLines = dims.titleLines;
  let itemH = itemHeight(dims, curTitleLines, curSummaryLines);
  while (itemH * N > availableContent && curSummaryLines > 1) {
    curSummaryLines -= 1;
    itemH = itemHeight(dims, curTitleLines, curSummaryLines);
  }
  while (itemH * N > availableContent && curTitleLines > 1) {
    curTitleLines -= 1;
    itemH = itemHeight(dims, curTitleLines, curSummaryLines);
  }
  while (itemH * N > availableContent && curSummaryLines > 0) {
    curSummaryLines -= 1;
    itemH = itemHeight(dims, curTitleLines, curSummaryLines);
  }

  // Conversely — when there's leftover room and few posts, grow summary
  // until either limit reached or fills available space.
  if (N <= 4) {
    while (
      curSummaryLines < 14 &&
      itemHeight(dims, curTitleLines, curSummaryLines + 1) * N <= availableContent
    ) {
      curSummaryLines += 1;
      itemH = itemHeight(dims, curTitleLines, curSummaryLines);
    }
  }

  const numColW = 56;
  const titleX = contentX + numColW;
  const titleW = contentW - numColW;

  for (let i = 0; i < N; i += 1) {
    const post = data.posts[i];
    const numStr = String(i + 1).padStart(2, "0");
    const top = y;

    // Number (mono accent)
    ctx.font = `600 ${dims.titleSize}px ${MONO_STACK}`;
    ctx.fillStyle = ACCENT;
    ctx.fillText(numStr, contentX, top + dims.padTop + dims.titleSize);

    // Title (serif)
    ctx.font = `600 ${dims.titleSize}px ${SERIF_STACK}`;
    ctx.fillStyle = pal.text;
    const tLines = wrapText(ctx, post.title, titleW, curTitleLines);
    tLines.forEach((line, idx) => {
      ctx.fillText(
        line,
        titleX,
        top + dims.padTop + dims.titleSize + idx * dims.titleLineH,
      );
    });

    // Summary (sans soft)
    if (curSummaryLines > 0) {
      const sumY =
        top +
        dims.padTop +
        dims.titleSize +
        (tLines.length - 1) * dims.titleLineH +
        dims.gap +
        dims.summarySize;
      ctx.font = `400 ${dims.summarySize}px ${SANS_STACK}`;
      ctx.fillStyle = pal.textSoft;
      const sLines = wrapText(ctx, post.summary, titleW, curSummaryLines);
      sLines.forEach((line, idx) => {
        ctx.fillText(line, titleX, sumY + idx * dims.summaryLineH);
      });
    }

    y += itemH;

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
    ctx.font = `500 18px ${SANS_STACK}`;
    ctx.fillStyle = pal.muted;
    ctx.textAlign = "center";
    ctx.fillText(
      `以及另外 ${overflow} 篇 · 扫码看全部 →`,
      cardX + cardW / 2,
      y + 22,
    );
    ctx.textAlign = "left";
  }

  // ===== Footer =====
  ctx.strokeStyle = pal.text;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(contentX, footerTop + 0.5);
  ctx.lineTo(contentRight, footerTop + 0.5);
  ctx.stroke();

  let qrDrawn = false;
  if (options.showQr) {
    const qrSize = 140;
    const qrPad = 10;
    const qrX = contentRight - qrSize;
    const qrY = footerTop + (footerH - qrSize) / 2 + 6;
    const qrMat = createQrMatrix(data.url);
    if (qrMat) {
      // QR with light tile for contrast (especially in dark mode)
      ctx.fillStyle = pal.qrBg;
      ctx.fillRect(qrX - qrPad, qrY - qrPad, qrSize + qrPad * 2, qrSize + qrPad * 2);
      drawQr(ctx, qrMat, qrX, qrY, qrSize, pal.qrModule);
      qrDrawn = true;
    }
  }

  // Footer text block — left of QR, or centered when no QR.
  // Just the serif brand + italic tail; no mono kicker (redundant with the
  // poster's top-of-card masthead row).
  const footerCenter = footerTop + footerH / 2 + 12;
  const tailText = qrDrawn
    ? "扫码查看本期完整内容"
    : "每日精选 · 由编辑团队与 AI 协同摘要 · 仅作存档";

  if (qrDrawn) {
    ctx.textAlign = "left";
    const blockX = contentX;

    ctx.font = `600 44px ${SERIF_STACK}`;
    ctx.fillStyle = pal.text;
    ctx.fillText(BRAND_PRIMARY, blockX, footerCenter);

    ctx.font = `italic 400 20px ${SERIF_STACK}`;
    ctx.fillStyle = pal.textSoft;
    ctx.fillText(tailText, blockX, footerCenter + 36);
  } else {
    ctx.textAlign = "center";
    const cx = cardX + cardW / 2;

    ctx.font = `600 48px ${SERIF_STACK}`;
    ctx.fillStyle = pal.text;
    ctx.fillText(BRAND_PRIMARY, cx, footerCenter);

    ctx.font = `italic 400 22px ${SERIF_STACK}`;
    ctx.fillStyle = pal.textSoft;
    ctx.fillText(tailText, cx, footerCenter + 40);

    ctx.textAlign = "left";
  }

  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/png");
  });
}
