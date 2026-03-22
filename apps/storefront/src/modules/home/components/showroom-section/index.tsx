export default function ShowroomSection({ lang }: { lang: "es" | "en" }) {
  const content =
    lang === "en"
      ? {
          title: "Visit Our Showroom",
          subtitle:
            "Try before you buy. See and test our full collection in person.",
          address: "Calle 79 Este 14, Coco del Mar, Panama City",
          hours: "Mon-Fri 12PM-6PM, Sat 9AM-12PM",
          cta: "Get Directions",
        }
      : {
          title: "Visita Nuestro Showroom",
          subtitle:
            "Prueba antes de comprar. Conoce nuestra colección completa en persona.",
          address: "Calle 79 Este 14, Coco del Mar, Ciudad de Panamá",
          hours: "Lun-Vie 12PM-6PM, Sáb 9AM-12PM",
          cta: "Cómo Llegar",
        }

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Map embed */}
          <div className="w-full md:w-1/2 aspect-video rounded-xl overflow-hidden border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.7!2d-79.499793!3d8.9936175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca8e2b9272055%3A0x6a9de150083231c9!2sErgonomica%20Home%20Office!5e0!3m2!1ses!2spa!4v1700000000000!5m2!1ses!2spa"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ergonómica Showroom"
            />
          </div>
          {/* Info */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">{content.subtitle}</p>
            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-700 font-medium">{content.address}</p>
              <p className="text-sm text-gray-500">{content.hours}</p>
              <p className="text-sm text-gray-500">+507 6953-3776</p>
            </div>
            <a
              href="https://www.google.com/maps/place/Ergonomica+Home+Office/@8.9936175,-79.499793,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              {content.cta} →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
