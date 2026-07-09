import { useCrayonDrawing } from "./CrayonDrawingContext";

function CrayonDrawingToolbar() {
  const { isDrawMode, setIsDrawMode, strokeCount, undo, clear } =
    useCrayonDrawing();

  return (
    <div
      className="draw-toolbar crayon-text"
      role="group"
      aria-label="Drawing tools"
    >
      <button
        type="button"
        className={[
          "draw-toolbar__btn",
          "draw-toolbar__toggle",
          isDrawMode && "draw-toolbar__toggle--active",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-pressed={isDrawMode}
        onClick={() => setIsDrawMode((on) => !on)}
      >
        {isDrawMode ? "Drawing!" : "Draw"}
      </button>
      <button
        type="button"
        className="draw-toolbar__btn"
        onClick={undo}
        disabled={strokeCount === 0}
        aria-label="Undo last stroke"
      >
        Undo
      </button>
      <button
        type="button"
        className="draw-toolbar__btn"
        onClick={clear}
        disabled={strokeCount === 0}
        aria-label="Clear all drawings"
      >
        Clear
      </button>
      {isDrawMode && (
        <span className="draw-toolbar__hint">esc to stop</span>
      )}
    </div>
  );
}

export default CrayonDrawingToolbar;
