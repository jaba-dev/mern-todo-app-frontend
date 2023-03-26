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
          ...data,
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
      setData({ ...data, error: "something went wrong" });
      resetData();
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

  function validate(name, password) {
    if (name.length < 5) {
      setData({
        ...data,
        error: "username must containe at least 5 characters",
      });
      resetData();
    }
    const passwordPattern = /^[\d\w@-]{8,20}$/i;
    let isValidPassword = passwordPattern.test(password);
    if (!isValidPassword) {
      setData({
        ...data,
        error:
          "Password must alphanumeric (@, _ and - are also allowed) and be 8 - 20 characters",
      });
    }
    return isValidPassword;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (data.username && data.password) {
      if (data.password === data.confirm) {
        let isValid = validate(data.username, data.password);
        if (isValid) {
          signup();
        }
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
        placeholder="username"
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
