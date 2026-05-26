import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import UnfoldingPaper, { getPaperAnchorFromElement } from "./UnfoldingPaper";

const StickersContext = createContext({
  tick: 0,
  frameIntervalMs: 1000,
  hoverMode: false,
  openPaperKey: null,
  openPaper: () => {},
  closePaper: () => {},
});

export function useStickerTick(frameIntervalMs = 1000) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick((t) => t + 1);
    }, frameIntervalMs);

    return () => window.clearInterval(id);
  }, [frameIntervalMs]);

  return tick;
}

function toCssUnit(value) {
  return typeof value === "number" ? `${value}px` : value;
}

/**
 * Build frame list from folder paths.
 * `rotateBy` is the forward rotation (degrees); each next frame rotates back by the same amount.
 */
export function stickerFrames(basePath, fileNames, rotateBy) {
  const forward = Array.isArray(rotateBy) ? (rotateBy[0] ?? 0) : rotateBy;

  return fileNames.map((name, index) => ({
    src: `${basePath.replace(/\/$/, "")}/${name}`,
    rotateBy: index % 2 === 0 ? forward : -forward,
  }));
}

function normalizeFrames({ image, frames, rotateBy = 0 }) {
  if (frames?.length) {
    return frames;
  }

  if (image) {
    return [{ src: image, rotateBy }];
  }

  return [];
}

export function Sticker({
  image,
  frames,
  rotateBy = 0,
  x,
  y,
  size,
  rotation: baseRotation = 0,
  alt = "",
  paperContent = null,
  paperKey: paperKeyProp = null,
}) {
  const { tick, hoverMode, openPaperKey, openPaper, closePaper } =
    useContext(StickersContext);
  const autoPaperKey = useId();
  const paperKey = paperKeyProp ?? autoPaperKey;
  const stickerRef = useRef(null);
  const [paperAnchor, setPaperAnchor] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const isPaperOpen = Boolean(paperContent) && openPaperKey === paperKey;

  const normalizedFrames = useMemo(
    () => normalizeFrames({ image, frames, rotateBy }),
    [image, frames, rotateBy],
  );

  const { currentSrc, rotation } = useMemo(() => {
    if (normalizedFrames.length === 0) {
      return { currentSrc: "", rotation: baseRotation };
    }

    if (hoverMode) {
      const showAltFrame =
        (isHovered || isPaperOpen) && normalizedFrames.length > 1;
      const frameIndex = showAltFrame ? 1 : 0;
      const hoverRotation = showAltFrame
        ? normalizedFrames[frameIndex]?.rotateBy ?? normalizedFrames[0].rotateBy
        : 0;

      return {
        currentSrc: normalizedFrames[frameIndex].src,
        rotation: baseRotation + hoverRotation,
      };
    }

    const frameIndex = tick % normalizedFrames.length;
    const currentSrc = normalizedFrames[frameIndex].src;

    if (normalizedFrames.length === 1) {
      const forward = normalizedFrames[0].rotateBy;
      const swing = tick % 2 === 0 ? forward : -forward;
      return { currentSrc, rotation: baseRotation + swing };
    }

    return {
      currentSrc,
      rotation: baseRotation + normalizedFrames[frameIndex].rotateBy,
    };
  }, [tick, hoverMode, isHovered, isPaperOpen, normalizedFrames, baseRotation]);

  const syncPaperAnchor = () => {
    if (!stickerRef.current) {
      return;
    }

    setPaperAnchor(
      getPaperAnchorFromElement(stickerRef.current, rotation, size),
    );
  };

  useEffect(() => {
    if (!isPaperOpen) {
      return undefined;
    }

    syncPaperAnchor();

    const handleLayoutChange = () => syncPaperAnchor();
    window.addEventListener("resize", handleLayoutChange);
    window.addEventListener("scroll", handleLayoutChange, true);

    return () => {
      window.removeEventListener("resize", handleLayoutChange);
      window.removeEventListener("scroll", handleLayoutChange, true);
    };
  }, [isPaperOpen, rotation, size]);

  const handlePaperClosed = () => {
    setPaperAnchor(null);
  };

  const handleClick = (event) => {
    if (!paperContent) {
      return;
    }

    event.stopPropagation();

    if (isPaperOpen) {
      closePaper();
      return;
    }

    syncPaperAnchor();
    openPaper(paperKey);
  };

  const handlePointerDown = (event) => {
    if (!paperContent) {
      return;
    }
    event.stopPropagation();
  };

  if (!currentSrc) {
    return null;
  }

  const isInteractive = Boolean(paperContent);

  return (
    <>
      <img
        ref={stickerRef}
        src={currentSrc}
        alt={alt}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        className={[
          "sticker",
          isInteractive && "sticker--interactive",
          hoverMode && "sticker--hoverable",
          isPaperOpen && "sticker--paper-open",
        ]
          .filter(Boolean)
          .join(" ")}
        draggable={false}
        onMouseEnter={hoverMode ? () => setIsHovered(true) : undefined}
        onMouseLeave={hoverMode ? () => setIsHovered(false) : undefined}
        onPointerDown={isInteractive ? handlePointerDown : undefined}
        onClick={isInteractive ? handleClick : undefined}
        onKeyDown={
          isInteractive
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleClick(event);
                }
              }
            : undefined
        }
        style={{
          left: toCssUnit(x),
          top: toCssUnit(y),
          width: toCssUnit(size),
          transform: `rotate(${rotation}deg) scale(${
            hoverMode && (isHovered || isPaperOpen) ? 1.08 : 1
          })`,
        }}
      />
      {paperContent && paperAnchor && (
        <UnfoldingPaper
          open={isPaperOpen}
          anchor={paperAnchor}
          onClosed={handlePaperClosed}
        >
          {paperContent}
        </UnfoldingPaper>
      )}
    </>
  );
}

