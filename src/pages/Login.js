import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login({ setIsLoggedIn }) {
  const [data, setData] = useState({
    username: "",
    password: "",
    error: "",
    success: "",
  });
  const navigate = useNavigate();
  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  async function login() {
    try {
      const result = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });
      if (result.ok && result.status >= 200 && result.status < 400) {
        const user = await result.json();
        localStorage.setItem("userId", JSON.stringify(user.user._id));
        document.cookie = `token=${user.token}`;
        setData({
          ...data,
          success: "user logged in successfully!",
        });
        setIsLoggedIn(true);
        setTimeout(() => {
          navigate("/");
        }, 1500);
        reset();
      } else {
        setData({ ...data, error: "username or password incorrect!" });
        reset();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  function reset() {
    setTimeout(() => {
      setData({
        username: "",
        password: "",
        error: "",
        success: "",
      });
    }, 2000);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (data.username && data.password) {
      login();
    } else {
      setData({ ...data, error: "please fill neccessary fields" });
      reset();
    }
  }
  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label htmlFor="username">username</label>
      <input
        id="username"
        type="text"
        name="username"
        value={data.username}
        placeholder="your name"
        onChange={handleChange}
      />
      <label htmlFor="password">password</label>
      <input
        id="password"
        type="text"
        name="password"
        value={data.password}
        placeholder="your password"
        onChange={handleChange}
      />
      {data.success && <p className="success-text">{data.success}</p>}
      {data.error && <p className="error-text">{data.error}</p>}
      <button type="submit">login</button>
    </form>
  );
}

export default Login;
