import { create } from 'zustand';

interface PetitionStateItem {
  petitioned: boolean;
  wishCount: number;
  loading: boolean;
}

interface PetitionStore {
  byProductId: Record<string, PetitionStateItem>;
  ensure(productId: string, initialWishCount: number): void;
  setStatus(productId: string, petitioned: boolean): void;
  optimisticToggle(productId: string): void;
  rollback(productId: string, prev: PetitionStateItem): void;
  togglePetition(productId: string): Promise<boolean>;
  hydrateFromList(list: { id: string; wishCount?: number }[]): void;
}

export const usePetitionStore = create<PetitionStore>((set, get) => ({
  byProductId: {},

  ensure(productId, initialWishCount) {
    set((state) => {
      if (state.byProductId[productId]) return state;
      return {
        byProductId: {
          ...state.byProductId,
          [productId]: { petitioned: false, wishCount: initialWishCount || 0, loading: false },
        },
      };
    });
  },

  hydrateFromList(list) {
    set((state) => {
      const next = { ...state.byProductId };
      for (const item of list) {
        if (!next[item.id]) {
          next[item.id] = {
            petitioned: false,
            wishCount: Number(item.wishCount || 0),
            loading: false,
          };
        } else {
          next[item.id] = {
            ...next[item.id],
            wishCount: Number(item.wishCount || next[item.id].wishCount || 0),
          };
        }
      }
      return { byProductId: next };
    });
  },

  setStatus(productId, petitioned) {
    set((state) => ({
      byProductId: {
        ...state.byProductId,
        [productId]: {
          ...(state.byProductId[productId] || { petitioned: false, wishCount: 0, loading: false }),
          petitioned,
        },
      },
    }));
  },

  optimisticToggle(productId) {
    set((state) => {
      const curr = state.byProductId[productId] || { petitioned: false, wishCount: 0, loading: false };
      const nextPetitioned = !curr.petitioned;
      const nextCount = nextPetitioned ? curr.wishCount + 1 : Math.max(0, curr.wishCount - 1);
      return {
        byProductId: {
          ...state.byProductId,
          [productId]: { petitioned: nextPetitioned, wishCount: nextCount, loading: true },
        },
      };
    });
  },

  rollback(productId, prev) {
    set((state) => ({
      byProductId: {
        ...state.byProductId,
        [productId]: { ...prev, loading: false },
      },
    }));
  },

  async togglePetition(productId) {
    const prev = get().byProductId[productId];
    get().optimisticToggle(productId);
    try {
      const method = prev?.petitioned ? 'DELETE' : 'POST';
      const res = await fetch(`/api/wish-products/${productId}/petition`, { method });
      if (!res.ok) throw new Error('petition failed');

      // 若伺服器回應要求設定 cookie，需要讀取回傳即可；此處僅完成狀態
      set((state) => ({
        byProductId: {
          ...state.byProductId,
          [productId]: { ...(state.byProductId[productId] as PetitionStateItem), loading: false },
        },
      }));
      return true;
    } catch (e) {
      if (prev) get().rollback(productId, prev);
      return false;
    }
  },
}));


