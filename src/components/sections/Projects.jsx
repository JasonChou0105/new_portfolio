import { useEffect, useRef, useState } from "react";

const PROJECTS = [
  { id: "01", title: "Project 01" },
  { id: "02", title: "Project 02" },
  { id: "03", title: "Project 03" },
  { id: "04", title: "Project 04" },
  { id: "05", title: "Project 05" },
];

const DESKTOP_MQ = "(min-width: 1440px)";

function ProjectCard({ title, index }) {
  return (
    <article className="projects-card crayon-text shrink-0">
      <span className="projects-card__index">{String(index + 1).padStart(2, "0")}</span>
      <h3 className="projects-card__title">{title}</h3>
      <p className="projects-card__blurb">
        Notebook placeholder — swap in a real project blurb, stack, and link.
      </p>
    </article>
  );
}

function Projects() {
  const hostRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const metricsRef = useRef({
    maxTranslate: 0,
    hostHeight: 0,
    horizontalScroll: 0,
  });
  const rafRef = useRef(null);
  const [isDesktopScroll, setIsDesktopScroll] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!host || !viewport || !track) {
      return undefined;
    }

    const desktopMq = window.matchMedia(DESKTOP_MQ);
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const measure = () => {
      const desktop = desktopMq.matches;
      const reduced = motionMq.matches;
      const useHorizontal = desktop && !reduced;

      setIsDesktopScroll(useHorizontal);

      if (!useHorizontal) {
        host.style.height = "";
        track.style.transform = "";
        metricsRef.current = { maxTranslate: 0, hostHeight: 0, horizontalScroll: 0 };
        return;
      }

      const maxTranslate = Math.max(
        0,
        track.scrollWidth - viewport.clientWidth,
      );
      const horizontalScroll = maxTranslate;
      const overlapScroll = window.innerHeight;
      const hostHeight = horizontalScroll + window.innerHeight + overlapScroll;

      metricsRef.current = { maxTranslate, hostHeight, horizontalScroll };
      host.style.height = `${hostHeight}px`;
    };

    const applyScroll = () => {
      rafRef.current = null;
      const { maxTranslate, horizontalScroll } = metricsRef.current;
      if (!desktopMq.matches || motionMq.matches) {
        return;
      }

      const hostTop = host.offsetTop;
      const progress =
        horizontalScroll > 0
          ? Math.min(
              1,
              Math.max(0, (window.scrollY - hostTop) / horizontalScroll),
            )
          : 1;
      track.style.transform = `translate3d(${-progress * maxTranslate}px, 0, 0)`;
    };

    const onScroll = () => {
      if (rafRef.current !== null) {
        return;
      }
      rafRef.current = window.requestAnimationFrame(applyScroll);
    };

    const onResize = () => {
      measure();
      applyScroll();
    };

    measure();
    applyScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    desktopMq.addEventListener("change", onResize);
    motionMq.addEventListener("change", onResize);

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(track);
    resizeObserver.observe(viewport);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      desktopMq.removeEventListener("change", onResize);
      motionMq.removeEventListener("change", onResize);
      resizeObserver.disconnect();
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="projects-scroll-host paper-section-wrap--layer-3"
    >
      <section
        id="projects"
        className={[
          "paper-section projects-pin",
          isDesktopScroll && "projects-pin--active",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="projects-inner flex h-full w-full flex-col">
          <h2 className="crayon-text shrink-0 px-6 pt-24 text-left text-4xl text-slate-800 sm:px-10 sm:text-5xl">
            Projects
          </h2>

          <div
            ref={viewportRef}
            className="projects-viewport min-h-0 flex-1 overflow-x-clip lg:overflow-x-hidden lg:overflow-y-visible"
          >
            <div
              ref={trackRef}
              className={[
                "projects-track",
                isDesktopScroll
                  ? "projects-track--horizontal"
                  : "projects-track--stacked",
              ].join(" ")}
            >
              {PROJECTS.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Projects;
