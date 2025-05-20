import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "./ui/button";
import {  toast } from "sonner"
import { DialogTitle } from "@radix-ui/react-dialog";

interface MenuItemTypes {
    name: string;
    imageUrl: string;
    price: number;
    description: string;
    onClick: () => void;

}


function MenuItem({name, imageUrl, price, description, onClick} : MenuItemTypes) {

   

  return (
    


    <Dialog>
        <DialogTrigger asChild>
            <div className='flex h-35 border-1 border-gray-300 rounded-xl justify-between w-full shadow-md relative'>
                <div className="p-4">
                    <h1 className="text-xl font-bold">{name}</h1>
                    <h2 className="font-medium">{price} zł</h2>
                    <p className="text-gray-500 ">{description}</p>
                </div>
                <img src={imageUrl} alt={name}  className='object-cover min-h-35 min-w-45 h-35 w-45 rounded-r-xl'/>
            </div>
        </DialogTrigger>

        <DialogContent className="max-w-4xl py-10 flex">
            <DialogTitle></DialogTitle>
            <div className="w-116 h-100 min-w-116 min-h-100 overflow-hidden">
                <img src={imageUrl} alt={name} className='w-full h-full object-cover transition-transform  duration-300 ease-in-out hover:scale-120'/>
            </div>
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold">{name}</h1>
                <h2 className="text-xl font-semibold">{price} zł</h2>
                <p className="text-gray-500 text-xl">{description}</p>
                <Button 
                    className="w-full mt-6 text-xl h-12" 
                    onClick={ () => {
                        onClick();
                        toast("Added item", { description: name });
                }}>
                    Add to order • {price} zł</Button>
            </div>

        </DialogContent>
    </Dialog>
  )
}

export default MenuItem
