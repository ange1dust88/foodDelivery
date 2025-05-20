import { create } from 'zustand';

type OwnerState = {
  ownerId: number | null;
  email: string;
  name: string;
  surname: string;
  setOwner: (id: number, email: string, name: string, surname: string) => void;
  logout: () => void;
};

const storedData = localStorage.getItem('owner');
const initialData = storedData
  ? JSON.parse(storedData)
  : { ownerId: null, email: '', name: '', surname: '' };

export const useOwnerStore = create<OwnerState>((set) => ({
  ...initialData,

  setOwner: (id, email, name, surname) => {
    const newData = { ownerId: id, email, name, surname };
    localStorage.setItem('owner', JSON.stringify(newData));
    set(newData);
  },

  logout: () => {
    localStorage.removeItem('owner');
    set({ ownerId: null, email: '', name: '', surname: '' });
  },
}));
