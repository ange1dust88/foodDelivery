import { create } from "zustand";
import { persist } from "zustand/middleware";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  restaurantId: number;
};

type CartState = {
  items: MenuItem[];
  restaurantId: number | null;
  addItem: (item: MenuItem) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,

      addItem: (item) => {
        const currentRestaurant = get().restaurantId;
        if (currentRestaurant && currentRestaurant !== item.restaurantId) {
          set({ items: [], restaurantId: null });
        }

        set((state) => ({
          items: [...state.items, item],
          restaurantId: item.restaurantId,
        }));

        console.log("Item added to cart:", item);
      },
      removeItem: (id: number) => {
        const idx = get().items.findIndex(i => i.id === id);
        if (idx === -1) return;
        const newItems = [...get().items];
        newItems.splice(idx, 1);
        set({
          items: newItems,
          restaurantId: newItems.length ? get().restaurantId : null,
        });
      },

      clearCart: () => set({ items: [], restaurantId: null }),
    }),
    {
      name: "cart-storage", 
    }
  )
);
