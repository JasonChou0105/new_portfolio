import Title from "../Title";
import PhotoCard from "../PhotoCard";
import Stickers, { Sticker, stickerFrames } from "../Stickers";

function Hero() {
  return (
    <section className="relative z-20 mx-auto flex w-full max-w-6xl flex-col items-start gap-10 px-16 pb-12 pt-28 sm:px-10 lg:flex-row lg:items-center lg:gap-16 lg:pb-20 lg:pt-32">
      <Stickers frameIntervalMs={750}>
        <Sticker
          frames={stickerFrames("/images/stickers", ["volleyball.png"], [10])}
          x="38%"
          y="75%"
          size={140}
          rotation={-18}
          alt="Volleyball sticker"
        />
        <Sticker
          frames={stickerFrames(
            "/images/stickers/wok",
            ["wok1.png", "wok2.png"],
            14,
          )}
          x="40%"
          y="42%"
          size={280}
          rotation={20}
          alt="Wok sticker"
        />
        <Sticker
          frames={stickerFrames(
            "/images/stickers/trumpet",
            ["trumpet1.png", "trumpet2.png"],
            16,
          )}
          x="0%"
          y="64%"
          size={280}
          rotation={-18}
          alt="Trumpet sticker"
        />
        <Sticker
          frames={stickerFrames(
            "/images/stickers/laptop",
            ["laptop1.png", "laptop2.png"],
            11,
          )}
          x="-10%"
          y="10%"
          size={280}
          rotation={20}
          alt="Laptop sticker"
        />
      </Stickers>
      <div className="flex w-full flex-col items-start gap-5 text-left lg:w-3/5">
        <Title />
        <p className="crayon-text max-w-md text-left text-xl leading-loose tracking-wide text-slate-800 sm:text-2xl">
          17 year old programmer and student at John Fraser Secondary School.
        </p>
      </div>
      <div className="flex w-full justify-start lg:w-2/5 lg:justify-end">
        <PhotoCard
          image="/images/lil_jit.webp"
          caption="i hate this stupid site"
          className="w-full max-w-sm"
        />
      </div>
    </section>
  );
}

export default Hero;
