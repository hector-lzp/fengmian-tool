const SIZES = [
  { id: "34", name: "3:4", use: "抖音 1080×1440", w: 1080, h: 1440 },
  { id: "916", name: "9:16", use: "全屏 1080×1920", w: 1080, h: 1920 },
  { id: "45", name: "4:5", use: "信息流 1080×1350", w: 1080, h: 1350 },
  { id: "11", name: "1:1", use: "方形 1080×1080", w: 1080, h: 1080 },
  { id: "169", name: "16:9", use: "横版 1920×1080", w: 1920, h: 1080 },
];

const BORDERS = [
  { id: "polaroid", name: "拍立得" },
  { id: "bold", name: "白框" },
  { id: "band", name: "底带" },
  { id: "chalk", name: "朱框" },
  { id: "chrome", name: "金边" },
  { id: "neon", name: "霓虹" },
  { id: "reel", name: "胶片" },
  { id: "folio", name: "画册" },
  { id: "round", name: "圆角" },
  { id: "gold", name: "金角" },
  { id: "twin", name: "复线" },
  { id: "letterbox", name: "宽幕" },
  { id: "matte", name: "卡纸" },
  { id: "streak", name: "色条" },
  { id: "fade", name: "渐隐" },
  { id: "cinema", name: "映厅" },
  { id: "bar", name: "雾栏" },
  { id: "hair", name: "丝框" },
  { id: "aura", name: "光晕" },
  { id: "vignette", name: "暗角" },
  { id: "frost", name: "冰雾" },
  { id: "panel", name: "侧栏" },
  { id: "flare", name: "漏光" },
  { id: "ink", name: "墨韵" },
  { id: "none", name: "无框" },
];

const TITLE_FONTS = [
  { id: "hei", name: "谷雨", note: "思源黑体", family: "CoverHei", weight: 900, style: "normal", track: 0.03 },
  { id: "song", name: "谷雨", note: "思源宋体", family: "CoverSong", weight: 900, style: "normal", track: 0.02 },
  { id: "butter", name: "谷雨", note: "站酷黄油体", family: "CoverButter", weight: 400, style: "normal", track: 0 },
  { id: "happy", name: "谷雨", note: "站酷快乐体", family: "CoverHappy", weight: 400, style: "normal", track: 0 },
  { id: "mashan", name: "谷雨", note: "马善政", family: "CoverMaShan", weight: 400, style: "normal", track: 0.02 },
  { id: "xiaowei", name: "谷雨", note: "站酷小薇", family: "CoverXiaoWei", weight: 400, style: "normal", track: 0.02 },
  { id: "longcang", name: "谷雨", note: "龙苍体", family: "CoverLongCang", weight: 400, style: "normal", track: 0.01 },
  { id: "liujian", name: "谷雨", note: "刘建毛草", family: "CoverLiuJian", weight: 400, style: "normal", track: 0 },
];

const EPISODE_FONTS = [
  { id: "fraunces", name: "17", note: "Fraunces", family: "Fraunces", weight: 700, style: "italic", track: 0 },
  { id: "oswald", name: "17", note: "Oswald", family: "CoverOswald", weight: 700, style: "normal", track: 0.02 },
  { id: "bebas", name: "17", note: "Bebas", family: "CoverBebas", weight: 400, style: "normal", track: 0.04 },
  { id: "hei", name: "17", note: "思源黑体", family: "CoverHei", weight: 900, style: "normal", track: 0.04 },
  { id: "song", name: "17", note: "思源宋体", family: "CoverSong", weight: 900, style: "normal", track: 0.02 },
  { id: "butter", name: "17", note: "黄油体", family: "CoverButter", weight: 400, style: "normal", track: 0 },
  { id: "happy", name: "17", note: "快乐体", family: "CoverHappy", weight: 400, style: "normal", track: 0 },
  { id: "mashan", name: "17", note: "马善政", family: "CoverMaShan", weight: 400, style: "normal", track: 0.02 },
];

const SWATCHES = ["#ffd34d", "#f7f4ee", "#ff2a2a"];

const canvas = document.getElementById("plate");
const ctx = canvas.getContext("2d");
const stage = document.getElementById("stage");

const state = {
  size: "34",
  border: "fade",
  title: "谷雨",
  episode: "17",
  image: null,
  titleFont: "hei",
  titleColor: "#ffd34d",
  titleScale: 1,
  episodeFont: "fraunces",
  episodeColor: "#f6f3ec",
  episodeScale: 1,
  titleOffset: { x: 0, y: 0 },
  episodeOffset: { x: 0, y: 0 },
};

let textHits = { title: null, episode: null };
let textDrag = null;

function currentSize() {
  return SIZES.find((item) => item.id === state.size) || SIZES[0];
}

function setStatus(text) {
  document.getElementById("status").textContent = text;
}

function round(x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
}

