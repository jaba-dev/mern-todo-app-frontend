function Logout({ setIsLoggedIn }) {
  function logout() {
    document.cookie = `token=token; expires=Thu, 18 Dec 2013 12:00:00 UTC;`;
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
  }
  return (
    <button
      className={
        window.innerWidth >= 800 ? "log-out-btn" : "log-out-btn-responsive"
      }
      onClick={logout}
    >
      Logout
    </button>
  );
}

export default Logout;
