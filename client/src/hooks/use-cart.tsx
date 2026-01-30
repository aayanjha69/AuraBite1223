import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { MenuItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export type CartItem = {
  menuItemId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customizations?: string[];
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: MenuItem, quantity: number, customizations?: string[]) => void;
  removeFromCart: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("aurabites-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("aurabites-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (menuItem: MenuItem, quantity: number, customizations: string[] = []) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === menuItem.id
            ? { ...i, quantity: i.quantity + quantity, customizations: [...(i.customizations || []), ...customizations] }
            : i
        );
      }
      return [
        ...prev,
        {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          image: menuItem.image,
          quantity,
          customizations,
        },
      ];
    });
    toast({
      title: "Added to cart",
      description: `${quantity}x ${menuItem.name} added.`,
    });
  };

  const removeFromCart = (menuItemId: number) => {
    setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId: number, delta: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.menuItemId === menuItemId) {
          const newQty = Math.max(1, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("aurabites-cart");
  };

  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
