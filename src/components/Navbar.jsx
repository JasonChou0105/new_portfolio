function seededRandom(seed) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Jagged tear along the bottom edge (matches title letter rip style). */
function makeJaggedBottomClipPath(seed) {
  const r = (n) => seededRandom(seed + n);
  let n = 0;
  const steps = 28;
  const edgeJag = 11;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const points = ["0% 0%", "100% 0%", "100% 82%"];

  for (let i = steps; i >= 0; i--) {
    const x = (i / steps) * 100;
    const y = clamp(97 + (r(n++) - 0.5) * edgeJag, 86, 100);
    points.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  }

  points.push("0% 82%");
  return `polygon(${points.join(", ")})`;
}

const NAVBAR_CLIP = makeJaggedBottomClipPath(42);

const NAV_LINKS = ["About", "Projects", "Skills", "Contact"];

function Navbar() {
  return (
    <header className="navbar">
      <span
        className="navbar__shadow"
        style={{ clipPath: NAVBAR_CLIP }}
        aria-hidden
      />
      <nav
        className="navbar__bar"
        style={{ clipPath: NAVBAR_CLIP }}
        aria-label="Main navigation"
      >
        <div className="navbar__inner flex items-center justify-between pt-2">
          <a href="#" className="crayon-text navbar__brand">
            Jason Chou
          </a>
          <ul className="navbar__links">
            {NAV_LINKS.map((label) => (
              <li key={label}>
                <a href="#" className="crayon-text navbar__link">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
