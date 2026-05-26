/**
 * Each wrap is exactly one viewport tall in the document.
 * The inner sheet sticks until the next wrap scrolls up over it.
 */
function PaperSection({ layer = 1, id, className = "", children }) {
  return (
    <div className={`paper-section-wrap paper-section-wrap--layer-${layer}`}>
      <section
        id={id}
        className={["paper-section", className].filter(Boolean).join(" ")}
      >
        {children}
      </section>
    </div>
  );
}

export default PaperSection;
