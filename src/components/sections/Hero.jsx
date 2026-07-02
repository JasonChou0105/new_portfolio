import Title from "../Title";
import PhotoCard from "../PhotoCard";
import PaperSection from "../PaperSection";
import Stickers, { Sticker, stickerFrames } from "../Stickers";

function Hero() {
  return (
    <PaperSection layer={1}>
      <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col items-start gap-10 px-16 pb-12 pt-40 sm:px-10 lg:flex-row lg:items-center lg:gap-16 lg:pb-20 lg:pt-44">
        <Stickers frameIntervalMs={750}>
          <Sticker
            paperKey="python"
            frames={stickerFrames(
              "/images/stickers/skills",
              ["python.png"],
              12,
            )}
            x="40%"
            y="80%"
            size={80}
            rotation={8}
            alt="Python sticker"
          />
          <Sticker
            paperKey="js"
            frames={stickerFrames("/images/stickers/skills", ["js.png"], 10)}
            x="30%"
            y="80%"
            size={80}
            rotation={-6}
            alt="JavaScript sticker"
          />
          <Sticker
            paperKey="cpp"
            frames={stickerFrames("/images/stickers/skills", ["cpp.png"], 14)}
            x="20%"
            y="80%"
            size={80}
            rotation={7}
            alt="C++ sticker"
          />
          <Sticker
            paperKey="unity"
            frames={stickerFrames("/images/stickers/skills", ["unity.png"], 11)}
            x="10%"
            y="80%"
            size={80}
            rotation={-8}
            alt="Unity sticker"
          />
          <Sticker
            paperKey="java"
            frames={stickerFrames("/images/stickers/skills", ["java.png"], 13)}
            x="0%"
            y="80%"
            size={90}
            rotation={6}
            alt="Java sticker"
          />
          <Sticker
            paperKey="laptop"
            frames={stickerFrames(
              "/images/stickers/laptop",
              ["laptop1.png", "laptop2.png"],
              11,
            )}
            x="-5%"
            y="15%"
            size={180}
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
      </div>
    </PaperSection>
  );
}

export default Hero;
