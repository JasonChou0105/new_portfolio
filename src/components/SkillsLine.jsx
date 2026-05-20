import { useEffect, useMemo, useRef, useState } from "react";
import { useStickerTick } from "./Stickers";

const INITIAL_REPEATS = 4;

const SKILL_STICKERS = [
  {
    src: "/images/stickers/skills/python.png",
    alt: "Python",
    rotateBy: 10,
    baseRotation: -8,
  },
  {
    src: "/images/stickers/skills/js.png",
    alt: "JavaScript",
    rotateBy: 9,
    baseRotation: 6,
  },
  {
    src: "/images/stickers/skills/cpp.png",
    alt: "C++",
    rotateBy: 11,
    baseRotation: -5,
  },
  {
    src: "/images/stickers/skills/unity.png",
    alt: "Unity",
    rotateBy: 10,
    baseRotation: 7,
  },
  {
    src: "/images/stickers/skills/java.png",
    alt: "Java",
    rotateBy: 9,
    baseRotation: -6,
  },
];

function buildLoopSet(skills, repeatCount) {
  const set = [];
  for (let i = 0; i < repeatCount; i++) {
    skills.forEach((skill, skillIndex) => {
      set.push({
        ...skill,
        key: `${skill.alt}-${i}-${skillIndex}`,
      });
    });
  }
  return set;
}

function SkillsLineItem({ skill, tick }) {
  const swing = tick % 2 === 0 ? skill.rotateBy : -skill.rotateBy;
  const rotation = skill.baseRotation + swing;

  return (
    <div
      className="skills-line__item"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <img
        src={skill.src}
        alt={skill.alt}
        className="skills-line__img"
        draggable={false}
      />
    </div>
  );
}

function SkillsLine({
  frameIntervalMs = 750,
  stepPx: stepPxProp,
  stepScale = 0.25,
}) {
  const tick = useStickerTick(frameIntervalMs);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [repeatCount, setRepeatCount] = useState(INITIAL_REPEATS);
  const [stepPx, setStepPx] = useState(stepPxProp ?? 48);
  const [oneSetWidth, setOneSetWidth] = useState(0);

  const oneSet = useMemo(
    () => buildLoopSet(SKILL_STICKERS, repeatCount),
    [repeatCount],
  );

  const loopItems = useMemo(
    () => [
      ...oneSet.map((skill, index) => ({
        ...skill,
        key: `${skill.key}-set-a-${index}`,
      })),
      ...oneSet.map((skill, index) => ({
        ...skill,
        key: `${skill.key}-set-b-${index}`,
      })),
    ],
    [oneSet],
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) {
      return;
    }

    const measure = () => {
      const firstItem = track.querySelector(".skills-line__item");
      if (!firstItem) {
        return;
      }

      const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
      const itemSlot = firstItem.offsetWidth + gap;
      const viewportWidth = viewport.offsetWidth;
      const measuredOneSetWidth = track.scrollWidth / 2;

      if (measuredOneSetWidth < viewportWidth) {
        setRepeatCount((count) => count + 1);
        return;
      }

      setOneSetWidth(measuredOneSetWidth);
      setStepPx(stepPxProp ?? itemSlot * stepScale);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);

    return () => observer.disconnect();
  }, [repeatCount, loopItems, stepPxProp, stepScale]);

  const scroll = oneSetWidth > 0 ? (tick * stepPx) % oneSetWidth : 0;
  const translateX = oneSetWidth > 0 ? scroll - oneSetWidth : 0;

  return (
    <section className="skills-line" aria-label="Skills">
      <div ref={viewportRef} className="skills-line__viewport">
        <div
          ref={trackRef}
          className="skills-line__track"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {loopItems.map((skill) => (
            <SkillsLineItem key={skill.key} skill={skill} tick={tick} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillsLine;
