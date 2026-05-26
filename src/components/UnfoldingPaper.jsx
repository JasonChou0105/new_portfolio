import { useEffect, useRef, useState } from "react";

const PAPER_FRAMES = [5, 4, 3, 2, 1].map(
  (n) => `/images/unfolding_paper/paper${n}.png`,
);
const FRAME_MS = 65;
const LAST_FRAME = PAPER_FRAMES.length - 1;

function toCssUnit(value) {
  return typeof value === "number" ? `${value}px` : value;
}

function UnfoldingPaper({ open, anchor, onClosed, children }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [visible, setVisible] = useState(false);
  const frameRef = useRef(0);
  const timerRef = useRef(null);
  const openRef = useRef(open);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const runFrameSequence = (from, to, onDone) => {
    clearTimer();
    const step = from < to ? 1 : -1;
    let current = from;

    const tick = () => {
      frameRef.current = current;
      setFrameIndex(current);

      if (current === to) {
        timerRef.current = null;
        onDone?.();
        return;
      }

      current += step;
      timerRef.current = window.setTimeout(tick, FRAME_MS);
    };

    tick();
  };

  useEffect(() => {
    openRef.current = open;

    if (!anchor) {
      return undefined;
    }

    if (open) {
      setVisible(true);
      setShowContent(false);
      runFrameSequence(0, LAST_FRAME, () => {
        if (!openRef.current) {
          return;
        }
        frameRef.current = LAST_FRAME;
        setFrameIndex(LAST_FRAME);
        setShowContent(true);
      });
      return clearTimer;
    }

    if (!visible) {
      return undefined;
    }

    setShowContent(false);
    runFrameSequence(frameRef.current, 0, () => {
      frameRef.current = 0;
      setFrameIndex(0);
      setVisible(false);
      onClosed?.();
    });

    return clearTimer;
  }, [open]);

  useEffect(() => () => clearTimer(), []);

  if (!visible || !anchor) {
    return null;
  }

  const paperWidth =
    typeof anchor.size === "number"
      ? Math.min(Math.max(anchor.size * 1.55, 88), 130)
      : 110;

  return (
    <div
      className="unfolding-paper"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        left: anchor.centerX,
        top: anchor.centerY,
        width: toCssUnit(paperWidth),
        transform: `translate(-50%, -50%) rotate(${anchor.rotation ?? 0}deg)`,
        zIndex: 201,
      }}
    >
      <img
        src={PAPER_FRAMES[frameIndex]}
        alt=""
        className="unfolding-paper__frame"
        draggable={false}
        aria-hidden
      />
      <div
        className={[
          "unfolding-paper__content",
          "crayon-text",
          showContent && "unfolding-paper__content--visible",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

export default UnfoldingPaper;

export function getPaperAnchorFromElement(element, rotation = 0, size = 120) {
  const rect = element.getBoundingClientRect();

  return {
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
    size: typeof size === "number" ? size : rect.width,
    rotation,
  };
}
