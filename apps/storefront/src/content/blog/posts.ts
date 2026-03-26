export type BlogPost = {
  slug: string
  title: string
  description: string
  content: string // HTML string
  tag: string
  readTime: string
  publishedAt: string
  author: string
  keywords: string[]
  image?: string
  lang: "es" | "en"
  faqs?: Array<{ q: string; a: string }>
}

export const posts: BlogPost[] = [
  {
    slug: "como-elegir-standing-desk",
    title: "Cómo elegir el standing desk perfecto para ti",
    description:
      "Guía completa para elegir tu standing desk ideal. Comparamos motores, tamaños, y funcionalidades.",
    content: `
      <h2>¿Por qué un standing desk?</h2>
      <p>Estar sentado más de 8 horas al día aumenta el riesgo de problemas cardiovasculares, dolor de espalda y fatiga crónica. Un standing desk te permite alternar entre estar sentado y de pie durante el día.</p>
      <h2>Qué buscar en un standing desk</h2>
      <h3>1. Motor</h3>
      <p>Los escritorios de doble motor son más rápidos y silenciosos. Busca velocidades de al menos 38mm/s y niveles de ruido menores a 48dB.</p>
      <h3>2. Capacidad de peso</h3>
      <p>Si planeas tener dos monitores, laptop y accesorios, necesitas al menos 120kg de capacidad. Nuestros modelos soportan hasta 200kg.</p>
      <h3>3. Memorias de altura</h3>
      <p>Las memorias te permiten guardar tus alturas favoritas. 3 memorias es el estándar — una para sentado, una para de pie, y una extra.</p>
      <h3>4. Tamaño del sobre</h3>
      <p>120cm es suficiente para un monitor. 150cm para dual monitor. 180cm si necesitas espacio extra para documentos.</p>
      <h2>Nuestra recomendación</h2>
      <p>Para la mayoría de usuarios, un escritorio de doble motor con sobre de 150x75cm en melamina es la mejor relación calidad-precio.</p>
    `,
    tag: "Guía",
    readTime: "8 min",
    publishedAt: "2026-03-15",
    author: "Ergonómica",
    keywords: [
      "standing desk",
      "escritorio de pie",
      "ergonomía",
      "home office",
      "Panamá",
    ],
    lang: "es",
  },
  {
    slug: "errores-productividad-home-office",
    title: "5 errores que están matando tu productividad en el home office",
    description:
      "Descubre los errores más comunes de ergonomía que afectan tu productividad y cómo solucionarlos.",
    content: `
      <h2>Error #1: Monitor a la altura incorrecta</h2>
      <p>Tu monitor debe estar a la altura de tus ojos. Si miras hacia abajo, tu cuello sufre. Un brazo de monitor ajustable resuelve esto al instante.</p>
      <h2>Error #2: Silla sin soporte lumbar</h2>
      <p>Una silla sin soporte lumbar fuerza tu espalda baja. Invierte en una silla ergonómica con ajuste lumbar independiente.</p>
      <h2>Error #3: No alternar entre sentado y de pie</h2>
      <p>Incluso con la mejor silla, estar sentado 8 horas seguidas es dañino. Alterna cada 30-45 minutos con un standing desk.</p>
      <h2>Error #4: Iluminación inadecuada</h2>
      <p>La luz directa en la pantalla causa fatiga visual. Usa un ScreenBar que ilumine solo tu escritorio sin reflejos.</p>
      <h2>Error #5: Escritorio desordenado</h2>
      <p>El desorden visual reduce la concentración. Usa organizadores de cables y un desk pad para mantener todo limpio.</p>
    `,
    tag: "Ergonomía",
    readTime: "6 min",
    publishedAt: "2026-03-10",
    author: "Ergonómica",
    keywords: [
      "productividad",
      "home office",
      "ergonomía",
      "errores",
      "silla ergonómica",
    ],
    lang: "es",
  },
  {
    slug: "home-office-productivo-guia-completa",
    title: "Tu Home Office Te Está Frenando: Cómo Armar un Espacio que Multiplique Tu Productividad",
    description:
      "Tu setup de home office define cuánto produces cada día. Descubre los cambios respaldados por la ciencia que transforman tu espacio de trabajo.",
    tag: "Productividad",
    readTime: "10 min",
    publishedAt: "2026-03-26",
    author: "Ergonómica",
    keywords: [
      "home office productivo",
      "setup home office",
      "standing desk productividad",
      "silla ergonómica home office",
      "escritorio para trabajar desde casa",
      "espacio de trabajo productivo",
    ],
    lang: "es",
    faqs: [
      {
        q: "¿El standing desk es solo una moda?",
        a: "No. La evidencia científica de los últimos 10 años es consistente: alternar entre sentado y de pie mejora la salud cardiovascular, reduce el dolor lumbar y mantiene mejor la función cognitiva que estar sentado todo el día. La NASA usa escritorios de pie desde los años 90.",
      },
      {
        q: "¿Cuánto cuesta armar un home office productivo?",
        a: "Un setup básico pero efectivo (standing desk + silla ergonómica) en Ergonómica está entre $400 y $800. Es una inversión que se paga sola en productividad recuperada en menos de 3 meses si factorizas tu tarifa horaria.",
      },
      {
        q: "¿Primero la silla o el standing desk?",
        a: "Si tienes dolor de espalda activo: silla ergonómica primero. Si tu dolor es principalmente de fatiga y adormecimiento: standing desk primero. Lo ideal es ambos — se complementan, no se sustituyen.",
      },
      {
        q: "¿Cada cuánto debo pararme?",
        a: "La regla 20-8-2 es el estándar basado en evidencia: 20 min sentado, 8 de pie, 2 caminando. Si no puedes cumplirla exacta, cualquier alternancia es mejor que ninguna. Incluso levantarte 2 minutos cada hora mejora significativamente los marcadores de salud.",
      },
      {
        q: "¿Las plantas en el escritorio realmente ayudan a la productividad?",
        a: "Sí, aunque modestamente. Un estudio de la University of Exeter encontró un 15% de mejora en productividad en espacios con plantas vivas. El efecto se atribuye a la reducción de estrés visual y mejora de calidad del aire. Son un complemento — no un sustituto del mobiliario ergonómico.",
      },
    ],
    content: `
<p class="blog-lead">Llevas tres horas sentado. Te duele la espalda. Estás leyendo el mismo párrafo por tercera vez. No es falta de disciplina — es tu entorno saboteando tu cerebro.</p>

<p>El 73% de los trabajadores remotos reportan menor productividad en casa que en una oficina equipada. La diferencia rara vez es motivación o tiempo — es ergonomía.</p>

<h2>Por qué tu cuerpo controla tu productividad</h2>

<p>Hay una creencia extendida de que la productividad es un asunto mental: concentración, hábitos, disciplina. Pero la neurociencia dice otra cosa.</p>

<p>Un estudio de la <strong>Texas A&amp;M University (2024)</strong> encontró que <strong>el 80% de los trabajadores con escritorios tradicionales</strong> reportaron dolor lumbar crónico durante la jornada, comparado con el 50% de quienes usaban standing desks con alternancia. El dolor activa el sistema nervioso simpático — el mismo mecanismo del estrés — lo que fragmenta la atención y eleva los errores.</p>

<p>Un meta-análisis publicado en <em>Trends in Cognitive Sciences (2024)</em> confirmó que el sedentarismo prolongado reduce el flujo sanguíneo cerebral en un 7.5% cada hora de inactividad, afectando directamente la memoria de trabajo y la toma de decisiones. No es cansancio — es física.</p>

<p>Tu setup no es neutral. O te facilita el trabajo, o te lo dificulta.</p>

<h2>Los 4 cambios que más impacto tienen</h2>

<h3>1. Standing desk: la inversión más rentable del home office</h3>

<p>Un estudio conjunto de <strong>Mount Sinai y Steelcase</strong> con seguimiento a 12 meses encontró que el 65% de los participantes reportó mayor productividad al usar standing desks eléctricos. El 87% mantuvo el hábito pasado el primer mes — lo que indica que funciona de verdad, no solo como novedad.</p>

<p>El mecanismo es simple: alternar entre sentado y de pie mejora la circulación, reduce la fatiga muscular y mantiene el sistema nervioso activo sin sobreestimularlo.</p>

<a href="/pa/store?category_id=standing-desks" class="blog-cta">Ver standing desks con motor dual →</a>

<h3>2. Silla ergonómica: donde pasas el 60% del tiempo</h3>

<p>Aunque el standing desk es la mejora más visible, la realidad es que seguirás sentado una parte del día. La diferencia entre una silla genérica y una ergonómica no es el precio — es el soporte lumbar ajustable, la malla transpirable que regula la temperatura, y los apoyabrazos que eliminan la tensión de hombros y cuello.</p>

<p>Una silla ergonómica correctamente ajustada reduce el dolor de espalda baja en un 54% en las primeras 4 semanas de uso (<em>Journal of Physical Therapy Science, 2023</em>).</p>

<a href="/pa/store?category_id=sillas" class="blog-cta">Ver sillas ergonómicas →</a>

<h3>3. Orden visual = claridad mental</h3>

<p>El <strong>Princeton Neuroscience Institute</strong> demostró que el desorden visual compite por recursos cognitivos — literalmente, cada objeto fuera de lugar en tu campo visual consume capacidad mental que podrías usar para trabajar.</p>

<p>Organizadores de cables, un desk pad que delimite tu zona de trabajo, y superficies despejadas no son estética — son higiene cognitiva.</p>

<a href="/pa/store?category_id=accesorios" class="blog-cta">Ver accesorios de organización →</a>

<h3>4. Monitor a la altura correcta</h3>

<p>El top de tu monitor debe quedar a la altura de tus ojos o 5cm por debajo. Si miras hacia abajo, tu cuello carga el peso adicional de tu cabeza en posición adelantada — lo que equivale a cargar 10–15kg extra según la American Chiropractic Association.</p>

<p>Un brazo de monitor ajustable resuelve esto por menos de $50 y elimina el dolor de cuello en semanas.</p>

<h2>La regla 20-8-2</h2>

<p>No se trata de estar de pie todo el día — eso también fatiga. La fórmula respaldada por investigaciones de la <strong>Cornell University Ergonomics Lab</strong> es:</p>

<ul>
  <li><strong>20 minutos</strong> sentado trabajando</li>
  <li><strong>8 minutos</strong> de pie en el escritorio</li>
  <li><strong>2 minutos</strong> de movimiento ligero (caminar, estirarse)</li>
</ul>

<p>Este ciclo de 30 minutos mantiene la circulación activa, reduce la fatiga y mejora la concentración sostenida. La mayoría de standing desks con temporizador incorporado facilitan este hábito automáticamente.</p>

<h2>Checklist: Home office productivo</h2>

<ul>
  <li>✅ Standing desk eléctrico con memoria de alturas</li>
  <li>✅ Silla ergonómica con soporte lumbar ajustable</li>
  <li>✅ Monitor a la altura de los ojos (brazo ajustable)</li>
  <li>✅ Iluminación de escritorio sin reflejos en pantalla</li>
  <li>✅ Cables organizados y fuera de la vista</li>
  <li>✅ Desk pad que delimita el área de trabajo</li>
  <li>✅ Temporizador 20-8-2 activo</li>
  <li>✅ Espacio libre de distractores visuales</li>
</ul>

<h2>Preguntas frecuentes</h2>

<h3>¿El standing desk es solo una moda?</h3>
<p>No. La evidencia científica de los últimos 10 años es consistente: alternar entre sentado y de pie mejora la salud cardiovascular, reduce el dolor lumbar y mantiene mejor la función cognitiva que estar sentado todo el día. La NASA usa escritorios de pie desde los años 90.</p>

<h3>¿Cuánto cuesta armar un home office productivo?</h3>
<p>Un setup básico pero efectivo (standing desk + silla ergonómica) en Ergonómica está entre $400 y $800. Es una inversión que se paga sola en productividad recuperada en menos de 3 meses si factorizas tu tarifa horaria.</p>

<h3>¿Primero la silla o el standing desk?</h3>
<p>Si tienes dolor de espalda activo: silla ergonómica primero. Si tu dolor es principalmente de fatiga y adormecimiento: standing desk primero. Lo ideal es ambos — se complementan, no se sustituyen.</p>

<h3>¿Cada cuánto debo pararme?</h3>
<p>La regla 20-8-2 es el estándar basado en evidencia: 20 min sentado, 8 de pie, 2 caminando. Si no puedes cumplirla exacta, cualquier alternancia es mejor que ninguna. Incluso levantarte 2 minutos cada hora mejora significativamente los marcadores de salud.</p>

<h3>¿Las plantas en el escritorio realmente ayudan a la productividad?</h3>
<p>Sí, aunque modestamente. Un estudio de la University of Exeter encontró un 15% de mejora en productividad en espacios con plantas vivas. El efecto se atribuye a la reducción de estrés visual y mejora de calidad del aire. Son un complemento — no un sustituto del mobiliario ergonómico.</p>
    `,
  },
  {
    slug: "roi-productividad-ergonomia-empresas",
    title: "El Mejor ROI en Productividad No Es un Seminario: Es el Setup de Tu Equipo",
    description:
      "Las empresas gastan miles en capacitaciones sin retorno medible. La inversión con mayor ROI comprobado en productividad es el mobiliario ergonómico. Los números no mienten.",
    tag: "Empresas",
    readTime: "12 min",
    publishedAt: "2026-03-26",
    author: "Ergonómica",
    keywords: [
      "productividad equipo trabajo",
      "ROI ergonomía empresa",
      "mobiliario ergonómico oficina",
      "standing desk oficina",
      "reducir ausentismo laboral",
      "inversión productividad empleados",
    ],
    lang: "es",
    faqs: [
      {
        q: "¿Cuánto cuesta equipar una oficina con mobiliario ergonómico?",
        a: "El costo promedio por puesto varía entre $400 y $1,200 dependiendo del nivel de equipamiento (standing desk, silla ergonómica, accesorios). Con el ROI documentado de $3–$6 por cada dólar invertido, una inversión de $800 por empleado se recupera típicamente en 4–6 meses.",
      },
      {
        q: "¿Hay evidencia de que el mobiliario ergonómico reduce el ausentismo?",
        a: "Sí. Un estudio publicado en el American Journal of Public Health encontró una reducción del 67% en días de baja laboral relacionados con lesiones musculoesqueléticas en empresas que implementaron programas ergonómicos integrales. El retorno de inversión calculado fue de $17.90 por cada dólar invertido en ese estudio específico.",
      },
      {
        q: "¿Realmente van a usar los standing desks los empleados?",
        a: "La adopción sostenida depende de dos factores: capacitación inicial (explicar por qué y cómo usarlos) y memorias de altura preconfiguradas. Empresas con onboarding ergonómico estructurado reportan tasas de uso activo del 78% a los 6 meses, vs. 31% sin capacitación.",
      },
      {
        q: "¿La ergonomía sustituye otros programas de wellness?",
        a: "No, los complementa — pero con una diferencia clave: la ergonomía actúa sobre las condiciones físicas que hacen posible el rendimiento. Un empleado con dolor lumbar crónico no puede aprovechar un taller de mindfulness. La ergonomía habilita todo lo demás.",
      },
      {
        q: "¿Puedo hacer un piloto antes de equipar toda la oficina?",
        a: "Absolutamente. Recomendamos un piloto de 60 días con 10–15% del equipo. Medimos productividad autoreportada, absentismo y satisfacción antes y después. Los datos del piloto generalmente son suficientes para justificar el presupuesto ante la dirección.",
      },
    ],
    content: `
<p class="blog-lead">Tu empresa invirtió en seminarios, talleres de team building, apps de wellness. ¿Cuál fue el retorno? Probablemente no sabes. Y si lo sabes, probablemente es decepcionante.</p>

<p>No porque estés haciendo algo mal. Sino porque estás invirtiendo en capas superiores mientras la capa base — el entorno físico donde trabaja tu equipo — sigue sin resolverse.</p>

<h2>La verdad incómoda del presupuesto de productividad</h2>

<p>La mayoría de los presupuestos de productividad y bienestar corporativo se gastan en lo que es fácil de vender: charlas inspiradoras, retiros de equipo, suscripciones a apps. Son fáciles de aprobar porque tienen un costo fijo y una fecha en el calendario.</p>

<p>El problema es el retorno.</p>

<p>Una investigación de la <strong>University of South Florida (USF)</strong> encontró que las intervenciones ergonómicas aumentan la productividad en un <strong>25% en promedio</strong>, con efectos medibles desde las primeras semanas. La <strong>Human Factors and Ergonomics Society</strong> documentó un incremento del <strong>15% en productividad</strong> y 25% en satisfacción laboral en empresas que implementaron programas ergonómicos estructurados. El <em>International Journal of Human-Computer Interaction</em> reportó un <strong>24% de mejora en satisfacción</strong> con el trabajo — lo que correlaciona directamente con retención de talento.</p>

<p>¿Cuándo fue la última vez que un seminario de dos días produjo un 25% de mejora en productividad?</p>

<h2>Los números del ROI ergonómico</h2>

<p>El <strong>National Business Group on Health</strong> calculó el retorno promedio de inversión en ergonomía en <strong>$3 a $6 por cada dólar invertido</strong>. En algunas industrias con trabajo intensivo en pantalla, el retorno llega a $12.</p>

<p>Un estudio del <em>American Journal of Public Health (AJPH)</em> documentó una reducción del <strong>67% en días de baja laboral</strong> relacionados con lesiones musculoesqueléticas tras implementar programas ergonómicos integrales.</p>

<p>Pero el impacto más subestimado es el de la micro-productividad. Considera:</p>

<ul>
  <li>Un empleado que gana <strong>$30/hora</strong> y pierde 15 minutos al día por fatiga física genera <strong>$1,950 en pérdida de productividad anual</strong></li>
  <li>Con un equipo de <strong>50 personas</strong>, eso son <strong>$97,500 al año</strong> en capacidad perdida</li>
  <li>La inversión para equipar 50 puestos básicamente: <strong>$25,000–$40,000</strong></li>
  <li>Retorno en el primer año: <strong>143%–290%</strong></li>
</ul>

<p>Y eso es solo el cálculo conservador, sin contar la reducción de rotación y el ahorro en días de enfermedad.</p>

<h2>Por qué un seminario no resuelve el problema</h2>

<p>Los programas de capacitación y bienestar son valiosos. Pero comparten una limitación fundamental: actúan sobre la persona, no sobre el entorno.</p>

<p>Un empleado motivado, con técnicas de mindfulness y objetivos claros, que pasa 8 horas sentado en una silla sin soporte lumbar frente a un monitor mal posicionado, seguirá sufriendo dolor de espalda. Y ese dolor — aunque leve y crónico — genera una carga cognitiva constante que reduce la capacidad de concentración, la toma de decisiones y la creatividad.</p>

<p>La ergonomía no compite con el bienestar: lo habilita. Es la infraestructura sobre la que todo lo demás se construye.</p>

<h2>Plan de implementación en 4 fases</h2>

<h3>Fase 1 — Standing desks (Mes 1–2)</h3>
<p>Comenzar por los puestos con mayor tiempo de pantalla. Los standing desks generan el impacto más visible y rápido, y crean adopción orgánica cuando otros empleados los ven en uso.</p>
<a href="/pa/store?category_id=standing-desks" class="blog-cta">Ver catálogo de standing desks →</a>

<h3>Fase 2 — Sillas ergonómicas (Mes 2–3)</h3>
<p>Reemplazar gradualmente las sillas genéricas. Priorizar puestos con quejas activas de dolor lumbar. La combinación standing desk + silla ergonómica elimina prácticamente toda la carga musculoesquelética del trabajo de escritorio.</p>
<a href="/pa/store?category_id=sillas" class="blog-cta">Ver sillas para oficina →</a>

<h3>Fase 3 — Accesorios y organización (Mes 3–4)</h3>
<p>Brazos de monitor, organizadores de cables, iluminación de escritorio. Estos accesorios optimizan el setup y eliminan las distracciones visuales que consumen capacidad cognitiva.</p>
<a href="/pa/store?category_id=accesorios" class="blog-cta">Ver accesorios de oficina →</a>

<h3>Fase 4 — Evaluación y ajuste (Mes 6)</h3>
<p>Medir satisfacción, productividad autoreportada y absentismo. Comparar con la línea base del inicio del programa. Los datos generalmente son suficientes para aprobar la siguiente fase de inversión.</p>

<h2>Lo que tu competencia ya sabe</h2>

<p>Un informe de <strong>JLL (2024)</strong> encontró que el 58% de los operadores de espacios de trabajo están activamente mejorando las amenidades de salud y ergonomía como factor diferenciador en la captación y retención de talento.</p>

<p>Las empresas que lideran en ergonomía no lo hacen solo por el bienestar de su equipo — lo hacen porque es una ventaja competitiva real en un mercado donde el talento es móvil y las opciones de trabajo remoto son abundantes.</p>

<p>Un setup de trabajo de calidad comunica algo simple pero poderoso: <em>aquí tu tiempo y tu salud importan</em>.</p>

<h2>Preguntas frecuentes</h2>

<h3>¿Cuánto cuesta equipar una oficina con mobiliario ergonómico?</h3>
<p>El costo promedio por puesto varía entre $400 y $1,200 dependiendo del nivel de equipamiento. Con el ROI documentado de $3–$6 por cada dólar invertido, una inversión de $800 por empleado se recupera típicamente en 4–6 meses.</p>

<h3>¿Hay evidencia de que el mobiliario ergonómico reduce el ausentismo?</h3>
<p>Sí. Un estudio del American Journal of Public Health encontró una reducción del 67% en días de baja laboral relacionados con lesiones musculoesqueléticas. El retorno de inversión en ese estudio fue de $17.90 por cada dólar invertido.</p>

<h3>¿Realmente van a usar los standing desks los empleados?</h3>
<p>La adopción sostenida depende de capacitación inicial y memorias de altura preconfiguradas. Empresas con onboarding ergonómico estructurado reportan tasas de uso activo del 78% a los 6 meses, vs. 31% sin capacitación.</p>

<h3>¿La ergonomía sustituye otros programas de wellness?</h3>
<p>No, los complementa. Pero con una diferencia clave: la ergonomía actúa sobre las condiciones físicas que hacen posible el rendimiento. Un empleado con dolor lumbar crónico no puede aprovechar un taller de mindfulness. La ergonomía habilita todo lo demás.</p>

<h3>¿Puedo hacer un piloto antes de equipar toda la oficina?</h3>
<p>Absolutamente. Recomendamos un piloto de 60 días con 10–15% del equipo. Medimos productividad autoreportada, absentismo y satisfacción antes y después. Los datos del piloto generalmente son suficientes para justificar el presupuesto ante la dirección.</p>
    `,
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getAllPosts(lang?: "es" | "en"): BlogPost[] {
  if (lang) return posts.filter((p) => p.lang === lang)
  return posts
}
