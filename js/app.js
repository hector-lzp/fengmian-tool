const SIZES = [
  { id: "34", name: "3:4", use: "抖音 1080×1440", w: 1080, h: 1440 },
  { id: "916", name: "9:16", use: "全屏 1080×1920", w: 1080, h: 1920 },
  { id: "45", name: "4:5", use: "信息流 1080×1350", w: 1080, h: 1350 },
  { id: "11", name: "1:1", use: "方形 1080×1080", w: 1080, h: 1080 },
  { id: "169", name: "16:9", use: "横版 1920×1080", w: 1920, h: 1080 },
];

const BORDERS = [
  { id: "fade", name: "渐隐" },
  { id: "bar", name: "底栏" },
  { id: "round", name: "圆角" },
  { id: "reel", name: "胶片" },
  { id: "gold", name: "金角" },
  { id: "line", name: "金线" },
  { id: "scope", name: "银幕" },
  { id: "panel", name: "侧栏" },
  { id: "mount", name: "黑边" },
  { id: "white", name: "白边" },
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
};

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

function drawCopy(area, opts = {}) {
  const title = state.title.trim();
  const episode = state.episode.trim();
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
  if (title) {
    drawLine(title, titleFont, titleSize, state.titleColor, cx, top + titleSize / 2, {
      plain: opts.plain,
      track: titleTrack,
    });
    top += titleSize;
  }
  if (title && episode && opts.rule) {
    ctx.font = faceCss(titleFont, titleSize);
    ctx.letterSpacing = `${Math.round(titleSize * titleTrack)}px`;
    const titleWidth = ctx.measureText(title).width;
    ctx.letterSpacing = "0px";
    const rule = Math.max(28, Math.round(titleWidth * 0.42));
    const ruleH = Math.max(2, Math.round(canvas.height * 0.0022));
    ctx.fillStyle = "#c6a15a";
    ctx.fillRect(Math.round(cx - rule / 2), Math.round(top + gap * 0.46), rule, ruleH);
  }
  if (title && episode) top += gap;
  if (episode) {
    drawLine(episode, episodeFont, episodeSize, state.episodeColor, cx, top + episodeSize / 2, {
      plain: opts.plain,
      track: opts.compact ? 0.16 : episodeFont.track,
    });
  }
}

function measure(text, font) {
  ctx.font = font;
  return ctx.measureText(text).width;
}

function edge(size) {
  return Math.round(Math.min(size.w, size.h));
}

