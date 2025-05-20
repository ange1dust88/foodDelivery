import Header from "@/components/Header";
import RestaurantCard from "@/components/RestaurantCard";
import { Button } from "@/components/ui/button";
import { useCustomerStore } from "@/store/useCustomerStore";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


interface Restaurant {
  id: number;
  name: string;
  address: string;
  priceLevel: number;
  imageUrl: string;
  logoImageUrl: string;
  phoneNumber: string;
  webSite: string;
}
function Dashboard() {

  const [restaurants,setRestaurants] = useState<Restaurant[]>([]);
  const navigate = useNavigate();
  const {customerId} = useCustomerStore();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/restaurants`);
        if (!response.ok) throw new Error("Failed to fetch restaurants");
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Error loading restaurants:", error);
      }
    };

    
    fetchRestaurants();
    
  }, []);

  return (
    <>
      <Header />
      <div className="flex justify-center min-h-screen pt-(--header-height)">

        <div className="w-full h-full p-10 flex">

          {/* left */}
          <div className="w-70 h-full p-5 flex flex-col gap-2 items-start">

            <div className="flex gap-2 bg-gray-100 p-2 pl-4 rounded-xl text-base font-stretch-70% items-center w-full justify-start cursor-pointer border-l-4 border-l-black">
              <FontAwesomeIcon icon={faHouse} />
              Main page
            </div>
            {!customerId && (
              <>
                <Button variant='link' onClick={() => navigate('/registration')}>Create account</Button>
                <Button variant='link' onClick={() => navigate('/login')}>Sign in</Button>
              </>
            )} 
            
          </div>

          {/* rigth */}
          <div className="p-5">
            <div className="w-full   rounded-xl flex justify-between mb-3">
              <div className="flex flex-col gap-1">
                <h1 className="text-5xl font-semibold">Hungry?</h1>
                <h1 className="text-5xl font-semibold mt-2">Let’s fix that</h1>
                <h2 className="text-lg font-light mt-2">Find your favorite restaurant, cuisine, or dish.</h2>
              </div>

              <div className="bg-green-400 flex justify-between rounded-xl w-105">
                <div className="py-6 px-3">
                  <h2 className="text-xl">Get 10% Off Your Next Meal!</h2>
                  <h1 className="text-2xl font-semibold">Use Code: <span className="font-bold">PROMO10</span></h1>
                </div>
                <img src="food.jpg" alt="food"  className="object-cover h-45 w-40 rounded-r-xl"/>

              </div>

            </div>
            <h2 className="text-3xl font-bold pb-8">All restaurants</h2>
            <div className="grid grid-cols-3 gap-4 pb-4">
              {restaurants.length > 0 ? (
                  restaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      id = {restaurant.id} 
                      name = {restaurant.name}
                      address = {restaurant.address} 
                      phoneNumber = {restaurant.phoneNumber} 
                      webSite = {restaurant.webSite} 
                      priceLevel = {restaurant.priceLevel} 
                      imageUrl = {restaurant.imageUrl} 
                      logoImageUrl={restaurant.logoImageUrl}
                      redirectionLink = {`/restaurant/:${restaurant.id}`} 
                      showBtn = {false}
                      />
                  ))
                ) : (
                  <p>No restaurants</p>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
