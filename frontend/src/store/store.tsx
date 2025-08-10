import { create } from "zustand";

// Define the shape of the state
interface TrackFitState {
  count: number;
  isSidebarOpen: boolean;
  increase: () => void;
  decrease: () => void;
  setIsSidebarOpen: (toggle: any) => void;
  reset: () => void;
}

// Create the store
export const useStore = create<TrackFitState>((set) => ({
  count: 0,
  isSidebarOpen: false,
  increase: () =>
    set((state: TrackFitState) => ({ count: state.count + 1 })),
  decrease: () =>
    set((state: TrackFitState) => ({ count: state.count - 1 })),
  setIsSidebarOpen: (toggle: any) => {
    set({ isSidebarOpen: toggle })
  },
  reset: () => set({ count: 0 }),
}));