function coverDraw(img, x, y, w, h) {
  const ratio = img.width / img.height;
  const box = w / h;
  let dw;
  let dh;
  if (ratio > box) {
    dh = h;
    dw = dh * ratio;
  } else {
    dw = w;
    dh = dw / ratio;
  }
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function paintStill(area, radius, shade) {
  ctx.save();
  round(area.x, area.y, area.w, area.h, radius);
  ctx.clip();
  if (state.image) {
    coverDraw(state.image, area.x, area.y, area.w, area.h);
  } else {
    const sky = ctx.createLinearGradient(area.x, area.y, area.x, area.y + area.h);
    sky.addColorStop(0, "#1e2836");
    sky.addColorStop(0.55, "#12161c");
    sky.addColorStop(1, "#08090b");
    ctx.fillStyle = sky;
    ctx.fillRect(area.x, area.y, area.w, area.h);
    const lamp = ctx.createRadialGradient(
      area.x + area.w * 0.5,
      area.y + area.h * 0.36,
      area.w * 0.01,
      area.x + area.w * 0.5,
      area.y + area.h * 0.4,
      area.w * 0.55,
    );
    lamp.addColorStop(0, "rgba(255, 220, 170, 0.28)");
    lamp.addColorStop(0.5, "rgba(80, 55, 35, 0.08)");
    lamp.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = lamp;
    ctx.fillRect(area.x, area.y, area.w, area.h);
  }
  if (shade) {
    const fade = ctx.createLinearGradient(0, area.y + area.h * 0.42, 0, area.y + area.h);
    fade.addColorStop(0, "rgba(0,0,0,0)");
    fade.addColorStop(0.5, "rgba(0,0,0,0.35)");
    fade.addColorStop(1, "rgba(0,0,0,0.88)");
    ctx.fillStyle = fade;
    ctx.fillRect(area.x, area.y, area.w, area.h);
  }
  ctx.restore();
}

function fontById(list, id) {
  return list.find((item) => item.id === id) || list[0];
}

function faceCss(font, size) {
  return `${font.style} ${font.weight} ${size}px "${font.family}", "Microsoft YaHei", sans-serif`;
}

function needsLightStroke(hex) {
  const value = hex.replace("#", "");
  const num = parseInt(value.length === 3 ? value.split("").map((c) => c + c).join("") : value, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const lum = (r * 299 + g * 587 + b * 114) / 1000;
  return lum < 80 && Math.max(r, g, b) < 170;
}

function drawLine(text, font, size, color, x, y, opts = {}) {
  ctx.font = faceCss(font, size);
  const track = opts.track ?? font.track ?? 0;
  ctx.letterSpacing = `${Math.round(size * track)}px`;
  if (!opts.plain) {
    ctx.lineWidth = Math.max(1.25, size * 0.028);
    ctx.strokeStyle = needsLightStroke(color) ? "rgba(255,255,255,0.85)" : "rgba(12, 8, 2, 0.88)";
    ctx.strokeText(text, x, y);
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = size * 0.12;
    ctx.shadowOffsetY = size * 0.03;
  }
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.letterSpacing = "0px";
}

function fitSize(text, font, size, maxWidth, floor) {
  let next = size;
  ctx.letterSpacing = `${Math.round(next * (font.track || 0))}px`;
  while (next > floor && measure(text, faceCss(font, next)) > maxWidth) {
    next -= 2;
    ctx.letterSpacing = `${Math.round(next * (font.track || 0))}px`;
  }
  ctx.letterSpacing = "0px";
  return next;
}

function textWidth(text, font, size, track) {
  ctx.font = faceCss(font, size);
  ctx.letterSpacing = `${Math.round(size * (track ?? font.track ?? 0))}px`;
  const w = ctx.measureText(text).width;
  ctx.letterSpacing = "0px";
  return w;
}

function setTextHit(key, cx, cy, w, h) {
  textHits[key] = { x: cx - w / 2, y: cy - h / 2, w, h, cx, cy };
}

function drawCopy(area, opts = {}) {
  const title = state.title.trim();
  const episode = state.episode.trim();
  textHits = { title: null, episode: null };
  if (!title && !episode) return;

  const titleFont = fontById(TITLE_FONTS, state.titleFont);
  const episodeFont = fontById(EPISODE_FONTS, state.episodeFont);
  const inset = opts.inset ?? 0.1;
  let titleSize = Math.round(Math.min(area.w * 0.15, area.h * 0.11) * state.titleScale);
  let episodeSize = Math.round(Math.min(area.w * 0.17, area.h * 0.12) * state.episodeScale);
  if (opts.hero) {
    titleSize = Math.round(Math.min(area.w * 0.2, area.h * 0.13) * state.titleScale);
    episodeSize = Math.round(titleSize * 0.52 * state.episodeScale);
  } else if (opts.compact) {
    titleSize = Math.round(Math.min(area.w * 0.16, area.h * 0.42) * state.titleScale);
    episodeSize = Math.round(titleSize * 0.48 * state.episodeScale);
  }
  if (title) titleSize = fitSize(title, titleFont, titleSize, area.w * 0.86, 28);
  if (episode) episodeSize = fitSize(episode, episodeFont, episodeSize, area.w * 0.8, 24);

  let gap = Math.round((titleSize || episodeSize) * (opts.compact ? 0.5 : opts.hero ? 0.22 : 0.2));
  let block = (title ? titleSize : 0) + (episode ? episodeSize : 0) + (title && episode ? gap : 0);
  const limit = area.h * (opts.compact ? 0.92 : 0.62);
  if (block > limit) {
    const ratio = limit / block;
    if (title) titleSize = Math.max(24, Math.round(titleSize * ratio));
    if (episode) episodeSize = Math.max(22, Math.round(episodeSize * ratio));
    gap = Math.round((titleSize || episodeSize) * (opts.compact ? 0.5 : opts.hero ? 0.22 : 0.2));
    block = (title ? titleSize : 0) + (episode ? episodeSize : 0) + (title && episode ? gap : 0);
  }

  let top = area.y + area.h - area.h * inset - block;
  if (opts.compact) top = area.y + (area.h - block) / 2;
  const cx = area.x + area.w / 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";

  const titleTrack = opts.compact ? Math.max(titleFont.track || 0, 0.1) : titleFont.track;
  const episodeTrack = opts.compact ? 0.16 : episodeFont.track;
  const offT = state.titleOffset;
  const offE = state.episodeOffset;

  let titleY = 0;
  if (title) {
    titleY = top + titleSize / 2 + offT.y;
    const titleX = cx + offT.x;
    drawLine(title, titleFont, titleSize, state.titleColor, titleX, titleY, {
      plain: opts.plain,
      track: titleTrack,
    });
    setTextHit("title", titleX, titleY, textWidth(title, titleFont, titleSize, titleTrack), titleSize);
    top += titleSize;
  }
  if (title && episode && opts.rule) {
    const titleWidth = textWidth(title, titleFont, titleSize, titleTrack);
    const rule = Math.max(28, Math.round(titleWidth * 0.42));
    const ruleH = Math.max(1, Math.round(canvas.height * 0.0016));
    const ruleX = cx + offT.x;
    ctx.fillStyle = "rgba(198, 161, 90, 0.82)";
    ctx.fillRect(Math.round(ruleX - rule / 2), Math.round(top + gap * 0.46 + offT.y), rule, ruleH);
  }
  if (title && episode) top += gap;
  if (episode) {
    const episodeY = top + episodeSize / 2 + offE.y;
    const episodeX = cx + offE.x;
    drawLine(episode, episodeFont, episodeSize, state.episodeColor, episodeX, episodeY, {
      plain: opts.plain,
      track: episodeTrack,
    });
    setTextHit("episode", episodeX, episodeY, textWidth(episode, episodeFont, episodeSize, episodeTrack), episodeSize);
  }
}

function measure(text, font) {
  ctx.font = font;
  return ctx.measureText(text).width;
}

function edge(size) {
  return Math.round(Math.min(size.w, size.h));
}

function texHash(x, y) {
  return ((x * 374761393 + y * 668265263) ^ 0x5bd1e995) >>> 0;
}

function fillPaperGrain(x, y, w, h, tone = "#f4f2ec") {
  const g = ctx.createLinearGradient(x, y, x + w * 0.6, y + h);
  g.addColorStop(0, "#faf8f3");
  g.addColorStop(0.45, tone);
  g.addColorStop(1, "#e6e2d8");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  const step = Math.max(11, Math.round(Math.min(w, h) / 52));
  for (let py = y; py < y + h; py += step) {
    for (let px = x; px < x + w; px += step) {
      const n = texHash(px, py) % 97;
      if (n < 11) {
        ctx.fillStyle = "rgba(30, 24, 18, 0.045)";
        ctx.fillRect(px, py, 1, 1);
      } else if (n > 90) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.055)";
        ctx.fillRect(px, py, 1, 1);
      }
    }
  }
}

