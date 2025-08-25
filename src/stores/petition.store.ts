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
    set((state) => {
      const curr = state.byProductId[productId] || { petitioned: false, wishCount: 0, loading: false };
      // 若正在 loading（使用者剛進行操作），避免以舊狀態覆寫樂觀更新；完成後會依伺服器結果校正
      if (curr.loading) return state;
      return {
        byProductId: {
          ...state.byProductId,
          [productId]: {
            ...curr,
            petitioned,
          },
        },
      };
    });
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
    // 請求進行中時避免重覆送出
    if (prev?.loading) return false;

    get().optimisticToggle(productId);
    try {
      const method = prev?.petitioned ? 'DELETE' : 'POST';
      const res = await fetch(`/api/wish-products/${productId}/petition`, { method });
      if (!res.ok) throw new Error('petition failed');

      const body = await res.json().catch(() => null);
      const petitionedFromServer: boolean =
        body?.data?.petitioned === true || body?.data?.petitioned === false
          ? body.data.petitioned
          : method === 'POST';
      const idempotent: boolean = body?.data?.idempotent === true;

      set((state) => {
        const curr = state.byProductId[productId] as PetitionStateItem;
        let nextCount = curr.wishCount;

        // idempotent 代表伺服器未改變實際計數，需回復樂觀更新的計數變化
        if (idempotent) {
          if (method === 'POST') {
            // 樂觀 +1 應回退
            nextCount = Math.max(0, curr.wishCount - 1);
          } else {
            // 樂觀 -1 應回退
            nextCount = curr.wishCount + 1;
          }
        }

        return {
          byProductId: {
            ...state.byProductId,
            [productId]: {
              petitioned: petitionedFromServer,
              wishCount: nextCount,
              loading: false,
            },
          },
        };
      });

      return true;
    } catch (e) {
      if (prev) get().rollback(productId, prev);
      return false;
    }
  },
}));