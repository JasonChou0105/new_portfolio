import { useState } from "react";

const TITLE_LINES = ["JASON", "CHOU"];

function randomHoverRotation() {
  return (Math.random() - 0.5) * 14;
}

function seededRandom(seed) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Square outline with jagged tear along each edge (letters stay inside padded box). */
function makeJaggedSquareClipPath(seed) {
  const r = (n) => seededRandom(seed + n);
  let n = 0;
  const points = [];
  const steps = 14;
  const edgeJag = 10;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const push = (x, y) => points.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);

  // top, left → right
  for (let i = 0; i <= steps; i++) {
    push((i / steps) * 100, clamp(1.5 + (r(n++) - 0.5) * edgeJag, 0, 8));
  }

  // right, top → bottom
  for (let i = 1; i <= steps; i++) {
    push(clamp(98.5 + (r(n++) - 0.5) * edgeJag, 92, 100), (i / steps) * 100);
  }

  // bottom, right → left
  for (let i = steps - 1; i >= 0; i--) {
    push((i / steps) * 100, clamp(98.5 + (r(n++) - 0.5) * edgeJag, 92, 100));
  }

  // left, bottom → top
  for (let i = steps - 1; i >= 1; i--) {
    push(clamp(1.5 + (r(n++) - 0.5) * edgeJag, 0, 8), (i / steps) * 100);
  }

  return `polygon(${points.join(", ")})`;
}

function buildLineLetterStyles(line, lineIndex) {
  return line.split("").map((char, index) => {
    const seed = lineIndex * 100 + index * 41 + 7;
    const r = (n) => seededRandom(seed + n);
    const prevChar = line[index - 1];
    const isFirstLetter = index === 0;

    return {
      key: `${char}-${lineIndex}-${index}`,
      char,
      src: `/images/title/${char}.png`,
      clipPath: makeJaggedSquareClipPath(seed),
      rotation: (r(1) - 0.5) * 14,
      translateX: isFirstLetter ? 0 : (r(2) - 0.5) * 18,
      translateY: isFirstLetter ? 0 : (r(3) - 0.5) * 14,
      scale: 0.9 + r(4) * 0.18,
      extraSpacingAfterS: prevChar === "S" && char === "O",
    };
  });
}

const TITLE_LINE_STYLES = TITLE_LINES.map((line, lineIndex) => ({
  key: `line-${lineIndex}`,
  letters: buildLineLetterStyles(line, lineIndex),
}));

function TitleLetter({ item }) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverRotate, setHoverRotate] = useState(0);

  const handleMouseEnter = () => {
    setHoverRotate(randomHoverRotation());
    setIsHovered(true);
  };

  return (
    <span
      className={[
        "title-collage__letter",
        item.extraSpacingAfterS && "title-collage__letter--after-s",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        transform: `translate(${item.translateX}px, ${item.translateY}px) rotate(${item.rotation}deg) scale(${item.scale})`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="title-collage__box-wrap"
        style={
          isHovered
            ? {
                transform: `scale(var(--title-hover-scale)) rotate(${hoverRotate}deg)`,
              }
            : undefined
        }
      >
        <span
          className="title-collage__box-shadow"
          style={{ clipPath: item.clipPath }}
          aria-hidden
        />
        <span
          className="title-collage__box"
          style={{ clipPath: item.clipPath }}
        >
          <img
            src={item.src}
            alt=""
            aria-hidden
            className="title-collage__img"
            draggable={false}
          />
        </span>
      </span>
    </span>
  );
}

function Title() {
  return (
    <div className="w-full">
      <h1 className="title-collage" aria-label="Jason Chou">
        {TITLE_LINE_STYLES.map((line) => (
          <span key={line.key} className="title-collage__line">
            {line.letters.map((item) => (
              <TitleLetter key={item.key} item={item} />
            ))}
          </span>
        ))}
      </h1>
    </div>
  );
}

export default Title;