function castInnerShadow(x, y, w, h, r, depth) {
  ctx.save();
  if (r > 0) round(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
  ctx.clip();
  const blur = Math.round(depth);
  const g = ctx.createLinearGradient(x, y, x, y + blur * 3);
  g.addColorStop(0, "rgba(0,0,0,0.22)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, blur * 3);
  const g2 = ctx.createLinearGradient(x, y + h, x, y + h - blur * 2);
  g2.addColorStop(0, "rgba(0,0,0,0.12)");
  g2.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g2;
  ctx.fillRect(x, y + h - blur * 2, w, blur * 2);
  ctx.restore();
}

function drawMatBevel(x, y, w, h, r) {
  ctx.save();
  if (r > 0) round(x, y, w, h, r);
  else {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
  }
  ctx.clip();
  const lw = Math.max(2, Math.round(Math.min(w, h) * 0.004));
  const hg = ctx.createLinearGradient(x, y, x, y + lw * 4);
  hg.addColorStop(0, "rgba(255,255,255,0.14)");
  hg.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = hg;
  ctx.fillRect(x, y, w, lw * 4);
  const sg = ctx.createLinearGradient(x, y + h, x, y + h - lw * 3);
  sg.addColorStop(0, "rgba(0,0,0,0.18)");
  sg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = sg;
  ctx.fillRect(x, y + h - lw * 3, w, lw * 3);
  ctx.restore();
}

function brushMetalOverlay(x, y, w, h, angle = 0) {
  const step = Math.max(2, Math.round(h / 140));
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  for (let i = 0; i < h; i += step) {
    const n = texHash(i, angle) % 9;
    ctx.strokeStyle = `rgba(255,255,255,${0.03 + n * 0.008})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + i);
    ctx.lineTo(x + w, y + i);
    ctx.stroke();
    if (n > 5) {
      ctx.strokeStyle = "rgba(0,0,0,0.04)";
      ctx.beginPath();
      ctx.moveTo(x, y + i + 1);
      ctx.lineTo(x + w, y + i + 1);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawGoldCorners(w, h, inset, arm) {
  ctx.strokeStyle = "rgba(198, 161, 90, 0.88)";
  ctx.lineWidth = Math.max(1, Math.round(Math.min(w, h) * 0.0014));
  ctx.lineCap = "butt";
  for (const [x, y, sx, sy] of [
    [inset, inset, 1, 1],
    [w - inset, inset, -1, 1],
    [inset, h - inset, 1, -1],
    [w - inset, h - inset, -1, -1],
  ]) {
    ctx.beginPath();
    ctx.moveTo(x + arm * sx, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + arm * sy);
    ctx.stroke();
  }
}

function drawGoldRect(x, y, w, h, inset) {
  const m = Math.round(inset);
  ctx.strokeStyle = "rgba(198, 161, 90, 0.9)";
  ctx.lineWidth = Math.max(1, Math.round(Math.min(w, h) * 0.0012));
  ctx.strokeRect(x + m + 0.5, y + m + 0.5, w - m * 2 - 1, h - m * 2 - 1);
}

function drawSprocketRail(x, y, rw, rh, side) {
  const g = ctx.createLinearGradient(x, 0, x + rw, 0);
  if (side === "left") {
    g.addColorStop(0, "#030303");
    g.addColorStop(0.55, "#0b0b0b");
    g.addColorStop(1, "#151515");
  } else {
    g.addColorStop(0, "#151515");
    g.addColorStop(0.45, "#0b0b0b");
    g.addColorStop(1, "#030303");
  }
  ctx.fillStyle = g;
  ctx.fillRect(x, y, rw, rh);
  brushMetalOverlay(x, y, rw, rh, side);
  const holeW = Math.round(rw * 0.42);
  const holeH = Math.max(2, Math.round(rh * 0.014));
  const gap = Math.round(holeH * 2.1);
  const hx = x + Math.round((rw - holeW) / 2);
  let cy = y + Math.round(gap * 0.55);
  while (cy + holeH < y + rh - gap * 0.45) {
    ctx.fillStyle = "#000";
    round(hx, cy, holeW, holeH, Math.round(holeW * 0.14));
    ctx.fill();
    cy += gap;
  }
  ctx.strokeStyle = "rgba(255,255,255,0.07)";
  ctx.lineWidth = 1;
  const edgeX = side === "left" ? x + rw - 0.5 : x + 0.5;
  ctx.beginPath();
  ctx.moveTo(edgeX, y);
  ctx.lineTo(edgeX, y + rh);
  ctx.stroke();
}

function bottomScrim(x, y, w, h, start) {
  const g = ctx.createLinearGradient(0, y + h * start, 0, y + h);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(0.38, "rgba(0,0,0,0.22)");
  g.addColorStop(0.72, "rgba(0,0,0,0.62)");
  g.addColorStop(1, "rgba(0,0,0,0.88)");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

function edgeVignette(w, h, power = 0.68) {
  const g = ctx.createRadialGradient(w * 0.5, h * 0.42, Math.min(w, h) * 0.15, w * 0.5, h * 0.48, Math.min(w, h) * 0.78);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(0.58, "rgba(0,0,0,0)");
  g.addColorStop(1, `rgba(0,0,0,${power})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function topScrim(w, h, depth) {
  const g = ctx.createLinearGradient(0, 0, 0, h * depth);
  g.addColorStop(0, "rgba(0,0,0,0.35)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h * depth);
}

function drawHairFrame(w, h, inset) {
  const m = Math.round(inset);
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = Math.max(1, Math.round(Math.min(w, h) * 0.0016));
  ctx.strokeRect(m + 1.5, m + 1.5, w - m * 2 - 3, h - m * 2 - 3);
  ctx.strokeStyle = "rgba(255,255,255,0.34)";
  ctx.lineWidth = Math.max(1, Math.round(Math.min(w, h) * 0.00085));
  ctx.strokeRect(m + 0.5, m + 0.5, w - m * 2 - 1, h - m * 2 - 1);
  ctx.restore();
}

function drawChromeBand(x, y, w, h) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, "#e8d8b4");
  g.addColorStop(0.18, "#b8924c");
  g.addColorStop(0.42, "#f3ead0");
  g.addColorStop(0.58, "#9a7b3e");
  g.addColorStop(0.82, "#d4bc82");
  g.addColorStop(1, "#7d6332");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  brushMetalOverlay(x, y, w, h, 1);
  const hi = ctx.createLinearGradient(x, y, x + w * 0.35, y);
  hi.addColorStop(0, "rgba(255,255,255,0.22)");
  hi.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = hi;
  ctx.fillRect(x, y, w, Math.max(2, Math.round(h * 0.35)));
  ctx.strokeStyle = "rgba(0,0,0,0.32)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
}

function drawLacquerRing(x, y, w, h, thick) {
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, "#c44040");
  g.addColorStop(0.35, "#8f2328");
  g.addColorStop(0.65, "#a82830");
  g.addColorStop(1, "#6b181e");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  const shine = ctx.createLinearGradient(x, y, x + w * 0.2, y + h * 0.25);
  shine.addColorStop(0, "rgba(255,200,180,0.22)");
  shine.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = shine;
  ctx.fillRect(x, y, w, Math.round(thick * 1.4));
  brushMetalOverlay(x, y, w, h, 3);
}

function drawVelvetBand(x, y, w, h) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, "rgba(18,18,20,0.97)");
  g.addColorStop(0.35, "rgba(10,10,12,0.96)");
  g.addColorStop(1, "rgba(4,4,6,0.98)");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  const step = Math.max(10, Math.round(h / 48));
  for (let py = y; py < y + h; py += step) {
    const n = texHash(py, w) % 6;
    ctx.fillStyle = `rgba(255,255,255,${0.012 + n * 0.004})`;
    ctx.fillRect(x, py, w, 1);
  }
}

