import PaperText1 from "../paper_texts/PaperText1";

function About() {
  return (
    <section className="z-20 mx-auto flex w-full max-w-3xl justify-center px-6 py-16 sm:px-10">
      <PaperText1>
        <h2 className="text-4xl font-bold">About</h2>
        <p className="mt-3 text-2xl">
          lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut
        </p>
      </PaperText1>
    </section>
  );
}

export default About;
