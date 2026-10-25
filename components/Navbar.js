import Link from "next/link";
import { signOut } from "next-auth/react";

const Navbar = () => {
  function logoutHandler() {
    signOut();
  }

  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
      <Link href="/">Swifty Dashboard</Link>
      <div className="collpase navbar-collapse">
        <li>
          <button onClick={logoutHandler}>Logout</button>
        </li>
      </div>
    </nav>
  );
};

export default Navbar;