function drawNeonOutline(x, y, w, h, r) {
  ctx.save();
  round(x, y, w, h, r);
  ctx.clip();
  paintStill({ x, y, w, h }, r, false);
  ctx.restore();
  castInnerShadow(x, y, w, h, r, Math.min(w, h) * 0.014);
  const lw = Math.max(1, Math.round(Math.min(w, h) * 0.0012));
  ctx.save();
  round(x, y, w, h, r);
  ctx.strokeStyle = "rgba(255, 120, 220, 0.55)";
  ctx.lineWidth = lw;
  ctx.shadowColor = "rgba(255, 90, 200, 0.45)";
  ctx.shadowBlur = Math.round(Math.min(w, h) * 0.018);
  ctx.stroke();
  ctx.shadowBlur = 0;
  round(x + lw + 0.5, y + lw + 0.5, w - (lw + 0.5) * 2, h - (lw + 0.5) * 2, Math.max(0, r - lw));
  ctx.strokeStyle = "rgba(90, 220, 255, 0.35)";
  ctx.stroke();
  ctx.restore();
}

function drawStreakBar(w, h) {
  const bw = Math.round(w * 0.038);
  const g = ctx.createLinearGradient(0, 0, bw, 0);
  g.addColorStop(0, "#9a7b3e");
  g.addColorStop(0.25, "#d4bc82");
  g.addColorStop(0.55, "#c6a15a");
  g.addColorStop(0.85, "rgba(198,161,90,0.2)");
  g.addColorStop(1, "rgba(198,161,90,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, bw, h);
  brushMetalOverlay(0, 0, bw, h, 2);
  ctx.fillStyle = "rgba(0,0,0,0.14)";
  ctx.fillRect(bw, 0, Math.round(w * 0.008), h);
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
}

function drawFrostPlate(w, h) {
  const y0 = h - Math.round(h * 0.21);
  const lift = Math.round(h * 0.08);
  const plate = ctx.createLinearGradient(0, y0 - lift, 0, h);
  plate.addColorStop(0, "rgba(255,255,255,0)");
  plate.addColorStop(0.28, "rgba(255,255,255,0.07)");
  plate.addColorStop(0.55, "rgba(200,210,220,0.06)");
  plate.addColorStop(0.72, "rgba(12,12,14,0.58)");
  plate.addColorStop(1, "rgba(6,6,8,0.86)");
  ctx.fillStyle = plate;
  ctx.fillRect(0, y0 - lift, w, h - y0 + lift);
  const step = Math.max(12, Math.round(w / 64));
  for (let py = y0; py < h; py += step) {
    for (let px = 0; px < w; px += step) {
      if (texHash(px, py) % 13 === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.035)";
        ctx.fillRect(px, py, 1, 1);
      }
    }
  }
  const lineY = y0 + 0.5;
  const span = Math.round(w * 0.22);
  const cx = w / 2;
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - span, lineY);
  ctx.lineTo(cx + span, lineY);
  ctx.stroke();
}

function cinemaGrade(w, h) {
  edgeVignette(w, h, 0.62);
  topScrim(w, h, 0.18);
  bottomScrim(0, 0, w, h, 0.34);
  const y = Math.round(h * 0.895);
  const span = Math.round(w * 0.16);
  const cx = w / 2;
  ctx.strokeStyle = "rgba(198, 161, 90, 0.42)";
  ctx.lineWidth = Math.max(1, Math.round(Math.min(w, h) * 0.0009));
  ctx.beginPath();
  ctx.moveTo(cx - span, y);
  ctx.lineTo(cx + span, y);
  ctx.stroke();
}

function drawAuraFrame(w, h, inset) {
  const m = Math.round(inset);
  ctx.save();
  ctx.strokeStyle = "rgba(198, 161, 90, 0.38)";
  ctx.lineWidth = Math.max(1, Math.round(Math.min(w, h) * 0.00095));
  ctx.shadowColor = "rgba(198, 161, 90, 0.32)";
  ctx.shadowBlur = Math.round(Math.min(w, h) * 0.022);
  ctx.strokeRect(m + 0.5, m + 0.5, w - m * 2 - 1, h - m * 2 - 1);
  ctx.restore();
}