function drawGoldCorners(w, h, inset, arm) {
  ctx.strokeStyle = "#c6a15a";
  ctx.lineWidth = Math.max(2, Math.round(Math.min(w, h) * 0.0018));
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
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(x, y, rw, rh);
  const holeW = Math.round(rw * 0.5);
  const holeH = Math.max(3, Math.round(rh * 0.017));
  const gap = Math.round(holeH * 1.9);
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
  g.addColorStop(0.45, "rgba(0,0,0,0.45)");
  g.addColorStop(1, "rgba(0,0,0,0.9)");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
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

  if (id === "fade") {
    paintStill(full, 0, true);
    bottomScrim(0, 0, w, h, 0.38);
    drawCopy(full, { hero: true, inset: 0.09 });
  } else if (id === "bar") {
    const barH = Math.round(h * 0.19);
    const blendH = Math.round(h * 0.1);
    const photoH = h - barH;
    paintStill({ x: 0, y: 0, w, h: photoH }, 0, false);
    const blend = ctx.createLinearGradient(0, photoH - blendH, 0, h);
    blend.addColorStop(0, "rgba(8,8,8,0)");
    blend.addColorStop(0.35, "rgba(8,8,8,0.55)");
    blend.addColorStop(0.7, "rgba(8,8,8,0.92)");
    blend.addColorStop(1, "#070706");
    ctx.fillStyle = blend;
    ctx.fillRect(0, photoH - blendH, w, blendH + barH);
    const pad = Math.round(barH * 0.14);
    drawCopy(
      { x: Math.round(w * 0.1), y: h - barH + pad, w: Math.round(w * 0.8), h: barH - pad * 2 },
      { compact: true, plain: true, rule: true },
    );
  } else if (id === "round") {
    const m = Math.round(e * 0.052);
    const r = Math.round(m * 1.1);
    ctx.fillStyle = "#f5f3ee";
    ctx.fillRect(0, 0, w, h);
    const area = { x: m, y: m, w: w - m * 2, h: h - m * 2 };
    paintStill(area, r, true);
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = Math.max(3, Math.round(e * 0.004));
    round(area.x, area.y, area.w, area.h, r);
    ctx.stroke();
    drawCopy(area, { hero: true, inset: 0.11 });
  } else if (id === "gold") {
    paintStill(full, 0, true);
    const inset = Math.round(e * 0.038);
    drawGoldCorners(w, h, inset, Math.round(e * 0.05));
    drawCopy(full, { hero: true, inset: 0.1 });
  } else if (id === "line") {
    paintStill(full, 0, true);
    drawGoldRect(0, 0, w, h, e * 0.036);
    drawCopy(full, { hero: true, inset: 0.1 });
  } else if (id === "reel") {
    const rail = Math.round(e * 0.052);
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, w, h);
    drawSprocketRail(0, 0, rail, h, "left");
    drawSprocketRail(w - rail, 0, rail, h, "right");
    const area = { x: rail, y: 0, w: w - rail * 2, h };
    paintStill(area, 0, true);
    drawCopy(area, { hero: true, inset: 0.1 });
  } else if (id === "scope") {
    const band = Math.round(h * 0.075);
    const area = { x: 0, y: band, w, h: h - band * 2 };
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, w, h);
    paintStill(area, 0, true);
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, band + 0.5);
    ctx.lineTo(w, band + 0.5);
    ctx.moveTo(0, h - band + 0.5);
    ctx.lineTo(w, h - band + 0.5);
    ctx.stroke();
    drawCopy(
      { x: Math.round(w * 0.1), y: h - band + Math.round(band * 0.12), w: Math.round(w * 0.8), h: band - Math.round(band * 0.24) },
      { compact: true, plain: true },
    );
  } else if (id === "panel") {
    paintStill(full, 0, false);
    const panelW = Math.round(w * 0.44);
    const g = ctx.createLinearGradient(0, 0, panelW, 0);
    g.addColorStop(0, "rgba(0,0,0,0.82)");
    g.addColorStop(0.72, "rgba(0,0,0,0.38)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, panelW, h);
    drawCopy({ x: 0, y: 0, w: panelW, h }, { hero: true, plain: true, inset: 0.12 });
  } else if (id === "mount") {
    const m = Math.round(e * 0.028);
    ctx.fillStyle = "#0e0d0c";
    ctx.fillRect(0, 0, w, h);
    const area = { x: m, y: m, w: w - m * 2, h: h - m * 2 };
    paintStill(area, 0, true);
    drawCopy(area, { hero: true, inset: 0.09 });
  } else if (id === "white") {
    const m = Math.round(e * 0.032);
    ctx.fillStyle = "#f2efe8";
    ctx.fillRect(0, 0, w, h);
    const area = { x: m, y: m, w: w - m * 2, h: h - m * 2 };
    paintStill(area, 0, true);
    drawCopy(area, { hero: true, inset: 0.09 });
  } else {
    paintStill(full, 0, true);
    drawCopy(full, { hero: true, inset: 0.09 });
  }

  stage.classList.toggle("has-image", Boolean(state.image));
  fitPreview();
  document.getElementById("export").textContent = `导出 ${w}×${h}`;
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
    button.addEventListener("click", () => {
      if (attr === "titleFont") state.titleFont = font.id;
      else state.episodeFont = font.id;
      syncForm();
      ensureFonts().then(render);
    });
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

function ensureFonts() {
  const titleFont = fontById(TITLE_FONTS, state.titleFont);
  const episodeFont = fontById(EPISODE_FONTS, state.episodeFont);
  const sample = `${state.title}${state.episode}谷雨17`;
  const loads = [
    document.fonts.load(faceCss(titleFont, 140), sample),
    document.fonts.load(faceCss(episodeFont, 140), sample),
  ];
  for (const font of [...TITLE_FONTS, ...EPISODE_FONTS]) {
    loads.push(document.fonts.load(faceCss(font, 80), sample));
  }
  return Promise.all(loads);
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
ensureFonts().then(() => {
  render();
  setStatus("11 种边框 · 8 种剧名字体 · 胶片边框已回归");
});
