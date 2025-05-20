import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "./ui/input";

interface RestaurantCardTypes {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  webSite: string;
  priceLevel: number;
  imageUrl: string;
  logoImageUrl: string;
  redirectionLink: string;
  showBtn: boolean;
}



function RestaurantCard({
  id, name, address, phoneNumber, webSite, priceLevel, imageUrl, logoImageUrl, redirectionLink, showBtn=false
}: RestaurantCardTypes) {
  const navigate = useNavigate();

  const handleCardClick = useCallback(() => {
    navigate(redirectionLink);
  }, [navigate, redirectionLink]);

  const [newName, setNewName] = useState(name);
  const [newAddress, setNewAddress] = useState(address);
  const [newPriceLevel, setNewPriceLevel] = useState(1);
  const [newLogoImageUrl,setNewLogoImageUrl] = useState(logoImageUrl);
  const [newImageUrl, setNewImageUrl] = useState(imageUrl);
  const [newWebSite, setNewWebSite] = useState(webSite);
  const [newPhoneNumber, setNewPhoneNumber] = useState(phoneNumber);

  const deleteRestaurant = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/restaurant/${id}`, {
      method: 'DELETE',
    
      });

      const message = await response.text();
      if (response.ok) {
          alert('Restaurant deleted!');
      } else {
          alert(`Error: ${message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete restaurant.');
    }
  }

  const editRestaurant = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/restaurant/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName,
          address: newAddress,
          phoneNumber: newPhoneNumber,
          webSite: newWebSite,
          priceLevel: newPriceLevel,
          imageUrl: newImageUrl,
          logoImageUrl: newLogoImageUrl,
        }),
      });
  
      const message = await response.text();
      if (response.ok) {
        alert('Restaurant updated!');
      } else {
        alert(`Error: ${message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update restaurant.');
    }
  };
  

  return (
    <div
      key={id}
      className="  rounded-xl cursor-pointer"
      onClick={handleCardClick}
    >
      <img src={imageUrl} className="w-100 h-35 rounded-xl mt-2 object-cover" />
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="font-bold text-gray-500">{"$".repeat(priceLevel)}</p>
      </div>
      <p className="text-gray-500 text-sm">{address}</p>


      {showBtn === true &&
      (
      <div
        className="flex gap-2 mt-2"
        onClick={(e) => e.stopPropagation()} 
      >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                restaurant and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={deleteRestaurant}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog>
        <DialogTrigger asChild>
          <Button>Edit</Button>
        </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit restaurant</DialogTitle>

              <DialogDescription>
                Make changes to your restaurant here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Input
                  placeholder='Title'
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
              />
          
              <Input
                  type="text"
                  placeholder='Adress'
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  required
              />
          
              <Input
                  placeholder='Price level(1-5)'
                  type="number"
                  value={newPriceLevel}
                  min={1}
                  max={5}
                  onChange={(e) => setNewPriceLevel(Number(e.target.value))}
                  required
              />
              
              <Input
                  placeholder='Logo Image URL'
                  type="text"
                  value={newLogoImageUrl}
                  onChange={(e) => setNewLogoImageUrl(e.target.value)}
                  required
              />

              <Input
                  placeholder='Image URL'
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  required
              />

              <Input
                  placeholder='phone number'
                  type="text"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                  required
              />
              
                  
              <Input
                  placeholder='web site link'
                  type="text"
                  value={newWebSite}
                  onChange={(e) => setNewWebSite(e.target.value)}
                  required
              />
            </div>
  
            <DialogFooter>
              <Button onClick={editRestaurant}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      )}
      
    </div>
  );
}

export default RestaurantCard;
