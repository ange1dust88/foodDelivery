import Header from "@/components/Header";
import MenuItem from "@/components/MenuItem";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
function Restaurant() {
  const { slug } = useParams();
  const restaurantId = slug?.split(":").pop();
  const [restaurant, setRestaurant] = useState<any>(null);
  const { addItem } = useCartStore();

  useEffect(() => {
    if (restaurantId) {
      fetch(`http://localhost:8080/api/restaurant/${restaurantId}`)
        .then((res) => res.json())
        .then((data) => setRestaurant(data))
        .catch((err) => console.error("Error loading restaurant:", err));
    }
  }, [restaurantId]);


  const handleAddToCart =  (menuItem: any) => {
    addItem({
      ...menuItem,
      restaurantId: restaurant.id, 
    });
  };

  const groupMenuByTag = (menu: any[]) => {
    const grouped: Record<string, any[]> = {};
    for (const item of menu) {
      const tag = item.tag || "General";
      if (!grouped[tag]) {
        grouped[tag] = [];
      }
      grouped[tag].push(item);
    }
    return grouped;
  };


  return (
    <> 
      <Header />
      <div className=" flex justify-center min-h-screen pt-(--header-height)">
        {!restaurant ? (
          <p>Loading...</p>
        ) : (
          <div className="w-6xl h-full p-10">

            <div className="flex flex-col gap-2">
              <div className="relative mb-12">
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="w-full h-64 rounded-xl object-cover shadow-2xs"
                />
                <img
                  src={restaurant.logoImageUrl}
                  alt={restaurant.name}
                  className="w-24 h-24 rounded-[50%] object-cover absolute -bottom-12 left-4 border-2 botder-white"
                />
              </div>
              <h2 className="text-3xl font-bold">{restaurant.name}</h2>
              <div className="flex gap-1">
                <p>• {restaurant.phoneNumber} • </p>
                <a href={restaurant.webSite} className="text-blue-600 hover:underline">
                  {restaurant.webSite}
                </a>
              </div>
              <p>{restaurant.address}</p>
            </div>

            {Object.entries(groupMenuByTag(restaurant.menu)).map(([tag, items]) => (
              <div key={tag} className="my-4">
                <h3 className="text-2xl font-medium mb-4">{tag}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {items.map((item: any) => (
                    <MenuItem
                      key={item.id}
                      name={item.name}
                      price={item.price}
                      description={item.description}
                      imageUrl={item.imageUrl}
                      onClick={() => handleAddToCart(item)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          
        )}
      </div>
    </>
  );
}

export default Restaurant;


//todo:
// restaurant page demo 
// adding items to chart


// make order -> add order to bd (id,restaurant, customer data, items, reward, status, delivery person)
