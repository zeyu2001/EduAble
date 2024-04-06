"use client";

import { useEffect, useState } from "react";

const getQuery = () => {
  return new URLSearchParams(window.location.search);
}

const Page = () => {

  const [error, setError] = useState(null);
  
  useEffect(() => {
    const query = getQuery();
    const error = query.get('error');
    const token = query.get('token');

    if (error) {
      setError(error);
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }

    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/';
    }
  });

  return (
    <div className="flex justify-center items-center h-screen">
      {
        error ? <div className="text-white text-center"><p className="text-2xl my-4">{error}</p><p className="text-xl my-4">Redirecting to home...</p></div> : <></>
      }
    </div>
  );
}

export default Page;