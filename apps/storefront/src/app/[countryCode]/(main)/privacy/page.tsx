import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SITE_URL } from "@lib/util/routes"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params
  const baseUrl = `${SITE_URL}/${countryCode}`

  return {
    title: "Políticas de Privacidad | Ergonómica",
    description:
      "Política de privacidad de Ergonómica (TORUS S.A.). Información sobre el tratamiento de datos personales en ergonomicadesk.com.",
    alternates: {
      canonical: `${baseUrl}/privacy`,
      languages: {
        es: `${baseUrl}/privacy`,
        en: `${baseUrl}/en/privacy`,
        "x-default": `${baseUrl}/privacy`,
      },
    },
  }
}

export default async function PrivacyPage({
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
            <li className="text-ui-fg-base">Políticas de Privacidad</li>
          </ol>
        </nav>

        <article className="prose prose-gray max-w-none">
          <h1 className="text-3xl sm:text-4xl font-semibold text-ui-fg-base mb-2">
            Políticas de Privacidad
          </h1>
          <p className="text-sm text-ui-fg-subtle mb-8">Actualizado: 2026</p>

          <div className="space-y-8 text-ui-fg-base leading-relaxed">

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                1. Datos Identificativos
              </h2>
              <p className="text-ui-fg-subtle">
                En cumplimiento con el deber de información recogido en la normativa de protección de datos, ponemos en
                su conocimiento que Ergonómica, nombre comercial de <strong>TORUS S.A.</strong>, con domicilio en Ciudad
                de Panamá, República de Panamá, es la responsable del tratamiento de los datos personales que se
                recopilan a través del sitio web <strong>ergonomicadesk.com</strong>.
              </p>
              <p className="text-ui-fg-subtle mt-3">
                Contacto: <a href="mailto:ventas@ergonomicadesk.com" className="text-ui-fg-base underline hover:no-underline">ventas@ergonomicadesk.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                2. Usuarios
              </h2>
              <p className="text-ui-fg-subtle">
                El acceso y uso del portal atribuye la condición de Usuario e implica la aceptación plena de todas las
                condiciones incluidas en este Aviso Legal. La prestación del servicio del portal tiene carácter
                indefinido. Ergonómica se reserva el derecho de interrumpir, suspender o terminar la prestación del
                servicio del portal o de cualquiera de los servicios que lo integran en cualquier momento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                3. Uso del Portal
              </h2>
              <p className="text-ui-fg-subtle">
                El portal y sus servicios son de acceso libre y gratuito. El Usuario garantiza la autenticidad y
                actualidad de todos aquellos datos que comunique a Ergonómica y será el único responsable de las
                manifestaciones falsas o inexactas que realice.
              </p>
              <p className="text-ui-fg-subtle mt-3">
                El Usuario se compromete expresamente a hacer un uso adecuado de los contenidos y servicios de
                Ergonómica y a no emplearlos para, entre otros: (a) difundir contenidos delictivos, violentos,
                pornográficos, racistas, xenófonos, ofensivos, de apología del terrorismo o, en general, contrarios a
                la ley o al orden público; (b) introducir en la red virus informáticos o realizar actuaciones
                susceptibles de alterar, estropear, interrumpir o generar errores o daños en los documentos
                electrónicos, datos o sistemas físicos y lógicos de Ergonómica o de terceras personas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                4. Protección de Datos Personales
              </h2>
              <p className="text-ui-fg-subtle">
                Ergonómica cumple con la normativa de protección de datos vigente en la República de Panamá. Los datos
                personales recabados a través de los formularios del portal son tratados con la finalidad de gestionar
                los pedidos, atender consultas y mejorar la experiencia del usuario.
              </p>
              <p className="text-ui-fg-subtle mt-3">
                Los datos de carácter personal que el usuario facilite a Ergonómica serán tratados con absoluta
                confidencialidad. Ergonómica no cederá los datos personales de los usuarios a terceros salvo obligación
                legal. Los datos serán conservados durante el tiempo necesario para cumplir con las finalidades del
                tratamiento y las obligaciones legales aplicables.
              </p>
              <p className="text-ui-fg-subtle mt-3">
                El usuario puede ejercer sus derechos de acceso, rectificación, cancelación y oposición al tratamiento
                de sus datos personales dirigiéndose a Ergonómica por correo electrónico a
                ventas@ergonomicadesk.com, indicando en el asunto "Protección de Datos".
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                5. Cookies y Tecnologías de Seguimiento
              </h2>
              <p className="text-ui-fg-subtle">
                El portal utiliza cookies propias y de terceros con fines analíticos y de personalización. Las cookies
                de terceros utilizadas incluyen las de Google Analytics y Meta Pixel para medir el rendimiento de las
                campañas publicitarias. El usuario puede configurar su navegador para rechazar las cookies, aunque esto
                podría afectar la funcionalidad del sitio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                6. Propiedad Intelectual e Industrial
              </h2>
              <p className="text-ui-fg-subtle">
                Ergonómica es titular o licenciataria de todos los derechos de propiedad intelectual e industrial sobre
                el portal, así como sobre los elementos contenidos en el mismo (a título enunciativo: imágenes,
                sonido, audio, vídeo, software, textos, marcas o logotipos, combinaciones de colores, estructura y
                diseño, selección de materiales usados, programas de ordenador necesarios para su funcionamiento,
                acceso y uso, etc.).
              </p>
              <p className="text-ui-fg-subtle mt-3">
                Todos los derechos reservados. En virtud de lo dispuesto en la normativa de propiedad intelectual
                aplicable, queda expresamente prohibida la reproducción, distribución y comunicación pública de la
                totalidad o parte de los contenidos de esta web con fines comerciales, en cualquier soporte y por
                cualquier medio técnico, sin la autorización de Ergonómica.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                7. Exclusión de Garantías y Responsabilidad
              </h2>
              <p className="text-ui-fg-subtle">
                Ergonómica no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza
                que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de
                disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos,
                a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                8. Modificaciones
              </h2>
              <p className="text-ui-fg-subtle">
                Ergonómica se reserva el derecho de efectuar sin previo aviso las modificaciones que considere
                oportunas en el portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se
                presten a través del mismo como la forma en la que éstos aparezcan presentados o localizados en el
                portal.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                9. Derecho de Exclusión
              </h2>
              <p className="text-ui-fg-subtle">
                Ergonómica se reserva el derecho a denegar o retirar el acceso al portal y/o a los servicios ofrecidos
                sin necesidad de preaviso, a instancia propia o de un tercero, a aquellos usuarios que incumplan las
                presentes Condiciones Generales de Uso.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                10. Legislación Aplicable y Jurisdicción
              </h2>
              <p className="text-ui-fg-subtle">
                La relación entre Ergonómica y el Usuario se regirá por la normativa vigente de la República de
                Panamá. Para la resolución de todas las controversias o cuestiones relacionadas con el presente portal
                o de las actividades en él desarrolladas, será de aplicación la legislación panameña, y los Juzgados y
                Tribunales de la Ciudad de Panamá serán los competentes para resolver cualquier conflicto.
              </p>
            </section>

          </div>
        </article>
      </div>
    </div>
  )
}