function drawTwinFrame(w, h, inset) {
  const m = Math.round(inset);
  const gap = Math.max(2, Math.round(Math.min(w, h) * 0.012));
  const lw = Math.max(1, Math.round(Math.min(w, h) * 0.00085));
  ctx.lineWidth = lw;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
  ctx.strokeRect(m + 0.5, m + 0.5, w - m * 2 - 1, h - m * 2 - 1);
  const m2 = m + gap;
  const gg = ctx.createLinearGradient(m2, m2, w - m2, h - m2);
  gg.addColorStop(0, "rgba(232, 212, 168, 0.55)");
  gg.addColorStop(0.5, "rgba(198, 161, 90, 0.42)");
  gg.addColorStop(1, "rgba(140, 110, 58, 0.45)");
  ctx.strokeStyle = gg;
  ctx.strokeRect(m2 + 0.5, m2 + 0.5, w - m2 * 2 - 1, h - m2 * 2 - 1);
}

function drawLightLeak(w, h) {
  const warm = ctx.createRadialGradient(
    w * 0.92,
    h * 0.08,
    0,
    w * 0.72,
    h * 0.32,
    Math.min(w, h) * 0.58,
  );
  warm.addColorStop(0, "rgba(255, 142, 72, 0.26)");
  warm.addColorStop(0.42, "rgba(198, 161, 90, 0.1)");
  warm.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = warm;
  ctx.fillRect(0, 0, w, h);
  const cool = ctx.createRadialGradient(
    w * 0.06,
    h * 0.94,
    0,
    w * 0.22,
    h * 0.72,
    Math.min(w, h) * 0.42,
  );
  cool.addColorStop(0, "rgba(72, 130, 198, 0.12)");
  cool.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = cool;
  ctx.fillRect(0, 0, w, h);
}

function drawInkWash(w, h) {
  const top = ctx.createLinearGradient(0, 0, 0, h * 0.48);
  top.addColorStop(0, "rgba(0, 0, 0, 0.58)");
  top.addColorStop(0.55, "rgba(0, 0, 0, 0.12)");
  top.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, w, h * 0.5);
  const bleed = ctx.createRadialGradient(w * 0.22, h * 0.08, 0, w * 0.35, h * 0.22, w * 0.55);
  bleed.addColorStop(0, "rgba(0, 0, 0, 0.35)");
  bleed.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = bleed;
  ctx.fillRect(0, 0, w, h * 0.4);
}

