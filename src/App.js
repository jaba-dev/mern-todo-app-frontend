import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

function App() {
  function MenuIcon() {
    return (
      <svg
        onClick={handleMenuToggle}
        className="menu-icon"
        viewBox="0 0 24 24"
        width="40"
        height="40"
      >
        <path
          fill="currentColor"
          d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"
        />
      </svg>
    );
  }
  function handleMenuToggle() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("show-sidebar");
  }
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  window.addEventListener("resize", handleResize);

  return (
    <>
      {windowWidth < 800 ? (
        <Sidebar
          handleMenuToggle={handleMenuToggle}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
      ) : null}
      <header>
        {!isLoggedIn && windowWidth > 800 ? <Navbar /> : null}
        <h1>Todo App</h1>
        {windowWidth < 800 ? <MenuIcon /> : null}
      </header>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
