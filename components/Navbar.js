import Link from 'next/link';
import Image from 'next/image';

const logOut = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('id');
  window.location.reload();
}

const Navbar = ({ loggedIn }) => {
  return (
    <nav className="text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-semibold">
          <Image src="/logo.png" alt="EduAble" width={100} height={100} />
        </div>
        <ul className="flex space-x-4">
          <li><Link href="/">Home</Link></li>
          {
            loggedIn ? <li><button onClick={logOut}>Logout</button></li> : <>
              <li><Link href="/register">Register</Link></li>
              <li><Link href="/login">Login</Link></li>
            </>
          }
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;