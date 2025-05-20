import SmallHeader from "@/components/SmallHeader";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type MenuItem = {
  id: number;
  name: string;
};
type OrderItem = {
  menuItem: MenuItem;
  quantity: number;
};

type Customer = {
  id: number;
  surname: string;
  name: string;
};

type DeliveryPerson = {
  id: number;
  surname: string;
  name: string;
}

type Order = {
  id: number;
  address: string;
  customer: Customer;
  orderItems: OrderItem[];
  totalPrice: number;
  status: string;
  deliveryPerson: DeliveryPerson;
};

function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { slug } = useParams();
  const restaurantId = slug?.replace(/^:/, '');
  const activeOrders = orders.filter(order => order.status !== "completed");
  const completedOrders = orders.filter(order => order.status === "completed");


  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/orders/byRestaurant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ restaurantId: restaurantId })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      const { orders, items } = data;

      if (!Array.isArray(orders) || !Array.isArray(items)) {
        setOrders([]);
        return;
      }

      const itemsByOrderId: Record<number, MenuItem[]> = {};
      for (const item of items) {
        if (!itemsByOrderId[item.orderId]) {
          itemsByOrderId[item.orderId] = [];
        }
        itemsByOrderId[item.orderId].push(item);
      }

      const mergedOrders: Order[] = orders.map(order => ({
        ...order,
        items: itemsByOrderId[order.id] || []
      }));
      console.log(mergedOrders);
      setOrders(mergedOrders);

    } catch (err) {
      console.error(err);
    }
  };

  fetchOrders();
}, [slug]);



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

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const renderActionButton = (order: Order) => {
    switch (order.status) {
      case "pending":
        return (
          <Button
            onClick={() => handleStatusUpdate(order.id, "preparing")}
          >
            Accept (Preparing)
          </Button>
        );
      case "preparing":
        return (
          <Button
            onClick={() => handleStatusUpdate(order.id, "readyForPickup")}
          >
            Ready for Pickup
          </Button>
        );
      case "readyForPickup":
        return (
          <Button
            onClick={() => handleStatusUpdate(order.id, "awaitCourierConfirm")}
          >
            Handed to Courier
          </Button>
        );
      case "awaitCourierConfirm":
        return <span className="text-gray-500">Wait for courier to confirm</span>;
      case "inTransit":
        return <span className="text-gray-500">On the way</span>;
      case "awaitCustomerConfirm":
        return <span className="text-gray-500">Handed to customer</span>;
      case "completed":
        return <span className="text-gray-500">Completed</span>;
      default:
        return <span className="text-gray-400">No actions</span>;
    }
  };

  return (
    <>
      <SmallHeader isBlack={true}/>

      <div className="pt-20">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Customer</th>
              <th className="border px-4 py-2">Customer's Address</th>
              <th className="border px-4 py-2">Courier</th>
              <th className="border px-4 py-2">Items</th>
              <th className="border px-4 py-2">Total Price</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
          {[...activeOrders, ...completedOrders].map((order, index) => {
            const isFirstCompleted =
              order.status === "completed" &&
              (index === 0 || [...activeOrders, ...completedOrders][index - 1].status !== "completed");

            return (
              <tr
                key={order.id}
                className={`border-b ${isFirstCompleted ? "border-t-4 border-black" : ""}`}
              >
                <td className="border px-4 py-2">{order.customer?.name} {order.customer?.surname}</td>
                <td className="border px-4 py-2">{order.address}</td>
                <td className="border px-4 py-2 capitalize">{order.deliveryPerson?.name} {order.deliveryPerson?.surname}</td>
                <td className="border px-4 py-2">
                  <ul className="list-disc pl-4">
                    {order.orderItems.map((item: any) => (
                      <li key={item.menuItem.id}>
                        {item.menuItem.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border px-4 py-2">{order.totalPrice.toFixed(2)} zł</td>
                <td className="border px-4 py-2">{renderActionButton(order)}</td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>
    </>
  );
}

export default ManageOrders;
