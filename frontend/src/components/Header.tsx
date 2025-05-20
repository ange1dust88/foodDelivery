import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { useCustomerStore } from '@/store/useCustomerStore';
import { toast } from 'sonner';

function Header() {
  const navigate = useNavigate();
  const {customerId, name, surname} = useCustomerStore();
  const { items , addItem, removeItem} = useCartStore();

  const grouped = Object.values(
    items.reduce((acc, item) => {
      if (!acc[item.id]) acc[item.id] = { item, count: 0 };
      acc[item.id].count++;
      return acc;
    }, {} as Record<number, { item: typeof items[number]; count: number }>)
  );
  return (
    <div className='h-(--header-height) fixed top-0 bg-white w-full flex justify-between items-center px-12 border-b-gray-200 border-1 shadow-xs'>
      <div className='flex gap-4 items-center'>
          <Sheet>
            <SheetTrigger asChild>
              <div className="h-12 w-12 rounded-[50%] flex justify-center items-center hover:bg-gray-200 cursor-pointer">
                <FontAwesomeIcon icon={faBars} className='text-3xl'/>
              </div>
            </SheetTrigger>
            <SheetContent side = {'left'}>
              <div className="flex flex-col items-start gap-4 p-4 py-16">

                 {customerId !== null ? (
                    <>
                      <Link to='/my-orders'>
                        <Button variant={'link'} className='text-lg'>{name} {surname}</Button>
                      </Link>
                    </>
                  ):
                  (
                    <>
                      <Button size = 'xl' className='w-full' onClick={() => navigate('/login')}>Sign in</Button>
                      <Button variant={'secondary'} size = 'xl' className='w-full' onClick={() => navigate('/registration')}>Create Account</Button>
                    </>
                  )}
              
                <Button variant={'link'} className='text-md' onClick={() => navigate('/owner-login')}>Partner With Us</Button>
                <Button variant={'link'} className='text-md' onClick={() => navigate('/delivery-registration')}>Start Delivering</Button>
              </div>
   
            </SheetContent>
          </Sheet>
        <h2 className='text-2xl font-stretch-ultra-condensed'>Smaczne <b>Kielce</b></h2>
      </div>

      <div className='flex gap-2 items-center'>
        <Popover>
          <PopoverTrigger>
            <div className=" h-12 w-12 rounded-[50%] flex justify-center items-center hover:bg-gray-200 cursor-pointer">
              <FontAwesomeIcon icon={faCartShopping} className='text-2xl'/>
            </div>
          </PopoverTrigger>
          <PopoverContent className='flex flex-col'>
              {items.length === 0 ? (
              <p>Cart is empty</p>
                ) : (
              <div className="flex flex-col gap-2">
                
                {grouped.map(({ item, count }) => (
                  <div className='flex items-center gap-2 justify-between' key = {item.id}>
                    <div className='flex gap-2'>
                      <img src={item.imageUrl} alt={item.name} className='h-15 w-15 object-cover rounded-xl' />
                      <div>
                        <h2 className='font-medium'>{item.name}</h2>
                        <h2>{item.price} zł</h2>
                      </div>
                    </div>
                    <div className='flex flex-col items-center'>
                      <div 
                        className='bg-white h-6 w-6 flex justify-center items-center rounded-[50%] cursor-pointer hover:bg-gray-100'
                        onClick={() => {
                          addItem(item);
                          toast("Added one more", { description: item.name });
                         }}>+</div>
                      <p className='text-lg font-semibold'>{count}</p>
                      <div 
                        className='bg-white h-6 w-6 flex justify-center items-center rounded-[50%] cursor-pointer hover:bg-gray-100'
                        onClick={() => {
                          removeItem(item.id);
                          toast("Removed one", { description: item.name });
                        }}>-</div>

                    </div>
                  </div>
                ))}
              </div>
              )}
              <Button variant={'link'} onClick={() => useCartStore.getState().clearCart() }>Clear cart</Button>
              <Button onClick={() => navigate('/makeOrder')}>Make order</Button>
          </PopoverContent>
        </Popover>
    
        {customerId !== null ? (
          <>
            <Link to='/my-orders'> {name} {surname}</Link>
          </>
        ):
        (
          <>
          <Button variant={'secondary'} onClick={() => navigate('/login')}>Sign in</Button>
          <Button variant={'secondary'} onClick={() => navigate('/registration')}>Create Account</Button>
          </>
        )}
      </div>
    </div>
  )
}

export default Header