function StickersAnimated({ children, className, frameIntervalMs }) {
  const tick = useStickerTick(frameIntervalMs);
  const [openPaperKey, setOpenPaperKey] = useState(null);

  const openPaper = (key) => setOpenPaperKey(key);
  const closePaper = () => setOpenPaperKey(null);

  useEffect(() => {
    if (!openPaperKey) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (
        event.target.closest(".unfolding-paper") ||
        event.target.closest(".sticker")
      ) {
        return;
      }
      closePaper();
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [openPaperKey]);

  return (
    <StickersContext.Provider
      value={{
        tick,
        frameIntervalMs,
        hoverMode: false,
        openPaperKey,
        openPaper,
        closePaper,
      }}
    >
      <div
        className={["stickers", "stickers--interactive", className]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </StickersContext.Provider>
  );
}

function StickersHover({ children, className }) {
  const [openPaperKey, setOpenPaperKey] = useState(null);

  const openPaper = (key) => setOpenPaperKey(key);
  const closePaper = () => setOpenPaperKey(null);

  useEffect(() => {
    if (!openPaperKey) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (
        event.target.closest(".unfolding-paper") ||
        event.target.closest(".sticker")
      ) {
        return;
      }
      closePaper();
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [openPaperKey]);

  return (
    <StickersContext.Provider
      value={{
        tick: 0,
        frameIntervalMs: 0,
        hoverMode: true,
        openPaperKey,
        openPaper,
        closePaper,
      }}
    >
      <div
        className={["stickers", "stickers--interactive", className]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </StickersContext.Provider>
  );
}

export default function Stickers({
  children,
  className = "",
  hoverMode = false,
  frameIntervalMs = 1000,
}) {
  if (hoverMode) {
    return <StickersHover className={className}>{children}</StickersHover>;
  }

  return (
    <StickersAnimated className={className} frameIntervalMs={frameIntervalMs}>
      {children}
    </StickersAnimated>
  );
}
