import { create } from 'zustand';

type CustomerState = {
  customerId: number | null;
  email: string;
  name: string;
  surname: string;
  phoneNumber: string;
  setCustomer: (id: number, email: string, name: string, surname: string, phoneNumber: string) => void;
  logout: () => void;
};

const storedData = localStorage.getItem('customer');
const initialData = storedData
  ? JSON.parse(storedData)
  : { customerId: null, email: '', name: '', surname: '' , phoneNumber: ''};

export const useCustomerStore = create<CustomerState>((set) => ({
  ...initialData,

  setCustomer: (id, email, name, surname, phoneNumber) => {
    const newData = { customerId: id, email, name, surname, phoneNumber};
    localStorage.setItem('customer', JSON.stringify(newData));
    set(newData);
  },

  logout: () => {
    localStorage.removeItem('customer');
    set({ customerId: null, email: '', name: '', surname: '', phoneNumber: ''});
  },
}));