function render() {
  const size = currentSize();
  const { w, h } = size;
  const e = edge(size);
  canvas.width = w;
  canvas.height = h;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#080808";
  ctx.fillRect(0, 0, w, h);

  const id = state.border;
  const full = { x: 0, y: 0, w, h };

  if (id === "polaroid") {
    fillPaperGrain(0, 0, w, h, "#f2f0ea");
    const side = Math.round(e * 0.046);
    const top = Math.round(e * 0.048);
    const bottom = Math.round(e * 0.132);
    const area = { x: side, y: top, w: w - side * 2, h: h - top - bottom };
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.28)";
    ctx.shadowBlur = Math.round(e * 0.012);
    ctx.shadowOffsetY = Math.round(e * 0.004);
    paintStill(area, 0, true);
    ctx.restore();
    castInnerShadow(area.x, area.y, area.w, area.h, 0, Math.round(e * 0.01));
    ctx.strokeStyle = "rgba(0,0,0,0.09)";
    ctx.lineWidth = 1;
    ctx.strokeRect(area.x + 0.5, area.y + 0.5, area.w - 1, area.h - 1);
    drawCopy(area, { hero: true, inset: 0.08, plain: true });
  } else if (id === "bold") {
    const pad = Math.round(e * 0.048);
    fillPaperGrain(0, 0, w, h);
    const area = { x: pad, y: pad, w: w - pad * 2, h: h - pad * 2 };
    paintStill(area, 0, true);
    castInnerShadow(area.x, area.y, area.w, area.h, 0, Math.round(e * 0.012));
    drawMatBevel(area.x, area.y, area.w, area.h, 0);
    drawCopy(area, { hero: true, inset: 0.1 });
  } else if (id === "band") {
    paintStill(full, 0, true);
    const bandH = Math.round(h * 0.16);
    const y0 = h - bandH;
    drawVelvetBand(0, y0, w, bandH);
    const goldH = Math.max(2, Math.round(h * 0.0032));
    drawChromeBand(0, y0, w, goldH);
    const pad = Math.round(bandH * 0.18);
    drawCopy(
      { x: Math.round(w * 0.08), y: y0 + goldH + pad, w: Math.round(w * 0.84), h: bandH - goldH - pad * 2 },
      { compact: true, plain: true, rule: true },
    );
  } else if (id === "chalk") {
    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, w, h);
    const pad = Math.round(e * 0.048);
    const area = { x: pad, y: pad, w: w - pad * 2, h: h - pad * 2 };
    const ring = Math.max(3, Math.round(e * 0.0065));
    drawLacquerRing(area.x - ring, area.y - ring, area.w + ring * 2, area.h + ring * 2, ring);
    ctx.fillStyle = "#121212";
    ctx.fillRect(area.x - 1, area.y - 1, area.w + 2, area.h + 2);
    paintStill(area, 0, true);
    castInnerShadow(area.x, area.y, area.w, area.h, 0, Math.round(e * 0.01));
    ctx.strokeStyle = "rgba(255,180,160,0.18)";
    ctx.lineWidth = 1;
    ctx.strokeRect(area.x + 0.5, area.y + 0.5, area.w - 1, area.h - 1);
    drawCopy(area, { hero: true, inset: 0.1, rule: true });
  } else if (id === "chrome") {
    ctx.fillStyle = "#0a0908";
    ctx.fillRect(0, 0, w, h);
    const band = Math.round(e * 0.048);
    drawChromeBand(0, 0, w, band);
    drawChromeBand(0, h - band, w, band);
    drawChromeBand(0, band, band, h - band * 2);
    drawChromeBand(w - band, band, band, h - band * 2);
    const area = { x: band, y: band, w: w - band * 2, h: h - band * 2 };
    paintStill(area, 0, true);
    castInnerShadow(area.x, area.y, area.w, area.h, 0, Math.round(e * 0.008));
    drawCopy(area, { hero: true, inset: 0.09, rule: true });
  } else if (id === "neon") {
    ctx.fillStyle = "#06060a";
    ctx.fillRect(0, 0, w, h);
    const m = Math.round(e * 0.038);
    const r = Math.round(e * 0.022);
    const area = { x: m, y: m, w: w - m * 2, h: h - m * 2 };
    drawNeonOutline(area.x, area.y, area.w, area.h, r);
    bottomScrim(area.x, area.y, area.w, area.h, 0.38);
    drawCopy(area, { hero: true, inset: 0.1, plain: true });
  } else if (id === "streak") {
    paintStill(full, 0, true);
    drawStreakBar(w, h);
    bottomScrim(0, 0, w, h, 0.42);
    const insetX = Math.round(w * 0.1);
    drawCopy({ x: insetX, y: 0, w: w - insetX, h }, { hero: true, inset: 0.1 });
  } else if (id === "fade") {
    paintStill(full, 0, false);
    bottomScrim(0, 0, w, h, 0.36);
    edgeVignette(w, h, 0.38);
    drawCopy(full, { hero: true, inset: 0.09 });
  } else if (id === "cinema") {
    paintStill(full, 0, false);
    cinemaGrade(w, h);
    drawCopy(full, { hero: true, inset: 0.1 });
  } else if (id === "bar") {
    paintStill(full, 0, false);
    drawFrostPlate(w, h);
    edgeVignette(w, h, 0.35);
    const stripH = Math.round(h * 0.2);
    const pad = Math.round(stripH * 0.14);
    drawCopy(
      { x: Math.round(w * 0.1), y: h - stripH + pad, w: Math.round(w * 0.8), h: stripH - pad * 2 },
      { compact: true, plain: true, rule: true },
    );
  } else if (id === "folio") {
    ctx.fillStyle = "#10100f";
    ctx.fillRect(0, 0, w, h);
    const m = Math.round(e * 0.038);
    const pad = Math.round(e * 0.01);
    const r = Math.round(e * 0.026);
    fillPaperGrain(m, m, w - m * 2, h - m * 2, "#f4f2ec");
    round(m, m, w - m * 2, h - m * 2, r);
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();
    drawMatBevel(m, m, w - m * 2, h - m * 2, r);
    const area = { x: m + pad, y: m + pad, w: w - (m + pad) * 2, h: h - (m + pad) * 2 };
    paintStill(area, Math.round(r * 0.85), true);
    castInnerShadow(area.x, area.y, area.w, area.h, Math.round(r * 0.85), Math.round(e * 0.01));
    drawCopy(area, { hero: true, inset: 0.1 });
  } else if (id === "round") {
    ctx.fillStyle = "#141312";
    ctx.fillRect(0, 0, w, h);
    const m = Math.round(e * 0.034);
    const r = Math.round(e * 0.024);
    fillPaperGrain(m, m, w - m * 2, h - m * 2, "#e8e5de");
    round(m, m, w - m * 2, h - m * 2, r);
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();
    drawMatBevel(m, m, w - m * 2, h - m * 2, r);
    const area = { x: m + 2, y: m + 2, w: w - m * 2 - 4, h: h - m * 2 - 4 };
    paintStill(area, Math.max(0, r - 2), true);
    castInnerShadow(area.x, area.y, area.w, area.h, Math.max(0, r - 2), Math.round(e * 0.01));
    drawCopy(area, { hero: true, inset: 0.11 });
  } else if (id === "gold") {
    paintStill(full, 0, false);
    bottomScrim(0, 0, w, h, 0.42);
    const inset = Math.round(e * 0.036);
    const arm = Math.round(e * 0.044);
    const frame = inset - Math.round(e * 0.012);
    if (frame > 2) {
      ctx.save();
      ctx.strokeStyle = "rgba(198,161,90,0.12)";
      ctx.lineWidth = Math.round(e * 0.008);
      ctx.strokeRect(frame + 0.5, frame + 0.5, w - frame * 2 - 1, h - frame * 2 - 1);
      ctx.restore();
      brushMetalOverlay(frame, frame, w - frame * 2, h - frame * 2, 0);
    }
    drawGoldCorners(w, h, inset, arm);
    drawCopy(full, { hero: true, inset: 0.1 });
  } else if (id === "hair") {
    paintStill(full, 0, false);
    bottomScrim(0, 0, w, h, 0.4);
    edgeVignette(w, h, 0.32);
    drawHairFrame(w, h, e * 0.036);
    drawCopy(full, { hero: true, inset: 0.1 });
  } else if (id === "aura") {
    paintStill(full, 0, false);
    bottomScrim(0, 0, w, h, 0.42);
    drawAuraFrame(w, h, e * 0.042);
    drawCopy(full, { hero: true, inset: 0.1 });
  } else if (id === "vignette") {
    paintStill(full, 0, false);
    edgeVignette(w, h, 0.72);
    topScrim(w, h, 0.12);
    bottomScrim(0, 0, w, h, 0.38);
    drawCopy(full, { hero: true, inset: 0.09 });
  } else if (id === "frost") {
    paintStill(full, 0, false);
    edgeVignette(w, h, 0.4);
    drawFrostPlate(w, h);
    const stripH = Math.round(h * 0.21);
    const pad = Math.round(stripH * 0.15);
    drawCopy(
      { x: Math.round(w * 0.1), y: h - stripH + pad, w: Math.round(w * 0.8), h: stripH - pad * 2 },
      { compact: true, plain: true, rule: false },
    );
  } else if (id === "reel") {
    const rail = Math.round(e * 0.044);
    ctx.fillStyle = "#040404";
    ctx.fillRect(0, 0, w, h);
    drawSprocketRail(0, 0, rail, h, "left");
    drawSprocketRail(w - rail, 0, rail, h, "right");
    const area = { x: rail, y: 0, w: w - rail * 2, h };
    paintStill(area, 0, false);
    bottomScrim(area.x, area.y, area.w, area.h, 0.4);
    edgeVignette(w, h, 0.28);
    drawCopy(area, { hero: true, inset: 0.1 });
  } else if (id === "panel") {
    paintStill(full, 0, false);
    const panelW = Math.round(w * 0.4);
    const g = ctx.createLinearGradient(0, 0, panelW, 0);
    g.addColorStop(0, "rgba(0,0,0,0.78)");
    g.addColorStop(0.65, "rgba(0,0,0,0.32)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, panelW, h);
    bottomScrim(0, 0, w, h, 0.38);
    drawCopy({ x: 0, y: 0, w: panelW, h }, { hero: true, plain: true, inset: 0.12 });
  } else if (id === "letterbox") {
    const bar = Math.round(h * 0.068);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    const area = { x: 0, y: bar, w, h: h - bar * 2 };
    paintStill(area, 0, false);
    bottomScrim(area.x, area.y, area.w, area.h, 0.42);
    edgeVignette(w, h, 0.48);
    drawCopy(area, { hero: true, inset: 0.11 });
  } else if (id === "matte") {
    ctx.fillStyle = "#0a0908";
    ctx.fillRect(0, 0, w, h);
    const m = Math.round(e * 0.052);
    const area = { x: m, y: m, w: w - m * 2, h: h - m * 2 };
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
    ctx.shadowBlur = Math.round(e * 0.018);
    fillPaperGrain(area.x - 2, area.y - 2, area.w + 4, area.h + 4, "#161412");
    ctx.restore();
    paintStill(area, 0, true);
    const inner = Math.max(2, Math.round(e * 0.012));
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.strokeRect(area.x + inner + 0.5, area.y + inner + 0.5, area.w - inner * 2 - 1, area.h - inner * 2 - 1);
    drawCopy(area, { hero: true, inset: 0.1 });
  } else if (id === "flare") {
    paintStill(full, 0, false);
    drawLightLeak(w, h);
    bottomScrim(0, 0, w, h, 0.4);
    edgeVignette(w, h, 0.36);
    drawCopy(full, { hero: true, inset: 0.1 });
  } else if (id === "twin") {
    paintStill(full, 0, false);
    bottomScrim(0, 0, w, h, 0.42);
    edgeVignette(w, h, 0.32);
    drawTwinFrame(w, h, e * 0.038);
    drawCopy(full, { hero: true, inset: 0.1, rule: true });
  } else if (id === "ink") {
    paintStill(full, 0, false);
    drawInkWash(w, h);
    bottomScrim(0, 0, w, h, 0.44);
    edgeVignette(w, h, 0.34);
    drawCopy(full, { hero: true, inset: 0.09 });
  } else {
    paintStill(full, 0, true);
    drawCopy(full, { hero: true, inset: 0.09 });
  }

  stage.classList.toggle("has-image", Boolean(state.image));
  fitPreview();
  const exportBtn = document.getElementById("export");
  exportBtn.textContent = "导出 PNG";
  exportBtn.title = `导出 ${w}×${h} PNG`;
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width;
  const sy = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * sx,
    y: (event.clientY - rect.top) * sy,
  };
}

