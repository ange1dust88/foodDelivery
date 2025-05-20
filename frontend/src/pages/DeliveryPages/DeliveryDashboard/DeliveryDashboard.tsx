import SmallHeader from '@/components/SmallHeader';
import { Button } from '@/components/ui/button';
import { useDeliveryPersonStore } from '@/store/useDeliveryPersonStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [currentOrders, setCurrentOrders] = useState<any[]>([]);
  const { deliveryPersonId, name, surname, setStatus, status, logout } = useDeliveryPersonStore();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAvailableOrders = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/orders/availableForDelivery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    const fetchCurrentOrders = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/orders/currentDelivery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deliveryPersonId }),
        });

        if (!response.ok) throw new Error("Failed to fetch current order");

        const data = await response.json();
        setCurrentOrders(data);
      } catch (error) {
        console.error("Failed to fetch current order:", error);
      }
    };

    if (!status) {
      fetchAvailableOrders();
    } else {
      fetchCurrentOrders();
    }
  }, [status, deliveryPersonId]);

  const takeOrder = async (orderId: number) => {
    try {
      const response = await fetch("http://localhost:8080/api/orders/assignDeliveryPerson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          deliveryPersonId,
        }),
      });

      if (!response.ok) throw new Error("Failed to assign order");

      setStatus(true);
    } catch (error) {
      console.error("Failed to assign order:", error);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
      try {
        const response = await fetch("http://localhost:8080/api/orders/updateStatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ orderId, status: newStatus })
        });
  
        if (!response.ok) {
          throw new Error("Failed to update status");
        }
  
        setCurrentOrders(prev =>
          prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } catch (err) {
        console.error(err);
      }
    };
  
    const renderActionButton = (order:any) => {
      switch (order.status) {
        case "pending":
          return <span className="text-gray-500">Pending</span>;
        case "preparing":
          return <span className="text-gray-500">Preparing</span>;
        case "readyForPickup":
          return <span className="text-gray-500">Ready for pick up</span>;
        case "awaitCourierConfirm":
          return (
            <Button
              onClick={() => handleStatusUpdate(order.id, "inTransit")}
            >
              Confirm getting order
            </Button>
          );
        case "inTransit":
          return (
            <Button
              onClick={() => handleStatusUpdate(order.id, "awaitCustomerConfirm")}
            >
                Handed to customer
            </Button>
          );
        case "awaitCustomerConfirm":
          return <span className="text-gray-500">Wait customer to confirm</span>;
        case "completed":
          return <span className="text-gray-500">Completed</span>;
        default:
          return <span className="text-gray-400">No actions</span>;
      }
    };

  return (
    <>
      <SmallHeader isBlack={true} />
      <div className='py-20 flex justify-center items-center h-screen bg-gray-100 '>
        <div className='w-5xl bg-white h-full rounded-xl p-4'>
          <div className='flex flex-col items-start gap-2'>
            <h2 className='text-2xl font-semibold'>{name} {surname}</h2>
            <h2 className="text-2xl font-semibold">
              {status ? "Status: delivering (in progress)" : "No active orders"}
            </h2>


            <div className='mt-4 pb-4 mb-8 border-b-1 w-full border-gray-200'>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button>Log out</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will log you out of your account. Are you sure you want to continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick = {() => {logout; navigate('/delivery-login');} }>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          {!status ? (
            <>
              <h2 className='text-2xl font-semibold mb-6'>Available Orders:</h2>
              <div>
                {orders.map((order: any) => (
                  <div key={order.id} className='border-1 border-gray-100 shadow-xs rounded-xl px-2 py-4 flex justify-between items-center w-full'>
                    <h2 className='text-lg'>From <span className='font-semibold'>{order.restaurant.name} ({order.restaurant.address})</span> to  <span className='font-semibold'>{order.address}</span></h2>
                    <Button onClick={() => takeOrder(order.id)}>Take an order</Button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div>
              <h2 className='text-2xl font-semibold mb-6'>Active Order:</h2>
              <div>
                {currentOrders.map((order: any) => (
                  <div key={order.id} className='border-1 border-gray-100 shadow-xs rounded-xl px-2 py-4 flex justify-between items-center w-full'>
                    <h2 className='text-lg'>From <span className='font-semibold'>{order.restaurant.name} ({order.restaurant.address})</span> to  <span className='font-semibold'>{order.address}</span></h2>
                     {renderActionButton(order)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DeliveryDashboard;
