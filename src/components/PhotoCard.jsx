// PhotoCard.jsx

export default function PhotoCard({
  image,
  caption,
  className = "",
  imageClassName = "",
}) {
  return (
    <div
      className={[
        "relative z-20 w-100 rounded-[18px] bg-white p-4 pb-12",
        "shadow-[0_8px_18px_rgba(0,0,0,0.12)]",
        "border border-black/5",
        "-rotate-1deg",
        "transition-transform duration-200 hover:rotate-0 hover:scale-[1.02]",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "relative aspect-4/5 w-full overflow-hidden rounded-lg",
          "bg-slate-100",
          imageClassName,
        ].join(" ")}
      >
        <img
          src={image}
          alt={caption || "Photo card image"}
          className="h-full w-full object-cover"
        />

        {/* subtle photo shine */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22)_0%,transparent_38%,rgba(0,0,0,0.04)_100%)]" />
      </div>

      {caption && (
        <p className="absolute bottom-4 left-4 right-4 text-center text-sm text-slate-700">
          {caption}
        </p>
      )}

      {/* tiny paper depth */}
      <div className="pointer-events-none absolute inset-0 rounded-[18px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.65)]" />
    </div>
  );
}
