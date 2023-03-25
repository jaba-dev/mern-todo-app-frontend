import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Signup() {
  const [data, setData] = useState({
    username: "",
    password: "",
    confirm: "",
    error: "",
    success: "",
  });
  const navigate = useNavigate();
  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  async function signup() {
    try {
      const result = await fetch(
        "https://mern-todo-app-backend-wstm.onrender.com/api/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.username,
            password: data.password,
          }),
        }
      );
      setData({
        username: "",
        password: "",
        confirm: "",
        error: "",
        success: "",
      });
      if (result.ok) {
        localStorage.removeItem("userId");
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setData({
          username: "",
          password: "",
          confirm: "",
          success: "user registered successfully!",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
        resetData();
      }
      setData({
        username: "",
        password: "",
        confirm: "",
        error: "username or password is already used!",
      });
      resetData();
    } catch (error) {
      console.log(error.message);
    }
  }

  function resetData() {
    setTimeout(() => {
      setData({
        username: "",
        password: "",
        confirm: "",
        error: "",
        success: "",
      });
    }, 2000);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (data.username && data.password) {
      if (data.password === data.confirm) {
        signup();
      } else {
        setData({ ...data, error: "please fill neccessary fields" });
        resetData();
      }
    }
    if (data.password !== data.confirm && data.confirm) {
      setData({ ...data, error: "passwords don't match!" });
      resetData();
    }
  }
  return (
    <form className="signup-form" onSubmit={handleSubmit}>
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
      <label htmlFor="confirm">confirm password</label>
      <input
        id="confirm"
        type="text"
        name="confirm"
        value={data.confirm}
        placeholder="confirm password"
        onChange={handleChange}
      />
      {data.success && <p className="success-text">{data.success}</p>}
      {data.error && <p className="error-text">{data.error}</p>}
      <button type="submit">signup</button>
    </form>
  );
}

export default Signup;
