import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOwnerStore } from "../../../store/useOwnerStore";
import { Button } from "@/components/ui/button"
import RestaurantCard from "@/components/RestaurantCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import SmallHeader from "@/components/SmallHeader";
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

function OwnerDashboard() {
  const { email,name, surname,ownerId, logout} = useOwnerStore();
  const [restaurants,setRestaurants] = useState<Restaurant[]>([]);

  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [priceLevel, setPriceLevel] = useState(1);
  const [logoImageUrl,setLogoImageUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [webSite, setWebSite] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/owner/${ownerId}/restaurants`);
      if (!response.ok) throw new Error("Failed to fetch restaurants");
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error("Error loading restaurants:", error);
    }
  };

  useEffect(() => {

    if (ownerId) {
      fetchRestaurants();
    }
  }, [ownerId]);

  const logoutHandle = () => {
    logout();
    navigate('/owner-login');
  }

  const handleSubmit = async () => {
    const newRestaurant = {
        name: restaurantName,
        address,
        priceLevel,
        logoImageUrl,
        imageUrl,
        ownerId : ownerId,
        phoneNumber,
        webSite
    };

    try {
        const response = await fetch(`http://localhost:8080/api/owner/${ownerId}/restaurant`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRestaurant),
        });

        const message = await response.text();
        if (response.ok) {
            toast('Restaurant created!');
            setRestaurantName('');
            setAddress('');
            setPriceLevel(1);
            setImageUrl('');
            setPhoneNumber('');
            setWebSite('');
        } else {
            toast(`Error: ${message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        toast('Failed to create restaurant.');
    }
  };
  const isFormValid = () => {
    return (
      restaurantName.trim() !== '' &&
      address.trim() !== '' &&
      priceLevel >= 1 &&
      priceLevel <= 5 &&
      logoImageUrl.trim() !== '' &&
      imageUrl.trim() !== '' &&
      phoneNumber.trim() !== '' &&
      webSite.trim() !== ''
    );
  };


  return (
    <>
      <SmallHeader isBlack={true}/> 
      <div className="h-screen p-4 pt-16 flex justify-center items-center">
        <div className="min-w-7xl h-full">

          <div className="rounded-xl p-4 mb-2 bg-gray-100 flex flex-col h-45 mt-2">
            <h2 className="text-2xl font-bold mb-4">Admin panel:</h2>
            <div className="flex gap-16">

              <div>
                <h1 className="text-lg font-semibold">{email}</h1>
                <div className="flex gap-1">
                  <h1 className="text-lg">{name}</h1>
                  <h1 className="text-lg">{surname}</h1>
                </div>
              </div>
              <div className="flex flex-col gap-2">
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
                      <AlertDialogAction onClick={logoutHandle}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Dialog>
                <DialogTrigger asChild>
                  <Button>Create Restaurant</Button> 
                </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Create restaurant</DialogTitle>

                      <DialogDescription>
                        Make changes to your menu item here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                      <Input
                          placeholder='Title'
                          type="text"
                          value={restaurantName}
                          onChange={(e) => setRestaurantName(e.target.value)}
                          required
                          />
                  
                      <Input
                          type="text"
                          placeholder='Adress'
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                          />
                  
                      <Input
                          placeholder='Price level(1-5)'
                          type="number"
                          value={priceLevel}
                          min={1}
                          max={5}
                          onChange={(e) => setPriceLevel(Number(e.target.value))}
                          required
                          />
                      
                      <Input
                          placeholder='Logo Image URL'
                          type="text"
                          value={logoImageUrl}
                          onChange={(e) => setLogoImageUrl(e.target.value)}
                          required
                          />

                      <Input
                          placeholder='Image URL'
                          type="text"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          required
                          />

                      <Input
                          placeholder='phone number'
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                          />
                          
                      <Input
                          placeholder='web site link'
                          type="text"
                          value={webSite}
                          onChange={(e) => setWebSite(e.target.value)}
                          required
                          />
                    </div>
          
                    <DialogFooter>
                      <Button onClick={handleSubmit} disabled={!isFormValid()}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
              </Dialog>
              </div>
            </div>

          </div>
          <div className=" rounded-xl p-4 mb-4 border-2 border-gray-100">
            <h2 className="text-2xl font-bold mb-4">My Restaurants:</h2>
            <div className="flex justify-start gap-2">
              {restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                    <RestaurantCard
                      id = {restaurant.id} 
                      name = {restaurant.name}
                      address = {restaurant.address} 
                      phoneNumber = {restaurant.phoneNumber} 
                      webSite = {restaurant.webSite} 
                      priceLevel = {restaurant.priceLevel} 
                      imageUrl = {restaurant.imageUrl} 
                      logoImageUrl = {restaurant.logoImageUrl}
                      redirectionLink = {`/restaurant-management/${restaurant.name}_${restaurant.id}`} 
                      showBtn = {true}
                      />
                    ))
                  ) : (
                    <p>No restaurants yet.</p>
                  )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OwnerDashboard;
