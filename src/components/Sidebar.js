import React from "react";
import { NavLink } from "react-router-dom";
import { MdClose } from "react-icons/md";
import Logout from "./Logout";

function Sidebar({ handleMenuToggle, setIsLoggedIn, isLoggedIn }) {
  return (
    <nav className="sidebar">
      <ul>
        {!isLoggedIn && (
          <li>
            <NavLink onClick={handleMenuToggle} to="/">
              Home
            </NavLink>
          </li>
        )}
        {!isLoggedIn && (
          <li>
            <NavLink onClick={handleMenuToggle} to="/login">
              login
            </NavLink>
          </li>
        )}
        {!isLoggedIn && (
          <li>
            <NavLink onClick={handleMenuToggle} to="/signup">
              signup
            </NavLink>
          </li>
        )}

        {isLoggedIn && <li>{<Logout setIsLoggedIn={setIsLoggedIn} />}</li>}
      </ul>
      <MdClose onClick={handleMenuToggle} className="exit-icon" />
    </nav>
  );
}

export default Sidebar;