function pickText(point) {
  const pad = Math.round(canvas.width * 0.025);
  for (const key of ["episode", "title"]) {
    const box = textHits[key];
    if (!box) continue;
    if (
      point.x >= box.x - pad &&
      point.x <= box.x + box.w + pad &&
      point.y >= box.y - pad &&
      point.y <= box.y + box.h + pad
    ) {
      return key;
    }
  }
  return null;
}

function resetTextPos() {
  state.titleOffset = { x: 0, y: 0 };
  state.episodeOffset = { x: 0, y: 0 };
  render();
  setStatus("剧名和集数位置已复位");
}

function bindTextDrag() {
  canvas.style.touchAction = "none";

  canvas.addEventListener("pointerdown", (event) => {
    const key = pickText(canvasPoint(event));
    if (!key) return;
    event.preventDefault();
    const offsetKey = key === "title" ? "titleOffset" : "episodeOffset";
    textDrag = {
      key,
      offsetKey,
      start: canvasPoint(event),
      base: { ...state[offsetKey] },
    };
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add("dragging");
    setStatus(key === "title" ? "拖动剧名" : "拖动集数");
  });

  canvas.addEventListener("pointermove", (event) => {
    if (textDrag) {
      const point = canvasPoint(event);
      const dx = point.x - textDrag.start.x;
      const dy = point.y - textDrag.start.y;
      state[textDrag.offsetKey] = {
        x: Math.round(textDrag.base.x + dx),
        y: Math.round(textDrag.base.y + dy),
      };
      render();
      return;
    }
    canvas.classList.toggle("can-drag", Boolean(pickText(canvasPoint(event))));
  });

  const endDrag = () => {
    if (!textDrag) return;
    textDrag = null;
    canvas.classList.remove("dragging");
  };

  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("lostpointercapture", endDrag);
}

function fitPreview() {
  const { w, h } = currentSize();
  const hint = document.getElementById("hint");
  const chrome = (hint?.offsetHeight || 0) + 28;
  const maxW = Math.max(120, stage.clientWidth - 24);
  const maxH = Math.max(120, stage.clientHeight - chrome);
  const ratio = w / h;
  let viewW = maxW;
  let viewH = viewW / ratio;
  if (viewH > maxH) {
    viewH = maxH;
    viewW = viewH * ratio;
  }
  canvas.style.width = `${Math.floor(viewW)}px`;
  canvas.style.height = `${Math.floor(viewH)}px`;
}

function percentLabel(scale) {
  return `${Math.round(scale * 100)}%`;
}

function syncForm() {
  document.getElementById("title").value = state.title;
  document.getElementById("episode").value = state.episode;
  document.getElementById("titleColor").value = state.titleColor;
  document.getElementById("episodeColor").value = state.episodeColor;
  document.getElementById("titleScale").value = String(state.titleScale);
  document.getElementById("episodeScale").value = String(state.episodeScale);
  document.getElementById("titleScaleLabel").textContent = percentLabel(state.titleScale);
  document.getElementById("episodeScaleLabel").textContent = percentLabel(state.episodeScale);
  document.getElementById("title").style.font = faceCss(fontById(TITLE_FONTS, state.titleFont), 22);
  document.getElementById("episode").style.font = faceCss(fontById(EPISODE_FONTS, state.episodeFont), 28);
  document.querySelectorAll("[data-border]").forEach((button) => {
    button.setAttribute("aria-checked", String(button.dataset.border === state.border));
  });
  document.querySelectorAll("[data-size]").forEach((button) => {
    button.setAttribute("aria-checked", String(button.dataset.size === state.size));
  });
  document.querySelectorAll("[data-title-font]").forEach((button) => {
    button.setAttribute("aria-checked", String(button.dataset.titleFont === state.titleFont));
  });
  document.querySelectorAll("[data-episode-font]").forEach((button) => {
    button.setAttribute("aria-checked", String(button.dataset.episodeFont === state.episodeFont));
  });
  document.querySelectorAll("[data-title-color]").forEach((button) => {
    button.setAttribute("aria-checked", String(button.dataset.titleColor.toLowerCase() === state.titleColor.toLowerCase()));
  });
  document.querySelectorAll("[data-episode-color]").forEach((button) => {
    button.setAttribute("aria-checked", String(button.dataset.episodeColor.toLowerCase() === state.episodeColor.toLowerCase()));
  });
}

function loadFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    setStatus("请换成图片文件。");
    return;
  }
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    URL.revokeObjectURL(url);
    state.image = img;
    render();
    setStatus("剧照已放上。");
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    setStatus("这张图读不了。");
  };
  img.src = url;
}

function bump(delta) {
  const n = parseInt(state.episode, 10);
  state.episode = String(Math.max(0, (Number.isFinite(n) ? n : 0) + delta));
  syncForm();
  render();
}

function exportPng() {
  const name = `${state.title || "封面"}-${state.episode || "0"}.png`.replace(/[\\/:*?"<>|]/g, "");
  canvas.toBlob((blob) => {
    if (!blob) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
    setStatus(`已导出 ${name}`);
  }, "image/png");
}

function paintFontChoices(container, fonts, attr, current) {
  fonts.forEach((font) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset[attr] = font.id;
    button.setAttribute("aria-checked", String(font.id === current));
    button.innerHTML = `<strong></strong><small>${font.note}</small>`;
    const sample = button.querySelector("strong");
    sample.textContent = font.name;
    sample.style.font = faceCss(font, 20);
    button.addEventListener("click", () => pickFont(attr, font.id));
    container.appendChild(button);
  });
}

function paintSwatches(container, attr) {
  SWATCHES.forEach((color) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset[attr] = color;
    button.style.background = color;
    button.setAttribute("aria-label", color);
    button.addEventListener("click", () => {
      if (attr === "titleColor") state.titleColor = color;
      else state.episodeColor = color;
      syncForm();
      render();
    });
    container.appendChild(button);
  });
}

function fontLoadFace(font, size, text) {
  return document.fonts.load(faceCss(font, size), text).catch(() => undefined);
}

function ensureFonts() {
  const titleFont = fontById(TITLE_FONTS, state.titleFont);
  const episodeFont = fontById(EPISODE_FONTS, state.episodeFont);
  const title = state.title.trim() || "谷雨";
  const episode = state.episode.trim() || "17";
  const size = Math.max(72, Math.round(currentSize().w * 0.14));
  return Promise.all([
    fontLoadFace(titleFont, size, title),
    fontLoadFace(episodeFont, Math.round(size * 0.55), episode),
  ]);
}

function preloadAllFonts() {
  const sample = `${state.title}${state.episode}谷雨17`;
  return Promise.all(
    [...TITLE_FONTS, ...EPISODE_FONTS].map((font) => fontLoadFace(font, 88, sample)),
  );
}

function pickFont(attr, id) {
  state[attr] = id;
  syncForm();
  render();
  ensureFonts().then(() => render());
}

function bind() {
  paintFontChoices(document.getElementById("titleFonts"), TITLE_FONTS, "titleFont", state.titleFont);
  paintFontChoices(document.getElementById("episodeFonts"), EPISODE_FONTS, "episodeFont", state.episodeFont);
  paintSwatches(document.getElementById("titleSwatches"), "titleColor");
  paintSwatches(document.getElementById("episodeSwatches"), "episodeColor");

  const sizes = document.getElementById("sizes");
  SIZES.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.size = item.id;
    button.innerHTML = `<b>${item.name}</b>`;
    button.title = item.use;
    button.addEventListener("click", () => {
      state.size = item.id;
      syncForm();
      render();
    });
    sizes.appendChild(button);
  });

  const wrap = document.getElementById("borders");
  BORDERS.forEach((border) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.border = border.id;
    button.setAttribute("aria-checked", "false");
    button.innerHTML = `<i class="mini ${border.id}"></i><span class="border-name">${border.name}</span>`;
    button.addEventListener("click", () => {
      state.border = border.id;
      syncForm();
      render();
    });
    wrap.appendChild(button);
  });

  document.getElementById("title").addEventListener("input", (event) => {
    state.title = event.target.value;
    ensureFonts().then(render);
    render();
  });
  document.getElementById("episode").addEventListener("input", (event) => {
    state.episode = event.target.value;
    render();
  });
  document.getElementById("titleColor").addEventListener("input", (event) => {
    state.titleColor = event.target.value;
    syncForm();
    render();
  });
  document.getElementById("episodeColor").addEventListener("input", (event) => {
    state.episodeColor = event.target.value;
    syncForm();
    render();
  });
  document.getElementById("titleScale").addEventListener("input", (event) => {
    state.titleScale = Number(event.target.value);
    document.getElementById("titleScaleLabel").textContent = percentLabel(state.titleScale);
    render();
  });
  document.getElementById("episodeScale").addEventListener("input", (event) => {
    state.episodeScale = Number(event.target.value);
    document.getElementById("episodeScaleLabel").textContent = percentLabel(state.episodeScale);
    render();
  });
  document.getElementById("prev").addEventListener("click", () => bump(-1));
  document.getElementById("next").addEventListener("click", () => bump(1));
  document.getElementById("pick").addEventListener("click", () => document.getElementById("file").click());
  document.getElementById("file").addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) loadFile(file);
    event.target.value = "";
  });
  document.getElementById("export").addEventListener("click", exportPng);
  document.getElementById("resetText").addEventListener("click", resetTextPos);
  bindTextDrag();

  window.addEventListener("dragover", (event) => event.preventDefault());
  window.addEventListener("drop", (event) => {
    event.preventDefault();
    const file = [...event.dataTransfer.files].find((item) => item.type.startsWith("image/"));
    if (file) loadFile(file);
  });
  window.addEventListener("paste", (event) => {
    const item = [...(event.clipboardData?.items || [])].find((entry) => entry.type.startsWith("image/"));
    const file = item && item.getAsFile();
    if (file) loadFile(file);
  });
}

bind();
syncForm();
new ResizeObserver(() => fitPreview()).observe(stage);
ensureFonts().then(() => render());
preloadAllFonts().then(() => render());
render();
setStatus("预览上可拖动剧名、集数；点「复位」还原");
