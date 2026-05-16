import { useMemo, useRef, useState } from "react";

const crumpleImages = [
  "/images/background/textures/crumple_texture_1.jpg",
  "/images/background/textures/crumple_texture_2.jpg",
  "/images/background/textures/crumple_texture_3.jpg",
  "/images/background/textures/crumple_texture_4.png",
];

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function randomBetween(seed, min, max) {
  return seededRandom(seed) * (max - min) + min;
}

function randomInt(seed, min, max) {
  return Math.floor(randomBetween(seed, min, max + 1));
}

function getRandomImageExcept(currentImage) {
  const choices = crumpleImages.filter((image) => image !== currentImage);
  return choices[Math.floor(Math.random() * choices.length)];
}

function generateCrumple(index) {
  return {
    id: index,
    image:
      crumpleImages[randomInt(index * 10 + 1, 0, crumpleImages.length - 1)],
    x: randomBetween(index * 10 + 2, 0, 100),
    y: randomBetween(index * 10 + 3, 0, 100),
    size: randomBetween(index * 10 + 4, 100, 320),
    opacity: randomBetween(index * 10 + 5, 0.075, 0.15),
    rotate: randomBetween(index * 10 + 6, 0, 360),
  };
}

export default function NotebookBackground({ children, count = 35 }) {
  const containerRef = useRef(null);
  const lastHoveredIdRef = useRef(null);

  const baseCrumples = useMemo(() => {
    return Array.from({ length: count }, (_, index) => generateCrumple(index));
  }, [count]);

  const [crumpleChanges, setCrumpleChanges] = useState({});

  function handleMouseMove(event) {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let hoveredCrumple = null;

    for (const crumple of baseCrumples) {
      const crumpleX = (crumple.x / 100) * rect.width;
      const crumpleY = (crumple.y / 100) * rect.height;

      const distanceX = mouseX - crumpleX;
      const distanceY = mouseY - crumpleY;

      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const hitRadius = crumple.size * 0.45;

      if (distance < hitRadius) {
        hoveredCrumple = crumple;
        break;
      }
    }

    if (!hoveredCrumple) {
      lastHoveredIdRef.current = null;
      return;
    }

    if (lastHoveredIdRef.current === hoveredCrumple.id) {
      return;
    }

    lastHoveredIdRef.current = hoveredCrumple.id;

    setCrumpleChanges((currentChanges) => {
      const currentImage =
        currentChanges[hoveredCrumple.id]?.image || hoveredCrumple.image;

      return {
        ...currentChanges,
        [hoveredCrumple.id]: {
          image: getRandomImageExcept(currentImage),
          rotate: Math.random() * 360,
        },
      };
    });
  }

  function handleMouseLeave() {
    lastHoveredIdRef.current = null;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen overflow-hidden"
    >
      {/* lined paper background layer */}
      <div
        className="absolute inset-0 z-0 bg-repeat-y bg-top"
        style={{
          backgroundImage: "url('/images/background/lined_paper.png')",
          backgroundSize: "100% auto",
        }}
      />

      {/* crumple texture layer */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {baseCrumples.map((crumple) => {
          const change = crumpleChanges[crumple.id];

          const image = change?.image || crumple.image;
          const rotate = change?.rotate ?? crumple.rotate;

          return (
            <img
              key={crumple.id}
              src={image}
              alt=""
              className="absolute select-none"
              style={{
                left: `${crumple.x}%`,
                top: `${crumple.y}%`,
                width: `${crumple.size}px`,
                opacity: crumple.opacity,
                transform: `
                  translate(-50%, -50%)
                  rotate(${rotate}deg)
                `,
              }}
            />
          );
        })}
      </div>

      {/* content layer */}
      <main className="relative z-20 min-h-screen">{children}</main>
    </div>
  );
}
