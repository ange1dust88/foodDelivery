import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SmallHeader from "@/components/SmallHeader";
import { toast } from 'sonner';
function RestaurantPage() {
  const { slug } = useParams();
  const restaurantId = slug?.split("_").pop();
  const [restaurant, setRestaurant] = useState<any>(null);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [tag, setTag] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const [newName, setNewName] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newTag, setNewTag] = useState<string>("");
  const [newImageUrl, setNewImageUrl] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const newItem = {
      name,
      description,
      price: price,
      imageUrl,
      tag
    };

    try {
      const response = await fetch(`http://localhost:8080/api/restaurant/${restaurantId}/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      const message = await response.text();
      if (response.ok) {
        toast('Menu item added!');
        fetchRestaurant(); 
        setName("");
        setDescription("");
        setPrice(0);
        setTag("");
        setImageUrl("");
      } else {
        toast(`Error: ${message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast('Failed to add item.');
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/restaurant/${restaurantId}/menu/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast('Menu item deleted!');
        fetchRestaurant();
      } else {
        const message = await response.text();
        toast(`Error: ${message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast('Failed to delete item.');
    }
  };

  const fetchRestaurant = () => {
    if (restaurantId) {
      fetch(`http://localhost:8080/api/restaurant/${restaurantId}`)
        .then((res) => res.text())
        .then((text) => {
          console.log("SERVER RESPONSE:", text);
          const json = JSON.parse(text);
          setRestaurant(json);
        })
        .catch((err) => console.error("Error loading restaurant:", err));
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  const handleEditSubmit = async (e: any, itemId: string) => {
    e.preventDefault();
  
    const updatedItem = {
      name: newName,
      description: newDescription,
      price: newPrice,
      imageUrl: newImageUrl,
      tag: newTag,
    };
  
    try {
      const response = await fetch(`http://localhost:8080/api/restaurant/${restaurantId}/menu/${itemId}`, {
        method: 'PUT',  
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });
  
      const message = await response.text();
      if (response.ok) {
        toast('Menu item updated!');
        fetchRestaurant(); 
      } else {
        toast(`Error: ${message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast('Failed to update item.');
    }
  };
  
  const handleEditClick = (item: any) => {
    setNewName(item.name);
    setNewDescription(item.description);
    setNewPrice(item.price);
    setNewTag(item.tag);
    setNewImageUrl(item.imageUrl);
  };
  

  if (!restaurant) return <div>Loading...</div>;

  return (
    <> 
      <SmallHeader isBlack={true}/>

      <div className="bg-gray-100 h-screen flex justify-start p-10 gap-2 pt-20">
        <div className="flex flex-col flex-2/5 gap-2">
          {/* restaurant info */}
          <div className="bg-white rounded-xl p-4 flex flex-col w-full">
            
              <h2 className="text-2xl font-bold">{restaurant.name}</h2>
              <p>{restaurant.address}</p>
              <p>{restaurant.phoneNumber}</p>
              <a href={restaurant.webSite}>{restaurant.webSite}</a>
              <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-48 rounded-xl object-cover" />
              <Button className= 'w-full mt-4' onClick={() => navigate(`/manageOrders/:${restaurantId}`)}>Manage Orders</Button>

          </div>

          {/* add menu item */}
          <div className="bg-white rounded-xl p-4  flex-3/5">
           
              <h3 className="text-xl font-bold mb-2">Add Menu Item</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <Input
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  required
                  />
                <Input
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  required
                  />
                <Input
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  placeholder="Price"
                  type="number"
                  required
                />
                <Input
                  name="tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Tag"
                  required
                  />
                <Input
                  name="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Image URL"
                  />
                <Button type="submit">
                  Add
                </Button>
              </form>
            
           
          

          </div>


        </div>


        {/* menu */}
        <div className="bg-white flex flex-col gap-2 flex-3/4 rounded-xl p-4">
          <h2 className="text-2xl font-semibold">Menu:</h2>
          <div className="pr-4 overflow-y-scroll">
            {restaurant.menu.map((item: any) => (
              <div className="border-1 border-gray-100 shadow-xs rounded-xl p-4 w-full flex justify-between items-center" key={item.id}>
                <div className="flex gap-2 items-center">
                  <img src={item.imageUrl} alt={item.name} className="rounded-xl w-20 h-20 object-cover" />
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <h2 className="font-light">{item.description}</h2>
                    <h2 className="font-semibold">{item.tag}</h2>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-center">
                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                          >
                          Delete
                      </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            menu item and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <h2 className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleEditClick(item)}>
                          Edit
                        </h2>
                      </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Edit menu item</DialogTitle>
            
                            <DialogDescription>
                              Make changes to your menu item here. Click save when you're done.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col gap-2">
                            <Input
                              name="name"
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              placeholder="Name"
                              required
                              />
                            <Input
                              name="description"
                              value={newDescription}
                              onChange={(e) => setNewDescription(e.target.value)}
                              placeholder="Description"
                              required
                              />
                            <Input
                              name="price"
                              value={newPrice}
                              onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                              placeholder="Price"
                              type="number"
                              required
                              />
                            <Input
                              name="tag"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="tag"
                              />
                            <Input
                              name="imageUrl"
                              value={newImageUrl}
                              onChange={(e) => setNewImageUrl(e.target.value)}
                              placeholder="Image URL"
                              />
                            
                          </div>
                
                          <DialogFooter>
                            <Button onClick={(e) => handleEditSubmit(e, item.id)}>Save</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                  </div>
                  <h2 className="text-lg font-semibold">{item.price} zł</h2>
                  <h2 className="text-transparent">:</h2>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </>
  );
}

export default RestaurantPage;
