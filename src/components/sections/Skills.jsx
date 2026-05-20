import SkillsLine from "../SkillsLine";

function Skills() {
  return (
    <section id="skills" className="relative z-20 w-full">
      <div className="mx-auto flex justify-center items-center w-full max-w-6xl flex-col gap-10 px-6 sm:px-10">
        <h2 className="crayon-text text-left text-4xl text-slate-800 sm:text-5xl">
          Skills
        </h2>
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-14">
          <div className="flex w-full justify-center lg:w-2/5 lg:justify-start">
            <img
              src="/images/eye_tracking/chud1.png"
              alt="Portrait"
              className="w-full max-w-xs object-contain sm:max-w-sm"
              draggable={false}
            />
          </div>
          <div className="flex w-full flex-col items-start text-left lg:w-3/5">
            <p className="crayon-text max-w-xl text-lg leading-loose tracking-wide text-slate-800 sm:text-xl">
              I build with Python, JavaScript, C++, Java, and Unity. From web
              apps and tools to games and experiments. Always picking up new
              stacks and shipping projects along the way.
            </p>
          </div>
        </div>
      </div>
      <SkillsLine frameIntervalMs={750} />
    </section>
  );
}

export default Skills;
