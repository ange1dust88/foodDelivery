import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCustomerStore } from '@/store/useCustomerStore';
import SmallHeader from '@/components/SmallHeader';
import { toast } from 'sonner';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const setCustomer = useCustomerStore((state) => state.setCustomer);
  


  const handleSubmit = async (e: any) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), 
      });

      
      if (response.ok) {
        const data = await response.json();
        toast('Login successful');
        setCustomer(data.id, data.email, data.name, data.surname, data.phoneNumber);
        console.log(data.id, data.email, data.name, data.surname, data.phoneNumber);
        navigate('/');
        
      } else {
        const message = await response.text();
        toast(`Login failed: ${message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast('An error occurred. Please try again.');
    }
  };
  

  return (
    <>
      <SmallHeader isBlack={true}/>
      <div className=" flex justify-center items-center h-screen">
        <div className=" flex gap-1 flex-col justify-center items-center px-10 py-20 rounded-xl border-1 border-gray-200 shadow-xs">
          <h1 className="text-2xl pb-6">Login page</h1>
          <form onSubmit={handleSubmit} className="flex gap-4 flex-col justify-center items-center">

            <Input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Login
            </Button>

            <h2 className='mt-2'>Don't have an account? <Link to = '/registration'>Create account</Link> </h2>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login
