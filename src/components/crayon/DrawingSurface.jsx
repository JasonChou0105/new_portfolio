import { useCallback, useEffect, useRef } from "react";
import { applyContextDefaults, replayStroke } from "./crayonDrawingUtils";
import { useCrayonDrawing } from "./CrayonDrawingContext";

function DrawingSurface({ id, className = "" }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const resizeRafRef = useRef(null);

  const {
    isDrawMode,
    revision,
    registerSurface,
    getStrokesForSurface,
    beginStroke,
  } = useCrayonDrawing();

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) {
      return;
    }

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    applyContextDefaults(ctx);

    for (const stroke of getStrokesForSurface(id)) {
      replayStroke(ctx, stroke);
    }
  }, [getStrokesForSurface, id]);

  const syncCanvasSize = useCallback(() => {
    redraw();
  }, [redraw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }
    ctxRef.current = canvas.getContext("2d");
    return registerSurface(id, syncCanvasSize);
  }, [id, registerSurface, syncCanvasSize]);

  useEffect(() => {
    syncCanvasSize();
  }, [revision, syncCanvasSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!parent) {
      return undefined;
    }

    const scheduleSync = () => {
      if (resizeRafRef.current !== null) {
        return;
      }
      resizeRafRef.current = window.requestAnimationFrame(() => {
        resizeRafRef.current = null;
        syncCanvasSize();
      });
    };

    const resizeObserver = new ResizeObserver(scheduleSync);
    resizeObserver.observe(parent);
    window.addEventListener("resize", scheduleSync);
    window.addEventListener("orientationchange", scheduleSync);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleSync);
      window.removeEventListener("orientationchange", scheduleSync);
      if (resizeRafRef.current !== null) {
        window.cancelAnimationFrame(resizeRafRef.current);
      }
    };
  }, [syncCanvasSize]);

  const handlePointerDown = (event) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) {
      return;
    }
    beginStroke(id, canvas, ctx, event);
  };

  return (
    <canvas
      ref={canvasRef}
      className={[
        "drawing-surface",
        isDrawMode && "drawing-surface--active",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onPointerDown={handlePointerDown}
      aria-hidden="true"
    />
  );
}

export default DrawingSurface;
