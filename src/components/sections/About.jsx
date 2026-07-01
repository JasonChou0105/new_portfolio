import PaperSection from "../PaperSection";

function About() {
  return (
    <PaperSection layer={2} id="about">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col justify-center px-6 py-16 sm:px-10 sm:py-20">
        <h2 className="crayon-text text-left text-4xl text-slate-800 sm:text-5xl">
          About
        </h2>
        <p className="crayon-text mt-6 text-lg leading-loose tracking-wide text-slate-800 sm:text-xl">
          17 year old programmer and student at John Fraser Secondary School.
          I build web apps, games, and experiments — always picking up new stacks
          and shipping projects along the way.
        </p>
      </div>
    </PaperSection>
  );
}

export default About;
