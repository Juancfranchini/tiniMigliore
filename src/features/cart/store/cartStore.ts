import { create } from 'zustand';
import type { Product, ProductOption } from '../../../core/types/catalog';

// import { catalogService } from '../../../services/api/catalog'; // Will be needed for real cart validation
import type { OrderItem } from '../../../core/types/order';

interface CartState {
  items: OrderItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, options?: ProductOption[]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  addItem: (product, options = []) => {
    set((state) => {
      // Very basic equality check for options. Proper compare might be needed if complex options.
      // For now, assume same product + same options = increase quantity, else add new line.
      // To simplify this mock, we'll just check product ID for now, 
      // but in a real app, options affect the unique cart line key.
      const existingItemIndex = state.items.findIndex(
        (item) => item.productId === product.id && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(options)
      );

      const optionsTotalOffset = options.reduce((sum, opt) => sum + opt.priceOffset, 0);
      const unitPrice = product.price + optionsTotalOffset;

      if (existingItemIndex > -1) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += 1;
        newItems[existingItemIndex].totalLinePrice = newItems[existingItemIndex].quantity * unitPrice;
        return { items: newItems, isOpen: true };
      }

      const newItem: OrderItem = {
        productId: product.id,
        productName: product.name,
         imageUrl: product.imageUrl, // A useful shortcut for the UI
        unitPrice,
        quantity: 1,
        selectedOptions: options,
        totalLinePrice: unitPrice,
      };

      return { items: [...state.items, newItem], isOpen: true };
    });
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },
  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((item) => item.productId !== productId) };
      }
      return {
        items: state.items.map((item) => {
          if (item.productId === productId) {
             return { ...item, quantity, totalLinePrice: item.unitPrice * quantity };
          }
          return item;
        }),
      };
    });
  },
  clearCart: () => set({ items: [] }),
  getSubtotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.totalLinePrice, 0);
  },
}));
