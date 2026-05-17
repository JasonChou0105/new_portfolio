import { createContext, useContext, useEffect, useMemo, useState } from "react";

const StickersContext = createContext({ tick: 0, frameIntervalMs: 1000 });

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
}) {
  const { tick } = useContext(StickersContext);
  const normalizedFrames = useMemo(
    () => normalizeFrames({ image, frames, rotateBy }),
    [image, frames, rotateBy],
  );

  const frameIndex =
    normalizedFrames.length > 0 ? tick % normalizedFrames.length : 0;

  const currentSrc = normalizedFrames[frameIndex]?.src ?? "";

  const rotation = useMemo(() => {
    if (normalizedFrames.length === 0) {
      return baseRotation;
    }

    if (normalizedFrames.length === 1) {
      const forward = normalizedFrames[0].rotateBy;
      const swing = tick % 2 === 0 ? forward : -forward;
      return baseRotation + swing;
    }

    return baseRotation + normalizedFrames[frameIndex].rotateBy;
  }, [tick, frameIndex, normalizedFrames, baseRotation]);

  if (!currentSrc) {
    return null;
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className="sticker"
      draggable={false}
      style={{
        left: toCssUnit(x),
        top: toCssUnit(y),
        width: toCssUnit(size),
        transform: `rotate(${rotation}deg)`,
      }}
    />
  );
}

export default function Stickers({
  children,
  className = "",
  frameIntervalMs = 1000,
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick((t) => t + 1);
    }, frameIntervalMs);

    return () => window.clearInterval(id);
  }, [frameIntervalMs]);

  return (
    <StickersContext.Provider value={{ tick, frameIntervalMs }}>
      <div className={["stickers", className].filter(Boolean).join(" ")}>
        {children}
      </div>
    </StickersContext.Provider>
  );
}
