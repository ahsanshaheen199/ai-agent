import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatStore {
  localModelId: string;
  isHistoryOpen: boolean;
  onToggleHistory: () => void;
  setLocalModelId: (id: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      localModelId: "",
      isHistoryOpen: false,
      onToggleHistory: () => set({ isHistoryOpen: !get().isHistoryOpen }),
      setLocalModelId: (id) => set({ localModelId: id }),
    }),
    {
      name: "chat-store",
    }
  )
);
