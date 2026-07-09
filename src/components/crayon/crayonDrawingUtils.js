export const STROKE_COLOR = "#3c393a";

/**
 * Small deterministic PRNG. Each stroke gets its own seed so replaying the
 * stroke history (undo / clear / resize) reproduces the exact same jitter.
 */
export function mulberry32(seed) {
  let state = seed | 0;
  return function next() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Draws one crayon segment as several overlapping jittered mini-lines with
 * randomised offset, width, and alpha so it reads as waxy crayon rather than
 * a smooth vector pen.
 */
export function drawCrayonSegment(ctx, from, to, rng) {
  const passes = 3 + Math.floor(rng() * 3);
  for (let i = 0; i < passes; i += 1) {
    const offsetX = (rng() - 0.5) * 2.6;
    const offsetY = (rng() - 0.5) * 2.6;
    ctx.globalAlpha = 0.14 + rng() * 0.24;
    ctx.lineWidth = 2 + rng() * 2.4;
    ctx.beginPath();
    ctx.moveTo(from.x + offsetX, from.y + offsetY);
    ctx.lineTo(to.x + offsetX, to.y + offsetY);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

export function replayStroke(ctx, stroke) {
  const rng = mulberry32(stroke.seed);
  const { points } = stroke;
  if (points.length === 0) {
    return;
  }
  drawCrayonSegment(ctx, points[0], points[0], rng);
  for (let i = 1; i < points.length; i += 1) {
    drawCrayonSegment(ctx, points[i - 1], points[i], rng);
  }
}

export function applyContextDefaults(ctx) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = STROKE_COLOR;
}

export function getLocalPoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}
