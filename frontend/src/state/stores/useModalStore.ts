import { create } from "zustand";

interface IUseModalStore {
	id?: string | number;
	setId: (id: string | number) => void;
	resetId: () => void;
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
	reset: () => void;
}

// Factory function para crear stores independientes
export const createModalStore = () => {
	return create<IUseModalStore>((set, get) => ({
		id: undefined,
		setId: (id: string | number) => set({ id }),
		resetId: () => set({ id: undefined }),
		isOpen: false,
		open: () => set({ isOpen: true }),
		close: () => set({ isOpen: false }),
		toggle: () => set({ isOpen: !get().isOpen }),
		reset: () => set({ isOpen: false }),
	}));
};

// Store por defecto (para compatibilidad)
export const useModalStore = createModalStore();
