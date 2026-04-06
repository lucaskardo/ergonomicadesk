"use client"

import { useLang } from "@lib/i18n/context"
import { categoryPath } from "@lib/util/routes"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Logo from "@modules/common/components/logo"

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/ergonomicadesk/",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/ergonomicadesks/",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/50769533776",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@ergonomicadesk",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.84 1.57V6.8a4.85 4.85 0 01-1.07-.11z" />
      </svg>
    ),
  },
]

type SanityFooterLink = { _key?: string; labelEs?: string; labelEn?: string; href?: string }
type SanityFooterColumn = { _key?: string; titleEs?: string; titleEn?: string; links?: SanityFooterLink[] }

export default function Footer({ sanityColumns }: { sanityColumns?: SanityFooterColumn[] }) {
  const lang = useLang()

  const t = {
    es: {
      tagline: "Standing desks, sillas ergonómicas y todo para tu home office en Panamá.",
      products: "Productos",
      standingDesks: "Standing Desks",
      chairs: "Sillas",
      arms: "Brazos & Soportes",
      accessories: "Accesorios",
      lighting: "Iluminación",
      support: "Soporte",
      faq: "Preguntas frecuentes",
      deliveries: "Entregas",
      returns: "Devoluciones",
      warranty: "Garantía",
      catalog: "Catálogo",
      company: "Empresa",
      about: "Nosotros",
      blog: "Blog",
      showroom: "Showroom",
      commercial: "Proyectos Comerciales",
      business: "Empresas",
      contact: "Contacto",
      hours: "Lun–Vie 12PM–6PM · Sáb 9AM–12PM",
      privacy: "Privacidad",
      terms: "Términos",
      copyright: "© 2026 Ergonómica. Panamá. Todos los derechos reservados.",
    },
    en: {
      tagline: "Standing desks, ergonomic chairs and everything for your home office in Panama.",
      products: "Products",
      standingDesks: "Standing Desks",
      chairs: "Chairs",
      arms: "Arms & Stands",
      accessories: "Accessories",
      lighting: "Lighting",
      support: "Support",
      faq: "FAQ",
      deliveries: "Deliveries",
      returns: "Returns",
      warranty: "Warranty",
      catalog: "Catalog",
      company: "Company",
      about: "About Us",
      blog: "Blog",
      showroom: "Showroom",
      commercial: "Commercial Projects",
      business: "Business",
      contact: "Contact",
      hours: "Mon–Fri 12PM–6PM · Sat 9AM–12PM",
      privacy: "Privacy",
      terms: "Terms",
      copyright: "© 2026 Ergonómica. Panama. All rights reserved.",
    },
  }[lang]

  return (
    <footer className="w-full bg-ergo-950" style={{ color: "rgba(255,255,255,0.55)" }}>
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Main footer grid */}
        <div
          className="grid gap-8 py-14 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        >
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-3.5 col-span-2 sm:col-span-3 lg:col-span-1">
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-2.5 text-white hover:text-ergo-sky transition-colors"
            >
              <Logo size={28} className="text-white" />
              <span className="font-display font-extrabold text-[0.95rem] uppercase tracking-[0.06em]">
                Ergonómica
              </span>
            </LocalizedClientLink>
            <p className="text-[0.8rem] leading-relaxed" style={{ maxWidth: 240 }}>
              {t.tagline}
            </p>
            {/* Social links */}
            <div className="flex gap-1.5 mt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  className="w-8 h-8 flex items-center justify-center border border-white/10 transition-all duration-200 hover:border-ergo-sky hover:text-ergo-sky hover:bg-ergo-sky/[0.08]"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Columns 2–N: from Sanity if available, otherwise hardcoded */}
          {sanityColumns && sanityColumns.length > 0
            ? sanityColumns.map((col) => (
                <div key={col._key ?? col.titleEs} className="flex flex-col gap-3">
                  <span
                    className="text-[0.7rem] font-semibold uppercase tracking-[0.07em]"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    {lang === "en" ? col.titleEn : col.titleEs}
                  </span>
                  <ul className="flex flex-col gap-1.5 text-[0.8rem]">
                    {col.links?.map((link) => (
                      <li key={link._key ?? link.href}>
                        {link.href?.startsWith("http") ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="transition-colors hover:text-ergo-sky"
                            style={{ color: "rgba(255,255,255,0.4)" }}
                          >
                            {lang === "en" ? link.labelEn : link.labelEs}
                          </a>
                        ) : (
                          <LocalizedClientLink
                            href={link.href ?? "#"}
                            className="transition-colors hover:text-ergo-sky"
                            style={{ color: "rgba(255,255,255,0.4)" }}
                          >
                            {lang === "en" ? link.labelEn : link.labelEs}
                          </LocalizedClientLink>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            : (
              <>
                {/* Column 2: Products */}
                <div className="flex flex-col gap-3">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.07em]" style={{ color: "rgba(255,255,255,0.8)" }}>
                    {t.products}
                  </span>
                  <ul className="flex flex-col gap-1.5 text-[0.8rem]">
                    <li><LocalizedClientLink href={categoryPath("standing-desks")} className="transition-colors hover:text-ergo-sky" style={{ color: "rgba(255,255,255,0.4)" }}>{t.standingDesks}</LocalizedClientLink></li>
                    <li><LocalizedClientLink href={categoryPath("chairs")} className="transition-colors hover:text-ergo-sky" style={{ color: "rgba(255,255,255,0.4)" }}>{t.chairs}</LocalizedClientLink></li>
                    <li><LocalizedClientLink href={categoryPath("accessories")} className="transition-colors hover:text-ergo-sky" style={{ color: "rgba(255,255,255,0.4)" }}>{t.arms}</LocalizedClientLink></li>
                    <li><LocalizedClientLink href={categoryPath("accessories")} className="transition-colors hover:text-ergo-sky" style={{ color: "rgba(255,255,255,0.4)" }}>{t.accessories}</LocalizedClientLink></li>
                    <li><LocalizedClientLink href={categoryPath("accessories")} className="transition-colors hover:text-ergo-sky" style={{ color: "rgba(255,255,255,0.4)" }}>{t.lighting}</LocalizedClientLink></li>
                  </ul>
                </div>
                {/* Column 3: Support */}
                <div className="flex flex-col gap-3">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.07em]" style={{ color: "rgba(255,255,255,0.8)" }}>
                    {t.support}
                  </span>
                  <ul className="flex flex-col gap-1.5 text-[0.8rem]">
                    <li><LocalizedClientLink href="/faq" className="transition-colors hover:text-ergo-sky" style={{ color: "rgba(255,255,255,0.4)" }}>{t.faq}</LocalizedClientLink></li>
                    <li><LocalizedClientLink href="/returns" className="transition-colors hover:text-ergo-sky" style={{ color: "rgba(255,255,255,0.4)" }}>{t.deliveries}</LocalizedClientLink></li>
                    <li><LocalizedClientLink href="/returns" className="transition-colors hover:text-ergo-sky" style={{ color: "rgba(255,255,255,0.4)" }}>{t.returns}</LocalizedClientLink></li>
                    <li><LocalizedClientLink href="/warranty" className="transition-colors hover:text-ergo-sky" style={{ color: "rgba(255,255,255,0.4)" }}>{t.warranty}</LocalizedClientLink></li>
                    <li><LocalizedClientLink href="/catalog" className="transition-colors hover:text-ergo-sky" style={{ color: "rgba(255,255,255,0.4)" }}>{t.catalog}</LocalizedClientLink></li>
                  </ul>
                </div>
                {/* Column 4: Company */}
                <div className="flex flex-col gap-3">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.07em]" style={{ color: "rgba(255,255,255,0.8)" }}>{t.company}</span>
                  <ul className="flex flex-col gap-1.5 text-[0.8rem]">
                    <li><LocalizedClientLink href="/comercial" className="transition-colors hover:text-ergo-sky" style={{ color: "rgba(255,255,255,0.4)" }}>{t.commercial}</LocalizedClientLink></li>
                    <li><a href="https://www.google.com/maps/place/Ergonomica+Home+Office/@8.9936175,-79.499793,17z" target="_blank" rel="noreferrer" className="transition-colors hover:text-ergo-sky" style={{ color: "rgba(255,255,255,0.4)" }}>{t.showroom}</a></li>
                    <li><a href="https://wa.me/50769533776" target="_blank" rel="noreferrer" className="transition-colors hover:text-ergo-sky" style={{ color: "rgba(255,255,255,0.4)" }}>{t.contact}</a></li>
                  </ul>
                </div>
              </>
            )}

          {/* Column 5: Contact */}
          <div className="flex flex-col gap-3">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.07em]" style={{ color: "rgba(255,255,255,0.8)" }}>
              {t.contact}
            </span>
            <div className="flex flex-col gap-2 text-[0.8rem]">
              <div className="flex items-start gap-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mt-0.5 flex-shrink-0" style={{ color: "#5BC0EB" }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span>Calle 79 Este 14,<br />Coco del Mar, Panamá</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="flex-shrink-0" style={{ color: "#5BC0EB" }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l.9-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z" />
                </svg>
                <a href="tel:+50769533776" className="hover:text-white transition-colors">+507 6953-3776</a>
              </div>
              <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="flex-shrink-0" style={{ color: "#5BC0EB" }}>
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {t.hours}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t py-5 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-[0.72rem]" style={{ color: "rgba(255,255,255,0.25)" }}>{t.copyright}</p>
          <div className="flex items-center gap-4 text-[0.72rem]" style={{ color: "rgba(255,255,255,0.4)" }}>
            <LocalizedClientLink href="/privacy" className="hover:text-white transition-colors">
              {t.privacy}
            </LocalizedClientLink>
            <LocalizedClientLink href="/terms" className="hover:text-white transition-colors">
              {t.terms}
            </LocalizedClientLink>
            <div className="flex items-center gap-2 ml-1">
              {["VISA", "MASTERCARD", "YAPPY", "ACH"].map((pay) => (
                <span
                  key={pay}
                  className="text-[0.63rem] font-semibold px-2 py-1"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)" }}
                >
                  {pay}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
