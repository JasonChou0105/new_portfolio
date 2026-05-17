// PaperText1.jsx

export default function PaperText1({
  children,
  className = "",
  color = "#fff3a3",
}) {
  return (
    <div
      className={[
        "relative z-20 w-140 min-h-140 overflow-visible p-10",
        "rounded-[10px]",
        "shadow-[0_6px_12px_rgba(0,0,0,0.10)]",

        "before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-[34px]",
        "before:rounded-t-[10px] before:bg-white/20 before:pointer-events-none",

        "after:content-[''] after:absolute after:inset-0 after:pointer-events-none",
        "after:rounded-[10px] after:shadow-[inset_0_-18px_28px_rgba(0,0,0,0.035)]",

        className,
      ].join(" ")}
      style={{
        background: `linear-gradient(180deg, ${color} 0%, ${color} 100%)`,
      }}
    >
      <div className="crayon-text relative z-10 text-slate-900">{children}</div>
    </div>
  );
}
