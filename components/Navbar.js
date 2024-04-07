'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes'

const logOut = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('id');
  window.location.reload();
}

const ThemeToggle = () => {

  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col justify-center ml-3 items-center">
      <div className="relative cursor-pointer p-2 bg-blue-700 rounded-md" onClick={() => {
          if (theme === 'dark') {
            return setTheme('light')
          }
          return setTheme('dark')
        }} >
        <svg className="dark:hidden" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <path
            className="fill-slate-300"
            d="M7 0h2v2H7zM12.88 1.637l1.414 1.415-1.415 1.413-1.413-1.414zM14 7h2v2h-2zM12.95 14.433l-1.414-1.413 1.413-1.415 1.415 1.414zM7 14h2v2H7zM2.98 14.364l-1.413-1.415 1.414-1.414 1.414 1.415zM0 7h2v2H0zM3.05 1.706 4.463 3.12 3.05 4.535 1.636 3.12z"
          />
          <path className="fill-slate-400" d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z" />
        </svg>
        <svg className="hidden dark:block" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <path className="fill-slate-400" d="M6.2 1C3.2 1.8 1 4.6 1 7.9 1 11.8 4.2 15 8.1 15c3.3 0 6-2.2 6.9-5.2C9.7 11.2 4.8 6.3 6.2 1Z" />
          <path
            className="fill-slate-500"
            d="M12.5 5a.625.625 0 0 1-.625-.625 1.252 1.252 0 0 0-1.25-1.25.625.625 0 1 1 0-1.25 1.252 1.252 0 0 0 1.25-1.25.625.625 0 1 1 1.25 0c.001.69.56 1.249 1.25 1.25a.625.625 0 1 1 0 1.25c-.69.001-1.249.56-1.25 1.25A.625.625 0 0 1 12.5 5Z"
          />
        </svg>
        <span className="sr-only">Switch to light / dark version</span>
      </div>
    </div>
  )
}

const Navbar = ({ loggedIn }) => {
  return (
    <nav className="text-blue-700 dark:text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-semibold">
          <Image src="/logo.png" alt="EduAble" width={100} height={100} />
        </div>
        <ul className="flex space-x-4 items-center">
          <li><Link href="/">Home</Link></li>
          {
            loggedIn ? <li><button onClick={logOut}>Logout</button></li> : <>
              <li><Link href="/register">Register</Link></li>
              <li><Link href="/login">Login</Link></li>
            </>
          }
          <li><ThemeToggle /></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;