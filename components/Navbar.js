import Link from "next/link";
import { useSession, signOut } from "next-auth/client";

const Navbar = () => {
  const [session, loading] = useSession();

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
