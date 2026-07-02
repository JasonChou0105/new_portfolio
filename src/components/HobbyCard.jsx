import { useState } from "react";

/**
 * A notebook-style hobby card.
 * - Hover (front only): swaps the sticker to its second frame, scales the card,
 *   and rotates the sticker by a fixed per-hobby angle.
 * - Click / Enter / Space: flips the card to reveal filler text on the back.
 */
function HobbyCard({ hobby, className = "" }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleFlip = () => setIsFlipped((flipped) => !flipped);

  const showFrameTwo = isHovered && !isFlipped;
  const stickerSrc = showFrameTwo ? hobby.frameTwo : hobby.frameOne;
  const stickerRotation = showFrameTwo ? hobby.rotation : 0;

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFlip();
    }
  };

  return (
    <button
      type="button"
      className={["hobby-card", isFlipped && "hobby-card--flipped", className]
        .filter(Boolean)
        .join(" ")}
      aria-pressed={isFlipped}
      aria-label={`${hobby.title} hobby card`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={toggleFlip}
      onKeyDown={handleKeyDown}
    >
      <span className="hobby-card__inner">
        <span className="hobby-card__face hobby-card__front">
          <img
            src={stickerSrc}
            alt={hobby.alt}
            className="hobby-card__sticker"
            draggable={false}
            style={{ transform: `rotate(${stickerRotation}deg)` }}
          />
          <span className="hobby-card__title crayon-text">{hobby.title}</span>
        </span>
        <span className="hobby-card__face hobby-card__back">
          <span className="hobby-card__back-title crayon-text">
            {hobby.title}
          </span>
          <span className="hobby-card__back-text">{hobby.backText}</span>
        </span>
      </span>
    </button>
  );
}

export default HobbyCard;
