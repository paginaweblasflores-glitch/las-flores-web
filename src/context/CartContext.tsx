import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "../lib/supabase";

export interface CartCustomizations {
  [key: string]: string | undefined;
  bebidaFria?: string;
  bebidaCaliente?: string;
  sandwich?: string;
  acompanamiento?: string;
}

export interface CartItem {
  id: string;
  /** UUID real del producto en Supabase (distinto del id local del carrito, que puede llevar sufijos de personalización). Necesario para poder crear el pedido. */
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customizations?: CartCustomizations;
}

export function removeUnavailableCartItems(items: CartItem[], unavailableIds: Set<string>): CartItem[] {
  return items.filter((item) => !unavailableIds.has(item.productId || item.id.split("__")[0]));
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Cerrar el carrito automáticamente al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [router.state.location.pathname]);

  // Cargar carrito desde localStorage únicamente después de montar en el cliente (evita error 418 de hidratación)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("las_flores_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error("Error al cargar carrito desde localStorage:", e);
    }
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("cart-product-availability")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, (payload) => {
        const product = payload.new as { id?: string; is_available?: boolean };
        const oldProduct = payload.old as { id?: string };
        const productId = product.id || oldProduct.id;

        if (!productId || (payload.eventType !== "DELETE" && product.is_available !== false)) return;

        setItems((currentItems) => {
          const updatedItems = removeUnavailableCartItems(currentItems, new Set([productId]));
          try {
            localStorage.setItem("las_flores_cart", JSON.stringify(updatedItems));
          } catch {}
          return updatedItems;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Guardar en localStorage cada vez que cambien los ítems
  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("las_flores_cart", JSON.stringify(newItems));
    } catch (e) {
      console.error("Error al guardar carrito:", e);
    }
  };

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      // Generar clave única que incluye las personalizaciones
      const customKey = newItem.customizations
        ? Object.values(newItem.customizations).filter(Boolean).sort().join("|")
        : "";
      const uniqueId = customKey ? `${newItem.id}__${customKey}` : newItem.id;

      const existing = prev.find((i) => i.id === uniqueId);
      const updated = existing
        ? prev.map((i) => (i.id === uniqueId ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { ...newItem, id: uniqueId, quantity: 1 }];
      try {
        localStorage.setItem("las_flores_cart", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      try {
        localStorage.setItem("las_flores_cart", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => {
      const updated = prev.map((i) => (i.id === id ? { ...i, quantity } : i));
      try {
        localStorage.setItem("las_flores_cart", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearCart = () => {
    saveItems([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
