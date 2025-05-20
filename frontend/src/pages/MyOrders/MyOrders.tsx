import SmallHeader from "@/components/SmallHeader";
import { Button } from "@/components/ui/button";
import { useCustomerStore } from "@/store/useCustomerStore";
import { useDeliveryPersonStore } from "@/store/useDeliveryPersonStore";
import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const { customerId, email, name, surname, phoneNumber, logout } = useCustomerStore();
  const { setStatus } = useDeliveryPersonStore();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/orders/customerOrders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/orders/updateStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (newStatus === "completed") {
        setStatus(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderActionButton = (order: any) => {
    switch (order.status) {
      case "pending":
        return <span className="text-gray-500">Pending</span>;
      case "preparing":
        return <span className="text-gray-500">Preparing</span>;
      case "readyForPickup":
        return <span className="text-gray-500">Ready for pickup</span>;
      case "awaitCourierConfirm":
        return <span className="text-gray-500">Headed to courier</span>;
      case "inTransit":
        return <span className="text-gray-500">On the way</span>;
      case "awaitCustomerConfirm":
        return (
          <Button onClick={() => handleStatusUpdate(order.id, "completed")}>
            Confirm getting order
          </Button>
        );
      case "completed":
        return <span className="text-gray-500">Completed</span>;
      default:
        return <span className="text-gray-400">No actions</span>;
    }
  };

  const activeOrders = orders.filter((order) => order.status !== "completed");
  const completedOrders = orders.filter((order) => order.status === "completed");

  return (
    <>
      <SmallHeader isBlack={true} />
      
      <div className="py-20 flex flex-col justify-center items-center h-screen bg-gray-100 gap-2">
        <div className="w-6xl bg-white rounded-xl p-4 flex justify-between">
          <div className="flex flex-col gap-1 mb-3">
            <h2 className="text-xl font-semibold">{name} {surname}</h2>
            <h2>{email}</h2>
            <h2>{phoneNumber}</h2>
          </div>
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
                <AlertDialogAction onClick = {() => {logout; navigate('/login');} }>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="w-6xl bg-white rounded-xl h-full p-4 overflow-y-scroll">
          {activeOrders.length > 0 && (
            <h1 className="text-2xl font-semibold mb-2">Active orders:</h1>
          )}
  
          {activeOrders.map((order: any) => (
            <div
              key={order.id}
              className="flex gap-2 items-center py-4 px-2 border-b border-gray-300 justify-betwee"
            >
              <h2 className="text-xl font-semibold">{order.restaurant.name}</h2>
              <div>
                {order.orderItems.map((item: any) => (
                  <div key={item.menuItem.id} className="flex items-center gap-1">
                    <img
                      src={item.menuItem.imageUrl}
                      alt={item.menuItem.name}
                      className="h-16 w-16 object-cover rounded-xl"
                    />
                    <div>
                      <h2>{item.menuItem.name} × {item.quantity}</h2>
                      <h2>{item.menuItem.price} zł</h2>
                    </div>
                  </div>
                ))}
              </div>
              <h2 className="text-md font-semibold">{order.totalPrice} zł</h2>
              {renderActionButton(order)}
            </div>
          ))}
          {completedOrders.length > 0 && activeOrders.length > 0 && (
            <div className="border-t-4 border-black my-6"></div>
          )}
          {completedOrders.length > 0 && (
            <h1 className="text-2xl font-semibold mb-2">Completed orders:</h1>
          )}
          {completedOrders.map((order: any) => (
            <div
              key={order.id}
              className="flex gap-2 items-center py-4 px-2 border-b border-gray-200 justify-between opacity-70"
            >
              <h2 className="text-xl font-semibold">{order.restaurant.name}</h2>
              <div>
                {order.orderItems.map((item: any) => (
                  <div key={item.menuItem.id} className="flex items-center gap-1">
                    <img
                      src={item.menuItem.imageUrl}
                      alt={item.menuItem.name}
                      className="h-16 w-16 object-cover rounded-xl"
                    />
                    <div>
                      <h2>{item.menuItem.name} × {item.quantity}</h2>
                      <h2>{item.menuItem.price} zł</h2>
                    </div>
                  </div>
                ))}
              </div>
              <h2 className="text-md font-semibold">{order.totalPrice} zł</h2>
              {renderActionButton(order)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MyOrders;
