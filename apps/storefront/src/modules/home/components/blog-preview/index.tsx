const CONTENT = {
  es: {
    heading: "Guías &",
    headingAccent: "Blog",
    subtitle: "Tips para armar tu setup perfecto",
    viewAll: "Ver todos",
    posts: [
      { tag: "Guía", title: "Cómo elegir el standing desk perfecto", read: "8 min" },
      { tag: "Ergonomía", title: "5 errores que están matando tu productividad", read: "6 min" },
      { tag: "Setup", title: "Guía definitiva del setup dual monitor", read: "5 min" },
      { tag: "Comparativa", title: "L-Shape vs Recto: ¿Cuál es mejor para ti?", read: "7 min" },
    ],
  },
  en: {
    heading: "Guides &",
    headingAccent: "Blog",
    subtitle: "Tips to build your perfect setup",
    viewAll: "View all",
    posts: [
      { tag: "Guide", title: "How to choose the perfect standing desk", read: "8 min" },
      { tag: "Ergonomics", title: "5 mistakes killing your productivity", read: "6 min" },
      { tag: "Setup", title: "The ultimate dual monitor setup guide", read: "5 min" },
      { tag: "Comparison", title: "L-Shape vs Straight: Which is better?", read: "7 min" },
    ],
  },
}

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

export default function BlogPreview({ lang }: { lang: "es" | "en" }) {
  const c = CONTENT[lang]
  const readLabel = lang === "en" ? "read" : "lectura"

  return (
    <section className="py-14 lg:py-24 bg-ergo-bg">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-9">
          <div>
            <h2
              className="font-display font-bold text-ergo-950 leading-[1.1] tracking-tight"
              style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em" }}
            >
              {c.heading}{" "}
              <span style={{ color: "#2A8BBF" }}>{c.headingAccent}</span>
            </h2>
            <p className="text-[0.88rem] text-ergo-400 mt-1.5">{c.subtitle}</p>
          </div>
        </div>

        {/* Blog grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: "3px" }}
        >
          {c.posts.map((post) => (
            <div
              key={post.title}
              className="flex flex-col p-7 cursor-pointer transition-transform duration-300 hover:-translate-y-1"
              style={{
                background: "linear-gradient(135deg, #2E2E2B, #4A4A45)",
                minHeight: "260px",
              }}
            >
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.12em]" style={{ color: "#5BC0EB" }}>
                {post.tag}
              </p>
              <p
                className="font-display font-bold text-white leading-[1.25] mt-2.5 flex-1"
                style={{ fontSize: "clamp(0.92rem, 1.2vw, 1.1rem)" }}
              >
                {post.title}
              </p>
              <div
                className="flex items-center gap-1.5 mt-auto pt-4 text-[0.68rem]"
                style={{ color: "rgba(91,192,235,0.5)" }}
              >
                <ClockIcon />
                {post.read} {readLabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
