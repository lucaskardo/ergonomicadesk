import Header from "@/components/header"
import Footer from "@/components/footer"
import { RegionProvider } from "@/providers/region"
import { CartProvider } from "@/providers/cart"

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RegionProvider>
      <CartProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </CartProvider>
    </RegionProvider>
  )
}
