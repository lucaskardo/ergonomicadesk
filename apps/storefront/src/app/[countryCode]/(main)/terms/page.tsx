import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { canonicalUrl, alternateUrls } from "@lib/util/routes"
import { getLang } from "@lib/i18n"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params
  const lang = await getLang()

  return {
    title: "Términos y Condiciones | Ergonómica",
    description:
      "Términos y condiciones de uso de ergonomicadesk.com. Conoce tus derechos y responsabilidades como usuario.",
    alternates: {
      canonical: canonicalUrl(countryCode, lang, "/terms"),
      languages: alternateUrls(countryCode, "/terms"),
    },
  }
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  await params

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-ui-fg-subtle" aria-label="breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <LocalizedClientLink href="/" className="hover:text-ui-fg-base">
                Inicio
              </LocalizedClientLink>
            </li>
            <li className="text-ui-fg-muted">/</li>
            <li className="text-ui-fg-base">Términos y Condiciones</li>
          </ol>
        </nav>

        <article className="prose prose-gray max-w-none">
          <h1 className="text-3xl sm:text-4xl font-semibold text-ui-fg-base mb-2">
            Términos y Condiciones
          </h1>
          <p className="text-sm text-ui-fg-subtle mb-8">Actualizado: 2026</p>

          <div className="space-y-8 text-ui-fg-base leading-relaxed">

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                1. Objeto y Ámbito de Aplicación
              </h2>
              <p className="text-ui-fg-subtle">
                Los presentes Términos y Condiciones regulan el acceso y uso del sitio web <strong>ergonomicadesk.com</strong>,
                titularidad de <strong>TORUS S.A.</strong>, que opera bajo el nombre comercial Ergonómica, con domicilio
                en Ciudad de Panamá, República de Panamá.
              </p>
              <p className="text-ui-fg-subtle mt-3">
                El acceso al sitio web implica la aceptación plena y sin reservas de todos los términos y condiciones
                recogidos en el presente texto. Si el usuario no está de acuerdo con estos términos, debe abstenerse
                de utilizar el sitio web.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                2. Derechos de Propiedad Intelectual
              </h2>
              <p className="text-ui-fg-subtle">
                Todos los contenidos del sitio web, incluyendo textos, fotografías, gráficos, imágenes, iconos,
                tecnología, software, enlaces y demás contenidos audiovisuales o sonoros, así como su diseño gráfico
                y códigos fuente, son propiedad intelectual de Ergonómica o de terceros que han autorizado su uso,
                sin que puedan entenderse cedidos al usuario ninguno de los derechos de explotación reconocidos por
                la normativa vigente sobre propiedad intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                3. Utilización de la Página Web
              </h2>
              <p className="text-ui-fg-subtle">
                El usuario se obliga a utilizar el sitio web, sus contenidos y servicios de conformidad con la ley,
                las presentes Condiciones de Uso, la moral y las buenas costumbres. Con carácter enunciativo y no
                limitativo, el usuario se obliga a no:
              </p>
              <ul className="list-disc list-inside text-ui-fg-subtle mt-3 space-y-1.5 pl-4">
                <li>Reproducir, copiar, distribuir, poner a disposición o de cualquier otra forma comunicar públicamente, transformar o modificar los contenidos.</li>
                <li>Suprimir, eludir o manipular el copyright y demás datos identificativos de los derechos reservados.</li>
                <li>Emplear los contenidos y servicios del sitio web para realizar publicidad, propaganda u otras actividades comerciales.</li>
                <li>Utilizar el sitio web para fines ilegales o no autorizados.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                4. Licencia sobre Comunicaciones
              </h2>
              <p className="text-ui-fg-subtle">
                En caso de que el usuario envíe información de cualquier tipo a Ergonómica a través de los canales
                habilitados, el usuario declara, garantiza y acepta que tiene derecho a hacerlo libremente, que dicha
                información no infringe ningún derecho de propiedad intelectual, de marca, de patente, secreto
                comercial, o cualquier otro derecho de terceros.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                5. Responsabilidades y Garantías
              </h2>
              <p className="text-ui-fg-subtle">
                Ergonómica no garantiza la inexistencia de interrupciones o errores en el acceso al sitio web o a
                sus contenidos, ni que éste se encuentre actualizado, aunque desarrollará sus mejores esfuerzos para,
                en su caso, evitarlos, subsanarlos o actualizarlos.
              </p>
              <p className="text-ui-fg-subtle mt-3">
                Ergonómica no será responsable de ningún daño o perjuicio producido como consecuencia de interferencias,
                omisiones, interrupciones, virus informáticos, averías telefónicas o desconexiones en el funcionamiento
                operativo de este sistema electrónico, motivadas por causas ajenas a Ergonómica.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                6. Proceso de Compra
              </h2>
              <p className="text-ui-fg-subtle">
                Los precios mostrados en el sitio web están expresados en dólares estadounidenses (USD) e incluyen
                el ITBMS (Impuesto de Transferencia de Bienes Muebles y Servicios) del 7% aplicable en Panamá.
                Ergonómica se reserva el derecho de modificar los precios en cualquier momento, si bien los precios
                aplicables serán los vigentes en el momento de la realización del pedido.
              </p>
              <p className="text-ui-fg-subtle mt-3">
                Una vez realizado el pedido, el usuario recibirá una confirmación del mismo por correo electrónico.
                Ergonómica no asumirá ninguna responsabilidad por los errores cometidos por el usuario al introducir
                los datos del pedido.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                7. Garantía de Bienes de Consumo
              </h2>
              <p className="text-ui-fg-subtle">
                Todos los productos comercializados por Ergonómica cuentan con la garantía del fabricante, cuya
                duración varía según el producto (3 a 5 años). La garantía cubre defectos de fabricación bajo
                condiciones normales de uso. Para mayor información, consulte nuestra{" "}
                <a href="/warranty" className="text-ui-fg-base underline hover:no-underline">Política de Garantía</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                8. Enlaces a Terceros
              </h2>
              <p className="text-ui-fg-subtle">
                El sitio web puede contener enlaces a otros sitios de Internet que no son operados por Ergonómica.
                Ergonómica no tiene ningún control sobre dichos sitios ni asume ninguna responsabilidad por el contenido,
                las políticas de privacidad o las prácticas de los sitios de terceros.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                9. Duración y Modificación
              </h2>
              <p className="text-ui-fg-subtle">
                Ergonómica podrá modificar en cualquier momento los términos y condiciones aquí determinados, siendo
                debidamente publicados como aquí aparecen. La vigencia de dichas condiciones irá en función de su
                exposición y estarán vigentes hasta que sean modificadas por otras debidamente publicadas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                10. Jurisdicción
              </h2>
              <p className="text-ui-fg-subtle">
                Las presentes condiciones se rigen por la legislación de la República de Panamá. Para la resolución
                de cualquier controversia que pudiera derivarse de la interpretación o cumplimiento de las presentes
                condiciones, las partes se someten a los Juzgados y Tribunales de la Ciudad de Panamá, con renuncia
                expresa a cualquier otro fuero que pudiera corresponderles.
              </p>
            </section>

          </div>
        </article>
      </div>
    </div>
  )
}
