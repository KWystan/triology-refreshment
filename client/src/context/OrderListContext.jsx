/**
 * OrderListContext — manages a "My List" of menu items selected by the user
 * for ordering. Persisted to localStorage. The list is meant to be forwarded
 * to Messenger as a pre-formatted order message.
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const OrderListContext = createContext(null);

const STORAGE_KEY = 'orderList';

export function OrderListProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item) => {
    // Resolve the display price with a fallback — avoid empty string in Messenger
    const resolvedPrice = item.displayPrice
      ? item.displayPrice
      : item.price != null
        ? `₱${item.price}`
        : '';

    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: resolvedPrice,
          quantity: 1,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((itemId) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId, delta) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === itemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const clearList = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const buildMessengerMessage = useCallback(() => {
    if (items.length === 0) return '';

    const lines = ['Hi Triology! I would like to order:', ''];
    items.forEach((i) => {
      lines.push(`• ${i.name} x${i.quantity}${i.price ? ` (${i.price})` : ''}`);
    });
    lines.push('', 'Thank you! 🙏');
    return lines.join('\n');
  }, [items]);

  const openMessenger = useCallback(
    (messengerUrl) => {
      const message = buildMessengerMessage();
      if (!message) return;
      const encoded = encodeURIComponent(message);
      window.open(`${messengerUrl}?text=${encoded}`, '_blank', 'noopener');
    },
    [buildMessengerMessage],
  );

  return (
    <OrderListContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearList,
        totalItems,
        buildMessengerMessage,
        openMessenger,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </OrderListContext.Provider>
  );
}

export function useOrderList() {
  const ctx = useContext(OrderListContext);
  if (!ctx) throw new Error('useOrderList must be used within OrderListProvider');
  return ctx;
}
