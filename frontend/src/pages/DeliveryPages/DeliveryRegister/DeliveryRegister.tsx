import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SmallHeader from '@/components/SmallHeader';
import { toast } from 'sonner';
function DeliveryRegister() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const newDeliveryPerson = {
      name,
      surname,
      email,
      phoneNumber,
      password,
      status: false,
    };

    try {
      const response = await fetch('http://localhost:8080/api/delivery/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDeliveryPerson),
      });
      if (response.ok) {
        toast('Account created successfully');
      } else {
        toast('Error creating account');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <>
      <SmallHeader isBlack={true}/>

      <div className="flex justify-center items-center h-screen">
        <div className="boder-gray-200 border-1 flex gap-1 flex-col justify-center items-center px-10 py-20 shadow-xs rounded-xl">
          <h1 className="text-2xl pb-4">Registration page</h1>
          <form onSubmit={handleSubmit} className="flex gap-4 flex-col justify-center items-center w-90">
            <Input
              type="text"
              placeholder="name"
              value={name}
              className='w-full'
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              type="text"
              placeholder="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />

            <Input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="tel"
              placeholder="phone number"
              value={phoneNumber}
              maxLength={9}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setPhoneNumber(value);
              }}
              pattern="^[0-9]{9}$"
              required
              />

            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button className="w-full">
              Create account
            </Button>

            <h2 className='mt-2'>Already have an account? <Link to = '/delivery-login'>Login</Link> </h2>

          </form>
        </div>
      </div>
    </>
  );
}

export default DeliveryRegister
