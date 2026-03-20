import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

// ── Color maps ────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  bl: "Black", black: "Black",
  wh: "White", white: "White",
  gr: "Gray", gray: "Gray",
  sl: "Silver", silver: "Silver",
  coral: "Coral",
  oakli: "Oak Linen",
  taupe: "Taupe",
  go: "Gold", gold: "Gold",
  br: "Brown", brown: "Brown",
  lgr: "Light Gray",
  blu: "Blue",
  dgr: "Dark Gray",
  // extended
  dark: "Dark",
  light: "Light",
  red: "Red",
  green: "Green",
  navy: "Navy",
  beige: "Beige",
}

// ── SKU → title pattern map ───────────────────────────────────────────────────

interface TitlePattern {
  /** regex or prefix to match the SKU */
  test: (sku: string) => boolean
  /** derive human title from sku */
  build: (sku: string) => string
}

function extractColor(sku: string): string {
  // Last segment is usually the color code
  const parts = sku.split("-")
  const last = parts[parts.length - 1]
  return COLOR_MAP[last] ?? capitalize(last)
}

function capitalize(s: string): string {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function colorSuffix(sku: string): string {
  const c = extractColor(sku)
  return c ? ` — ${c}` : ""
}

const TITLE_PATTERNS: TitlePattern[] = [
  // Standing desk frames
  { test: (s) => s.startsWith("frame-single-"), build: (s) => `Base Motor Simple${colorSuffix(s)}` },
  { test: (s) => s.startsWith("frame-double-"), build: (s) => `Base Doble Motor${colorSuffix(s)}` },
  { test: (s) => s.startsWith("frame-3stage-"), build: (s) => `Base Doble Motor X${colorSuffix(s)}` },
  { test: (s) => s.startsWith("frame-heavy-"), build: (s) => `Base Heavy Duty${colorSuffix(s)}` },
  { test: (s) => /^frame-L-lt-/.test(s), build: (s) => `Base Forma L LT${colorSuffix(s)}` },
  { test: (s) => /^frame-L-/.test(s) && !/^frame-L-lt-/.test(s), build: (s) => `Base Forma L${colorSuffix(s)}` },
  { test: (s) => s.startsWith("frame-4column-"), build: (s) => `Base 2 Personas${colorSuffix(s)}` },
  // Desks - cabinets
  { test: (s) => /^desk-1pcab-core-/i.test(s), build: (s) => `Escritorio Core con Gabinete${colorSuffix(s)}` },
  { test: (s) => /^desk-1pcabext-core-/i.test(s), build: (s) => `Extensión Escritorio Core${colorSuffix(s)}` },
  { test: (s) => /^desk-cabinetext-core-/i.test(s), build: (s) => `Extensión Gabinete Core${colorSuffix(s)}` },
  { test: (s) => /^desk-exec-core-/i.test(s), build: (s) => `Escritorio Ejecutivo Core${colorSuffix(s)}` },
  { test: (s) => /^desk-1p-core-/i.test(s), build: (s) => `Escritorio Core Individual${colorSuffix(s)}` },
  { test: (s) => /^desk-exec-flow-/i.test(s), build: (s) => `Escritorio Ejecutivo Flow${colorSuffix(s)}` },
  { test: (s) => /^desk-exec-blok-/i.test(s), build: (s) => `Escritorio Ejecutivo Blok${colorSuffix(s)}` },
  { test: (s) => /^[Dd]esk-1pcab-blok-/i.test(s), build: (s) => `Escritorio Blok con Gabinete${colorSuffix(s)}` },
  { test: (s) => /^[Dd]esk-1pcab-flow-/i.test(s), build: (s) => `Escritorio Flow con Gabinete${colorSuffix(s)}` },
  // Workstations
  { test: (s) => /^works-2pcab-core-/.test(s), build: (s) => `Workstation Core 2P Gabinete${colorSuffix(s)}` },
  { test: (s) => /^works-2pcabext-core-/.test(s), build: (s) => `Extensión Workstation Core 2P${colorSuffix(s)}` },
  { test: (s) => /^works-4p-core-/.test(s), build: (s) => `Workstation Core 4P${colorSuffix(s)}` },
  { test: (s) => /^works-2p-flow-/.test(s), build: (s) => `Workstation Flow 2P${colorSuffix(s)}` },
  { test: (s) => /^works-2pcab-flow-/.test(s), build: (s) => `Workstation Flow 2P Gabinete${colorSuffix(s)}` },
  { test: (s) => /^works-2pcabext-flow-/.test(s), build: (s) => `Extensión Workstation Flow 2P${colorSuffix(s)}` },
  { test: (s) => /^works-4p-flow-/.test(s), build: (s) => `Workstation Flow 4P${colorSuffix(s)}` },
  { test: (s) => /^works-4pext-flow-/.test(s), build: (s) => `Extensión Workstation Flow 4P${colorSuffix(s)}` },
  // Storage
  { test: (s) => /^storage-exec-core-/.test(s), build: (s) => `Gabinete Ejecutivo Core${colorSuffix(s)}` },
  { test: (s) => /^storage-exec-flow-/.test(s), build: (s) => `Gabinete Ejecutivo Flow${colorSuffix(s)}` },
  { test: (s) => /^storage-tallglass-flow-/.test(s), build: (s) => `Gabinete Alto Flow con Vidrio${colorSuffix(s)}` },
  { test: (s) => /^storage-lowcab-flow-/.test(s), build: (s) => `Gabinete Bajo Flow${colorSuffix(s)}` },
  { test: (s) => /^storage-medcab-flow-/.test(s), build: (s) => `Gabinete Mediano Flow${colorSuffix(s)}` },
  { test: (s) => /^storage-medcab-core-/.test(s), build: (s) => `Gabinete Mediano Core${colorSuffix(s)}` },
  { test: (s) => /^storage-sidecab-core-/.test(s), build: (s) => `Gabinete Lateral Core${colorSuffix(s)}` },
  { test: (s) => /^storage-teacab-flow-/.test(s), build: (s) => `Gabinete de Té Flow${colorSuffix(s)}` },
  { test: (s) => /^cabinet-3drawer-slim-/.test(s), build: (s) => `Gabinete Slim 3 Gavetas${colorSuffix(s)}` },
  { test: (s) => /^cabinet-3drawer-comp-/.test(s), build: (s) => `Gabinete Compacto 3 Gavetas${colorSuffix(s)}` },
  { test: (s) => /^drawer-under-lock-large-/.test(s), build: (s) => `Gaveta Under-Desk con Llave${colorSuffix(s)}` },
  // Tables
  { test: (s) => /^table-meet-core-/.test(s), build: (s) => `Mesa Conferencia Core${colorSuffix(s)}` },
  { test: (s) => /^table-meet-blok-/.test(s), build: (s) => `Mesa Conferencia Blok${colorSuffix(s)}` },
  { test: (s) => /^table-meet-flow-/.test(s), build: (s) => `Mesa Reunión Flow${colorSuffix(s)}` },
  { test: (s) => /^table-bar-flow-/.test(s), build: (s) => `Mesa Bar Flow${colorSuffix(s)}` },
  { test: (s) => /^table-round-flow-/.test(s), build: (s) => `Mesa Redonda Flow${colorSuffix(s)}` },
  // Monitor arms
  { test: (s) => /^stand-arm-single-/.test(s), build: (s) => `Brazo Monitor Simple${colorSuffix(s)}` },
  { test: (s) => /^stand-arm-double-/.test(s), build: (s) => `Brazo Monitor Doble${colorSuffix(s)}` },
  { test: (s) => /^stand-arm-heavy-single-/.test(s), build: (s) => `Brazo Monitor Heavy Duty${colorSuffix(s)}` },
  // Laptop stands
  { test: (s) => /^stand-laptop-adjus-/.test(s), build: (s) => `Soporte Laptop Ajustable${colorSuffix(s)}` },
  { test: (s) => /^stand-laptop-vertical-/.test(s), build: (s) => `Soporte Laptop Vertical${colorSuffix(s)}` },
  { test: (s) => /^stand-laptop-x-/.test(s), build: (s) => `Soporte Laptop X${colorSuffix(s)}` },
  { test: (s) => /^stand-laptop-360-/.test(s), build: (s) => `Soporte Laptop 360°${colorSuffix(s)}` },
  { test: (s) => /^stand-laptop-clasic-/.test(s), build: (s) => `Soporte Laptop Clásico${colorSuffix(s)}` },
  { test: (s) => /^stand-laptop-arm-mount-/.test(s), build: (s) => `Brazo Laptop Mount${colorSuffix(s)}` },
  { test: (s) => /^stand-laptop-tilt-/.test(s), build: (s) => `Soporte Laptop Tilt${colorSuffix(s)}` },
  // Other accessories
  { test: (s) => /^stand-head-desk-/.test(s), build: (s) => `Soporte Audífonos${colorSuffix(s)}` },
  { test: (s) => /^stand-cpu-under-/.test(s), build: (s) => `Soporte CPU Under-Desk${colorSuffix(s)}` },
  { test: (s) => /^stand-tablet-adjus-large-/.test(s), build: (s) => `Soporte Tablet Ajustable${colorSuffix(s)}` },
  // Desk pads
  { test: (s) => /^pad-ecoleather-80x40-/.test(s), build: (s) => `Pad Eco Leather 80x40${colorSuffix(s)}` },
  { test: (s) => /^pad-felt-80x40-/.test(s), build: (s) => `Pad Felt 80x40${colorSuffix(s)}` },
  { test: (s) => /^pad-felt-90x30-/.test(s), build: (s) => `Pad Felt 90x30${colorSuffix(s)}` },
  { test: (s) => /^mouse-pad-alum-/.test(s), build: (s) => `Mouse Pad Aluminio${colorSuffix(s)}` },
  // Cable management
  { test: (s) => /^cable-grommet-80-/.test(s), build: (s) => `Pasacables 8cm${colorSuffix(s)}` },
  { test: (s) => /^cable-rail-/.test(s), build: (s) => `Riel de Cables${colorSuffix(s)}` },
  { test: (s) => /^cable-tray-/.test(s), build: (s) => `Bandeja de Cables${colorSuffix(s)}` },
  // Keyboards & mice
  { test: (s) => /^keyboard-bt-backlit-1-/.test(s), build: (s) => `Teclado Bluetooth Retroiluminado${colorSuffix(s)}` },
  { test: (s) => /^keyboard-btbacklit-us-/.test(s), build: (s) => `Teclado Bluetooth Retroiluminado US${colorSuffix(s)}` },
  { test: (s) => /^keyboard-bt-us-/.test(s), build: (s) => `Teclado Bluetooth${colorSuffix(s)}` },
  { test: (s) => /^mouse-vertical-/.test(s), build: (s) => {
    const m = s.match(/^mouse-vertical-(\d+)-/)
    return `Mouse Vertical Ergonómico${m ? ` #${m[1]}` : ""}${colorSuffix(s)}`
  }},
  { test: (s) => /^mouse-wireless-/.test(s), build: (s) => `Mouse Wireless${colorSuffix(s)}` },
  { test: (s) => /^mouse-game-cabl-/.test(s), build: (s) => `Mouse Gamer${colorSuffix(s)}` },
  // Anti-fatigue mats / balance
  { test: (s) => /^anti-mat-20x32-/.test(s), build: (s) => `Mat Antifatiga 20x32${colorSuffix(s)}` },
  { test: (s) => /^anti-mat-shape1-/.test(s), build: (s) => `Mat Antifatiga Ergonómico${colorSuffix(s)}` },
  { test: (s) => /^balance-board-/.test(s), build: (s) => `Tabla de Balance${colorSuffix(s)}` },
  { test: (s) => /^footrest-1-/.test(s), build: (s) => `Reposapiés Ajustable${colorSuffix(s)}` },
  // Acoustic panels
  { test: (s) => /^div-acupanel-/.test(s), build: (s) => {
    const m = s.match(/^div-acupanel-(\d+x?\d*)-/)
    return `Panel Acústico${m ? ` ${m[1]}cm` : ""}${colorSuffix(s)}`
  }},
  { test: (s) => /^div-deskclamp-/.test(s), build: (s) => `Clamp Panel Acústico${colorSuffix(s)}` },
  // Misc
  { test: (s) => /^desk-casters-/.test(s), build: (s) => `Ruedas para Standing Desk${colorSuffix(s)}` },
]

// ── SKU → metadata specs ──────────────────────────────────────────────────────

function buildFrameMetadata(sku: string): Record<string, string> {
  const base: Record<string, string> = {
    warranty: "5 años",
    assembly_required: "true",
    tools_included: "true",
    anti_collision: "true",
    memory_presets: "3",
  }
  if (sku.startsWith("frame-single-")) {
    return { ...base, motors: "1", speed: "25mm/s", max_weight_capacity: "100kg", height_range: "70-120cm", noise_level: "<50dB", compatible_top_length: "100-160cm", compatible_top_width: "57.5-90cm", weight: "25kg" }
  }
  if (sku.startsWith("frame-double-")) {
    return { ...base, motors: "2", speed: "32mm/s", max_weight_capacity: "120kg", height_range: "70-120cm", noise_level: "<48dB", compatible_top_length: "100-220cm", compatible_top_width: "58-90cm", weight: "30kg" }
  }
  if (sku.startsWith("frame-3stage-")) {
    return { ...base, motors: "2", speed: "38mm/s", max_weight_capacity: "140kg", height_range: "60-125cm", noise_level: "<48dB", compatible_top_length: "100-220cm", compatible_top_width: "58-90cm", weight: "32kg" }
  }
  if (sku.startsWith("frame-heavy-")) {
    return { ...base, motors: "2", speed: "32mm/s", max_weight_capacity: "180kg", height_range: "62-127cm", noise_level: "<48dB", compatible_top_length: "100-220cm", compatible_top_width: "58-90cm", weight: "38kg" }
  }
  if (/^frame-L-lt-/.test(sku)) {
    return { ...base, motors: "2", speed: "32mm/s", max_weight_capacity: "120kg", height_range: "70-120cm", weight: "35kg" }
  }
  if (/^frame-L-/.test(sku)) {
    return { ...base, motors: "3", speed: "32mm/s", max_weight_capacity: "150kg", height_range: "70-120cm", weight: "45kg" }
  }
  if (sku.startsWith("frame-4column-")) {
    return { ...base, motors: "4", speed: "25mm/s", max_weight_capacity: "200kg", height_range: "70-120cm", weight: "55kg" }
  }
  return base
}

function buildChairMetadata(sku: string): Record<string, string> {
  const base: Record<string, string> = {
    assembly_required: "true",
    gas_lift: "Class 4",
  }
  const skuLower = sku.toLowerCase()
  if (skuLower.includes("xtc")) {
    return { ...base, warranty: "4 años", max_weight_capacity: "170kg", armrests: "4D", lumbar_support: "Dinámico ajustable", headrest: "3D", base_material: "Aluminio 360mm", bifma_certified: "true" }
  }
  if (skuLower.includes("hd-force") || skuLower.includes("hdforce")) {
    return { ...base, warranty: "4 años", max_weight_capacity: "180kg" }
  }
  if (skuLower.includes("avid") || skuLower.includes("tau") || skuLower.includes("tesseract") || skuLower.includes("vantix")) {
    return { ...base, warranty: "3 años", max_weight_capacity: "130kg" }
  }
  // Default for Nexa, Sync, Ensis, Atommesh, etc.
  return { ...base, warranty: "3 años", max_weight_capacity: "120kg" }
}

function buildDeskMetadata(sku: string): Record<string, string> {
  const meta: Record<string, string> = {
    warranty: "3 años",
    material: "MFC Eco E0",
    assembly_required: "true",
    cable_management: "true",
  }
  if (sku.includes("cab")) meta.lock_type = "Cerradura"
  return meta
}

function buildWorkstationMetadata(sku: string): Record<string, string> {
  const meta: Record<string, string> = {
    warranty: "3 años",
    material: "MFC Eco E0",
    assembly_required: "true",
    cable_management: "true",
    privacy_panel: "true",
  }
  if (sku.includes("cab")) meta.lock_type = "Cerradura"
  return meta
}

function buildStorageMetadata(sku: string): Record<string, string> {
  const meta: Record<string, string> = {
    warranty: "3 años",
    material: "MFC Eco E0",
    soft_close: "true",
    assembly_required: "true",
  }
  if (sku.includes("lock") || sku.includes("drawer-under")) meta.lock_type = "Cerradura"
  return meta
}

function buildTableMetadata(): Record<string, string> {
  return {
    warranty: "3 años",
    material: "MFC Eco E0",
    cable_management: "true",
  }
}

function buildAccessoryMetadata(): Record<string, string> {
  return { warranty: "1 año" }
}

function getMetadataForSku(sku: string): Record<string, string> | null {
  if (sku.startsWith("frame-")) return buildFrameMetadata(sku)
  if (sku.startsWith("chair-")) return buildChairMetadata(sku)
  if (/^desk-/.test(sku)) return buildDeskMetadata(sku)
  if (sku.startsWith("works-")) return buildWorkstationMetadata(sku)
  if (sku.startsWith("storage-") || sku.startsWith("cabinet-") || sku.startsWith("drawer-")) return buildStorageMetadata(sku)
  if (sku.startsWith("table-")) return buildTableMetadata()
  // Accessories
  if (/^(stand-|mouse-|keyboard-|pad-|cable-|anti-|balance-|footrest-|div-|desk-casters-)/.test(sku)) return buildAccessoryMetadata()
  return null
}

function buildDescription(sku: string, metadata: Record<string, string>): string {
  if (sku.startsWith("frame-")) {
    return `Base de altura ajustable para standing desk con pantalla táctil de ${metadata.memory_presets ?? "3"} memorias, tecnología anticolisión y velocidad de ${metadata.speed ?? "32mm/s"}. Capacidad de ${metadata.max_weight_capacity ?? "120kg"}. Garantía de ${metadata.warranty ?? "5 años"}.`
  }
  if (sku.startsWith("chair-")) {
    return `Silla ergonómica diseñada para largas jornadas de trabajo. Garantía de ${metadata.warranty ?? "3 años"}.`
  }
  if (/^desk-/.test(sku)) {
    return "Escritorio de oficina con acabado MFC eco E0 hidrofúgo. Cable management incluido. Garantía de 3 años."
  }
  if (sku.startsWith("works-")) {
    return "Workstation de oficina con acabado MFC eco E0. Panel de privacidad y cable management incluidos. Garantía de 3 años."
  }
  if (sku.startsWith("storage-") || sku.startsWith("cabinet-") || sku.startsWith("drawer-")) {
    return "Gabinete con acabado MFC eco E0. Gavetas soft close. Garantía de 3 años."
  }
  if (sku.startsWith("table-")) {
    return "Mesa de oficina con acabado MFC eco E0. Garantía de 3 años."
  }
  return ""
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default async function fixProductData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const productService = container.resolve(Modules.PRODUCT)

  logger.info("=== fix-product-data: START ===")

  // Fetch all products with their first variant's SKU
  const { data: allProducts } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "handle",
      "description",
      "metadata",
      "variants.id",
      "variants.sku",
    ],
  })

  logger.info(`Total products: ${allProducts.length}`)

  let titlesFixed = 0
  let metaAdded = 0
  let descAdded = 0
  let errors = 0

  for (const prod of allProducts as any[]) {
    const variant = (prod.variants ?? [])[0]
    const sku: string = variant?.sku ?? prod.handle ?? ""

    const updates: Record<string, any> = {}

    // ── A) TITLE FIX ──────────────────────────────────────────────────────────

    const currentTitle: string = prod.title ?? ""
    // Skip if title is already descriptive (has spaces and > 20 chars)
    const looksDescriptive = currentTitle.includes(" ") && currentTitle.length > 20
    if (!looksDescriptive && sku) {
      for (const pattern of TITLE_PATTERNS) {
        if (pattern.test(sku)) {
          const newTitle = pattern.build(sku)
          if (newTitle && newTitle !== currentTitle) {
            updates.title = newTitle
            titlesFixed++
          }
          break
        }
      }
    }

    // ── B) METADATA SPECS ────────────────────────────────────────────────────

    const existingMeta: Record<string, any> = prod.metadata ?? {}
    const newMeta = getMetadataForSku(sku)
    if (newMeta) {
      // Only add fields that don't already exist
      const merged = { ...newMeta, ...existingMeta }
      const hasChanges = Object.keys(newMeta).some((k) => !(k in existingMeta))
      if (hasChanges) {
        updates.metadata = merged
        metaAdded++
      }
    }

    // ── C) DESCRIPTION ───────────────────────────────────────────────────────

    const currentDesc: string = prod.description ?? ""
    if ((!currentDesc || currentDesc.length < 20) && sku) {
      const metaForDesc = updates.metadata ?? existingMeta ?? {}
      const newDesc = buildDescription(sku, metaForDesc)
      if (newDesc) {
        updates.description = newDesc
        descAdded++
      }
    }

    // ── Apply updates ─────────────────────────────────────────────────────────

    if (Object.keys(updates).length > 0) {
      try {
        await productService.updateProducts(prod.id, updates)
        logger.info(
          `  Updated "${prod.handle}": ${Object.keys(updates).join(", ")}`
        )
      } catch (err: any) {
        logger.error(`  Error updating "${prod.handle}": ${err.message}`)
        errors++
      }
    }
  }

  logger.info("=================================================")
  logger.info("✅ fix-product-data COMPLETE")
  logger.info(`   Titles fixed    : ${titlesFixed}`)
  logger.info(`   Metadata added  : ${metaAdded}`)
  logger.info(`   Descriptions added: ${descAdded}`)
  logger.info(`   Errors          : ${errors}`)
  logger.info("=================================================")
}
