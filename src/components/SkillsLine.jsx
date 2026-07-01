import { useState } from "react";

const SKILL_STICKERS = [
  {
    src: "/images/stickers/skills/python.png",
    alt: "Python",
    baseRotation: -8,
    hoverRotateRange: 14,
  },
  {
    src: "/images/stickers/skills/js.png",
    alt: "JavaScript",
    baseRotation: 6,
    hoverRotateRange: 14,
  },
  {
    src: "/images/stickers/skills/cpp.png",
    alt: "C++",
    baseRotation: -5,
    hoverRotateRange: 14,
  },
  {
    src: "/images/stickers/skills/unity.png",
    alt: "Unity",
    baseRotation: 7,
    hoverRotateRange: 14,
  },
  {
    src: "/images/stickers/skills/java.png",
    alt: "Java",
    baseRotation: -6,
    hoverRotateRange: 14,
  },
];

function randomHoverRotation(range) {
  return (Math.random() - 0.5) * range;
}

function SkillSticker({ skill }) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverRotate, setHoverRotate] = useState(0);

  const handleMouseEnter = () => {
    setHoverRotate(randomHoverRotation(skill.hoverRotateRange));
    setIsHovered(true);
  };

  return (
    <button
      type="button"
      className="skills-line__item"
      aria-label={skill.alt}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered
          ? `rotate(${skill.baseRotation + hoverRotate}deg) scale(1.08)`
          : `rotate(${skill.baseRotation}deg) scale(1)`,
      }}
    >
      <img
        src={skill.src}
        alt=""
        className="skills-line__img"
        draggable={false}
        aria-hidden
      />
    </button>
  );
}

function SkillsLine({ className = "" }) {
  return (
    <div
      className={["skills-line", className].filter(Boolean).join(" ")}
      role="group"
      aria-label="Skill stickers"
    >
      {SKILL_STICKERS.map((skill) => (
        <SkillSticker key={skill.alt} skill={skill} />
      ))}
    </div>
  );
}

export default SkillsLine;
