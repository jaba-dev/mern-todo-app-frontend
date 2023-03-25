import React from "react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/login">login</NavLink>
        </li>
        <li>
          <NavLink to="/signup">signup</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
