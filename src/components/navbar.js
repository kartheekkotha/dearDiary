import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthProvider, useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  console.log(user);
  const handleLogout = async () => {
    await logout();
    router.push("/"); // Redirect to the home page after logout
  };
  return (
    <nav className="navbar navbar-expand-lg navbar navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" href="/">
          Dear Me
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" href="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/allblogs">
                Quotes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/aboutUs">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/contact">
                Contact
              </Link>
            </li>
          </ul>
          {user ? (
            <div className="dropdown">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Welcome {user.displayName}
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <Link
                        className="dropdown-item"
                        href={`/diary/${user.uid}`}
                      >
                        Diary
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        href={`/blogs/${user.uid}`}
                      >
                        Write Quote
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href={`/bot/${user.uid}`}>
                      Chat Bot
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" href="/login">
                  Login
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
