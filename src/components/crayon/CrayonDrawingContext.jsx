import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  applyContextDefaults,
  drawCrayonSegment,
  getLocalPoint,
  mulberry32,
} from "./crayonDrawingUtils";

const CrayonDrawingContext = createContext(null);

export function useCrayonDrawing() {
  const context = useContext(CrayonDrawingContext);
  if (!context) {
    throw new Error("useCrayonDrawing must be used within CrayonDrawingProvider");
  }
  return context;
}

export function CrayonDrawingProvider({ children }) {
  const strokeHistoryRef = useRef([]);
  const activeStrokeRef = useRef(null);
  const activeRngRef = useRef(null);
  const lastPointRef = useRef(null);
  const surfaceRedrawersRef = useRef(new Map());

  const [isDrawMode, setIsDrawMode] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [revision, setRevision] = useState(0);

  const bumpRevision = useCallback(() => {
    setRevision((value) => value + 1);
  }, []);

  const registerSurface = useCallback((surfaceId, redraw) => {
    surfaceRedrawersRef.current.set(surfaceId, redraw);
    return () => {
      surfaceRedrawersRef.current.delete(surfaceId);
    };
  }, []);

  const getStrokesForSurface = useCallback((surfaceId) => {
    return strokeHistoryRef.current
      .filter((entry) => entry.surfaceId === surfaceId)
      .map((entry) => entry.stroke);
  }, []);

  const redrawAllSurfaces = useCallback(() => {
    for (const redraw of surfaceRedrawersRef.current.values()) {
      redraw();
    }
  }, []);

  const finishStroke = useCallback(() => {
    const active = activeStrokeRef.current;
    if (!active) {
      return;
    }
    strokeHistoryRef.current.push({
      surfaceId: active.surfaceId,
      stroke: active.stroke,
    });
    activeStrokeRef.current = null;
    activeRngRef.current = null;
    lastPointRef.current = null;
    setStrokeCount(strokeHistoryRef.current.length);
    bumpRevision();
  }, [bumpRevision]);

  useEffect(() => {
    if (!isDrawMode) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsDrawMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawMode]);

  useEffect(() => {
    if (!isDrawMode) {
      finishStroke();
      return undefined;
    }

    const handlePointerMove = (event) => {
      const active = activeStrokeRef.current;
      const rng = activeRngRef.current;
      const last = lastPointRef.current;
      if (!active || !rng || !last) {
        return;
      }

      const canvas = active.canvas;
      const ctx = active.ctx;
      if (!canvas || !ctx) {
        return;
      }

      const point = getLocalPoint(event, canvas);
      const dx = point.x - last.x;
      const dy = point.y - last.y;
      if (dx * dx + dy * dy < 2) {
        return;
      }

      active.stroke.points.push(point);
      drawCrayonSegment(ctx, last, point, rng);
      lastPointRef.current = point;
    };

    const handlePointerUp = () => finishStroke();

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      finishStroke();
    };
  }, [isDrawMode, finishStroke]);

  const beginStroke = useCallback((surfaceId, canvas, ctx, event) => {
    if (!isDrawMode || event.button !== 0) {
      return;
    }

    event.preventDefault();
    applyContextDefaults(ctx);

    const seed = (Math.random() * 0xffffffff) >>> 0;
    const point = getLocalPoint(event, canvas);
    const rng = mulberry32(seed);
    const stroke = { seed, points: [point] };

    activeStrokeRef.current = { surfaceId, stroke, canvas, ctx };
    activeRngRef.current = rng;
    lastPointRef.current = point;

    drawCrayonSegment(ctx, point, point, rng);
  }, [isDrawMode]);

  const undo = useCallback(() => {
    strokeHistoryRef.current.pop();
    setStrokeCount(strokeHistoryRef.current.length);
    bumpRevision();
    redrawAllSurfaces();
  }, [bumpRevision, redrawAllSurfaces]);

  const clear = useCallback(() => {
    strokeHistoryRef.current = [];
    setStrokeCount(0);
    bumpRevision();
    redrawAllSurfaces();
  }, [bumpRevision, redrawAllSurfaces]);

  const value = useMemo(
    () => ({
      isDrawMode,
      setIsDrawMode,
      strokeCount,
      revision,
      registerSurface,
      getStrokesForSurface,
      beginStroke,
      undo,
      clear,
    }),
    [
      isDrawMode,
      strokeCount,
      revision,
      registerSurface,
      getStrokesForSurface,
      beginStroke,
      undo,
      clear,
    ],
  );

  return (
    <CrayonDrawingContext.Provider value={value}>
      {children}
    </CrayonDrawingContext.Provider>
  );
}
