import PaperSection from "../PaperSection";
import HobbyCard from "../HobbyCard";

const HOBBIES = [
  {
    id: "volleyball",
    title: "Volleyball",
    // Volleyball only ships a single frame, so both states reuse it.
    frameOne: "/images/stickers/volleyball.png",
    frameTwo: "/images/stickers/volleyball.png",
    rotation: 4,
    alt: "Volleyball sticker",
    backText:
      "Filler text about volleyball. I play whenever I can and love a good rally.",
  },
  {
    id: "wok",
    title: "Cooking",
    frameOne: "/images/stickers/wok/wok1.png",
    frameTwo: "/images/stickers/wok/wok2.png",
    rotation: -3,
    alt: "Wok sticker",
    backText:
      "Filler text about cooking. Tossing something in the wok is my favourite way to unwind.",
  },
  {
    id: "trumpet",
    title: "Trumpet",
    frameOne: "/images/stickers/trumpet/trumpet1.png",
    frameTwo: "/images/stickers/trumpet/trumpet2.png",
    rotation: 5,
    alt: "Trumpet sticker",
    backText:
      "Filler text about trumpet. I've been playing for years and still love the sound.",
  },
];

const [volleyball, wok, trumpet] = HOBBIES;

function About() {
  return (
    <PaperSection layer={2} id="about">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center px-6 pb-16 pt-28 sm:px-10 sm:pb-20 sm:pt-36">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
          {/* Left column */}
          <div className="flex flex-col">
            <h2 className="crayon-text text-left text-4xl text-slate-800 sm:text-5xl">
              Currently I'm...
            </h2>
            
            <p className="crayon-text mt-6 text-lg tracking-wide text-slate-800 sm:text-xl">
              Filler text for now. A 17 year old programmer and student at John
              Fraser Secondary School, building web apps, games, and experiments
              while picking up new stacks along the way.
            </p>
            <div className="crayon-text mt-14 text-lg tracking-wide text-slate-800 sm:text-xl">
              Some of my projects
              <ul className="mt-1 flex flex-col gap-1">
                <li className="flex gap-2">
                  <span aria-hidden="true">-</span>
                  <span className="flex-1">
                    Developing tech for FraserHacks 2027
                  </span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden="true">-</span>
                  <span className="flex-1">
                    Working on Payment site for John Fraser handling thousands
                    of transactions
                  </span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden="true">-</span>
                  <span className="flex-1">
                    Mini camera with thermal printer and display
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col">
            <h2 className="crayon-text text-left text-4xl text-slate-800 sm:text-5xl">
              Hobbies
            </h2>
            <div className="mt-6 flex flex-col gap-4">
              <HobbyCard hobby={volleyball} className="hobby-card--wide" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <HobbyCard hobby={wok} />
                <HobbyCard hobby={trumpet} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PaperSection>
  );
}

export default About;
