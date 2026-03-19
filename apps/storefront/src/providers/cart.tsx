"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { medusa } from "@/lib/medusa-client"

type Cart = Awaited<ReturnType<typeof medusa.store.cart.retrieve>>["cart"]

interface CartContextValue {
  cart: Cart | undefined
  isLoading: boolean
  totalItems: number
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  const getOrCreateCart = useCallback(async (): Promise<Cart | undefined> => {
    try {
      const cartId = localStorage.getItem("cart_id")
      if (cartId) {
        try {
          const { cart } = await medusa.store.cart.retrieve(cartId)
          setCart(cart)
          return cart
        } catch {
          localStorage.removeItem("cart_id")
        }
      }
      const regionId = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID
      const { cart } = await medusa.store.cart.create({ region_id: regionId })
      localStorage.setItem("cart_id", cart.id)
      setCart(cart)
      return cart
    } catch (error) {
      console.error("CART_INIT_ERROR:", error)
      return undefined
    }
  }, [])

  useEffect(() => {
    getOrCreateCart().finally(() => setIsLoading(false))
  }, [getOrCreateCart])

  const refreshCart = useCallback(async () => {
    const cartId = localStorage.getItem("cart_id")
    if (!cartId) return
    try {
      const { cart } = await medusa.store.cart.retrieve(cartId)
      setCart(cart)
    } catch (error) {
      console.error("CART_REFRESH_ERROR:", error)
    }
  }, [])

  const addItem = useCallback(
    async (variantId: string, quantity: number) => {
      let cartId = localStorage.getItem("cart_id")
      if (!cartId) {
        const newCart = await getOrCreateCart()
        if (!newCart) return
        cartId = newCart.id
      }
      try {
        const { cart } = await medusa.store.cart.createLineItem(cartId, {
          variant_id: variantId,
          quantity,
        })
        setCart(cart)
      } catch (error) {
        console.error("ADD_ITEM_ERROR:", error)
        throw error
      }
    },
    [getOrCreateCart]
  )

  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    const cartId = localStorage.getItem("cart_id")
    if (!cartId) return
    try {
      const { cart } = await medusa.store.cart.updateLineItem(cartId, itemId, {
        quantity,
      })
      setCart(cart)
    } catch (error) {
      console.error("UPDATE_ITEM_ERROR:", error)
      throw error
    }
  }, [])

  const removeItem = useCallback(async (itemId: string) => {
    const cartId = localStorage.getItem("cart_id")
    if (!cartId) return
    try {
      const result = await medusa.store.cart.deleteLineItem(cartId, itemId)
      setCart(result.parent)
    } catch (error) {
      console.error("REMOVE_ITEM_ERROR:", error)
      throw error
    }
  }, [])

  const totalItems =
    cart?.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        totalItems,
        addItem,
        updateItem,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
