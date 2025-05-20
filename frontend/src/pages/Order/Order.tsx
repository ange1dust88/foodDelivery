import SmallHeader from '@/components/SmallHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/useCartStore';
import { useCustomerStore } from '@/store/useCustomerStore';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useNavigate } from 'react-router-dom';


function Order() {
  const { items, addItem, removeItem, clearCart } = useCartStore();
  const { customerId, name, surname, email, phoneNumber } = useCustomerStore();

  const [total, setTotal] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [address, setAddress] = useState('');
  const itemIds = items.map(item => item.id);
  const navigate = useNavigate();
  const grouped = Object.values(
    items.reduce((acc, item) => {
      if (!acc[item.id]) acc[item.id] = { item, count: 0 };
      acc[item.id].count++;
      return acc;
    }, {} as Record<number, { item: typeof items[number]; count: number }>)
  );

  const fetchTotalPrice = async (promo?: string) => {
  try {
    const payload = {
      itemIds,
      promocode: promo || '',
    };

    const res = await fetch("http://localhost:8080/api/orders/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to calculate price");

    const totalFromServer = await res.json(); 

    const rawTotal = grouped.reduce((sum, { item, count }) => sum + item.price * count, 0); 
    const deliveryFee = 5;
    const rawTotalWithDelivery = rawTotal + deliveryFee;
    const discount = rawTotalWithDelivery > 0 
        ? Math.round((1 - totalFromServer / rawTotalWithDelivery) * 100) 
        : 0;
    setSubtotal(rawTotal); 
    setDiscountPercent(discount);
    setTotal(totalFromServer); 
  } catch (error) {
    console.error("Calculation failed:", error);
  }
};



  useEffect(() => {
    if (items.length > 0) fetchTotalPrice();
  }, [items]);

  const handleApplyPromo = () => {
    fetchTotalPrice(promoCode);
  };

  const handleCreateOrder = async () => {
    if (items.length === 0) {
      toast("Cart is empty");
      return;
    }

    const restaurantId = items[0].restaurantId;

    if (!restaurantId || !customerId) {
      toast("Missing restaurant or customer ID");
      return;
    }

    if (!address.trim()) {
    toast("Please enter a delivery address");
    return;
  }

    const payload = {
      customerId,
      restaurantId,
      items: grouped.map(({ item, count }) => ({
        id: item.id,
        quantity: count,
      })),
      address,
      totalPrice: total,
    };
    try {
      const response = await fetch("http://localhost:8080/api/orders/makeOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create order");
      clearCart();
      toast("Order placed successfully");
      navigate('/my-orders');
    } catch (error) {
      console.error("Failed to create order:", error);
      toast("Failed to create order");
    }
  };

  return (
    <>
      <SmallHeader isBlack={false} />
      <div className="flex justify-center items-center bg-gray-100 min-h-screen">
        <div className="w-7xl h-210 p-10 flex gap-4">

          <div className='w-2/3 shadow-xs flex flex-col gap-4'>
            <div className='bg-white rounded-xl p-4 h-1/4'>
              <h1 className='font-medium text-xl mb-2'>Customer information</h1>
              <div className='py-2 flex flex-col gap-1 '>
                <h2>{name} {surname}</h2>
                <h2>{email}</h2>
                <h2>{phoneNumber}</h2>
                <Input
                  placeholder='Delivery Address'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <div className='bg-white rounded-xl p-4 h-3/4'>
              {items.length === 0 ? (
                <p>Cart is empty</p>
              ) : (
                <div className="flex flex-col gap-2 h-full">
                  <h1 className='font-medium text-xl mb-2'>Your Order</h1>
                  <div className='flex flex-col gap-2 overflow-y-scroll'>
                    {grouped.map(({ item, count }) => (
                      <div key={item.id} className='flex items-center gap-2 justify-between border-b border-gray-100 pb-2'>
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
                </div>
              )}
            </div>
          </div>

          <div className='bg-white rounded-xl w-1/3 shadow-xs p-4 flex flex-col gap-2'>
            <h2 className="text-lg">Subtotal: {subtotal.toFixed(2)} zł</h2>
            <h2 className="text-lg">Delivery Fee: 5.00 zł</h2>
            <h2 className="text-lg">Discount: {discountPercent}%</h2>
            <h2 className="text-lg font-semibold">Total: {total.toFixed(2)} zł</h2>

            <div className='flex gap-2 my-3'>
              <Input
                placeholder='Enter promo code'
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <Button onClick={handleApplyPromo}>Apply</Button>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className='w-full'>Confirm Order</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Are o
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCreateOrder}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
          </div>

        </div>
      </div>
    </>
  );
}

export default Order;
