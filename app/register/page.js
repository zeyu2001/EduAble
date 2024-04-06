"use client";

import { useState } from 'react';
import Navbar from '../../components/Navbar';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import GSignIn from '@/components/GSignIn';

const RegistrationForm = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.email,
        password: user.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          withReactContent(Swal).fire({
            icon: "error",
            title: "Error",
            text: data.error,
          })
        } else {
          withReactContent(Swal).fire({
            icon: "success",
            title: "Success",
            text: "User created",
          })
        }
      })
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="p-10 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-center">Register</h2>
        <div className="mb-4">
          <GSignIn />
        </div>
        <div className='text-center my-4'>or register with email</div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-bold">Email</label>
            <input type="email" id="email" name="email" onChange={handleChange} value={user.email} className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-bold">Password</label>
            <input type="password" id="password" name="password" onChange={handleChange} value={user.password} className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" required />
          </div>
          <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

const App = () => {
  return (
    <div className="min-h-screen bg-gray-1000 p-6">
      <div className="text-center">
        <Navbar />
        <RegistrationForm />
      </div>
    </div>
  );
}

export default App;
