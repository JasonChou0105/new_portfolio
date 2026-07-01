import PaperSection from "../PaperSection";
import SkillsLine from "../SkillsLine";

function Skills() {
  return (
    <PaperSection layer={4} id="skills">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-6 py-16 sm:px-10 sm:py-20">
        <div className="flex flex-1 flex-col gap-10 sm:flex-row sm:items-stretch sm:gap-14">
          <div className="flex w-full shrink-0 justify-center sm:w-2/5 sm:justify-start">
            <img
              src="/images/eye_tracking/chud1.png"
              alt="Portrait"
              className="w-full max-w-xs object-contain sm:max-w-sm"
              draggable={false}
            />
          </div>
          <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
            <h2 className="crayon-text text-left text-4xl text-slate-800 sm:text-5xl">
              Skills
            </h2>
            <p className="crayon-text mt-4 max-w-xl text-lg leading-loose tracking-wide text-slate-800 sm:text-xl">
              I build with Python, JavaScript, C++, Java, and Unity. From web
              apps and tools to games and experiments — always picking up new
              stacks and shipping projects along the way.
            </p>
            <div className="min-h-6 flex-1" aria-hidden="true" />
            <SkillsLine />
          </div>
        </div>
      </div>
    </PaperSection>
  );
}

export default Skills;
