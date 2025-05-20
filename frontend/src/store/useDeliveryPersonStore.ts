import { create } from 'zustand';

type DeliveryPersonState = {
  deliveryPersonId: number | null;
  email: string;
  name: string;
  surname: string;
  phoneNumber: string;
  status: boolean;
  setDeliveryPerson: (
    id: number,
    email: string,
    name: string,
    surname: string,
    phoneNumber: string,
    status: boolean
  ) => void;
  setStatus: (status: boolean) => void;
  logout: () => void;
};

const storedData = localStorage.getItem('deliveryPerson');
const initialData = storedData
  ? JSON.parse(storedData)
  : {
      deliveryPersonId: null,
      email: '',
      name: '',
      surname: '',
      phoneNumber: '',
      status: false,
    };

export const useDeliveryPersonStore = create<DeliveryPersonState>((set) => ({
  ...initialData,

  setDeliveryPerson: (id, email, name, surname, phoneNumber, status) => {
    const newData = {
      deliveryPersonId: id,
      email,
      name,
      surname,
      phoneNumber,
      status,
    };
    localStorage.setItem('deliveryPerson', JSON.stringify(newData));
    set(newData);
  },

  setStatus: (status) => {
    set((state) => {
      const updated = { ...state, status };
      localStorage.setItem('deliveryPerson', JSON.stringify(updated));
      return updated;
    });
  },

  logout: () => {
    localStorage.removeItem('deliveryPerson');
    set({
      deliveryPersonId: null,
      email: '',
      name: '',
      surname: '',
      phoneNumber: '',
      status: false,
    });
  },
}));
