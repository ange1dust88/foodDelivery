import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner';
function OwnerRegister() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const newUser = {
      name,
      surname,
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:8080/api/owner/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
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
    <div className="flex justify-center items-center h-screen ">
      <div className="border-1 shadow-xs border-gray-200 flex gap-1 flex-col justify-center items-center px-10 py-20 rounded-xl min-w-md">
        <h1 className="text-2xl pb-6">Owner registration</h1>
        <form onSubmit={handleSubmit} className="flex gap-4 flex-col justify-center items-center w-full">
          <Input
            type="text"
            placeholder="name"
            value={name}
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
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button className="w-full">
            Create account
          </Button>

          <h2 className='mt-2'>Already have an account? <Link to = '/owner-login'>Login</Link> </h2>

        </form>
      </div>
    </div>
  );
}

export default OwnerRegister
