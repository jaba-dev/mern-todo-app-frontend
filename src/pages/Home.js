import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import Logout from "../components/Logout";

function Home({ setIsLoggedIn, isLoggedIn }) {
  const cookie = document.cookie.split("; ");
  const [todos, setTodos] = useState([]);
  const [userName, setUserName] = useState("");
  const [token, setToken] = useState("");
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [infoText, setInfoText] = useState("");
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("userId"));
  useEffect(() => {
    if (userId) {
      const tk = cookie.find((row) => row.startsWith("token=")).split("=")[1];
      setToken(tk);
    }
  });

  useEffect(() => {
    getTodos();
  }, [token]);

  async function getTodos() {
    if (token && userId) {
      const result = await fetch(
        `https://mern-todo-app-backend-wstm.onrender.com/api/users/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await result.json();
      if (data) {
        setTodos(data.todos);
        setUserName(data.username);
        setIsLoggedIn(true);
      }
    }
  }

  function AddTodo() {
    const [newTodo, setNewTodo] = useState("");
    async function addNewTodo() {
      setInfoText("processing...");
      try {
        const result = await fetch(
          `https://mern-todo-app-backend-wstm.onrender.com/api/users/${userId}/todos`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              todo: `${newTodo}`,
            }),
          }
        );
        const data = await result.json();
        setTodos(data.todos);
        setNewTodo("");
        setInfoText("");
        setSuccessText("todo added successfully");
        reset();
      } catch (err) {
        setErrorText("something went wrong");
        reset();
      }
    }

    function reset() {
      setTimeout(() => {
        setErrorText("");
        setSuccessText("");
        setInfoText("");
      }, 2000);
    }

    function handleChange(e) {
      setNewTodo(e.target.value);
    }
    function handleSubmit(e) {
      e.preventDefault();
      if (newTodo) {
        addNewTodo();
      } else {
        setErrorText("please enter something!");
        reset();
      }
    }

    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="new-todo">new todo</label>
          <input
            id="new-todo"
            type="text"
            value={newTodo}
            placeholder="new todo"
            onChange={handleChange}
          />
          {errorText && <p className="error-text">{errorText}</p>}
          {successText && <p className="success-text">{successText}</p>}
          {infoText && <p className="info-text">{infoText}</p>}
          <button className="add-btn">add todo</button>
        </form>
      </div>
    );
  }

  async function updateTodo(todoId) {
    try {
      await fetch(
        `https://mern-todo-app-backend-wstm.onrender.com/api/users/${userId}/todos/${todoId}/edit`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error.message);
      navigate("/somethingwentwrong");
    }
  }

  async function deleteTodo(todoId) {
    try {
      const result = await fetch(
        `https://mern-todo-app-backend-wstm.onrender.com/api/users/${userId}/todos/${todoId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await result.json();
      setTodos(data.todos);
    } catch (err) {
      navigate("/somethingwentwrong");
    }
  }

  function updateUI(id, action) {
    if (action === "update") {
      const newTodos = todos;
      newTodos.forEach((item) => {
        if (item.id === id) {
          item.completed = !item.completed;
        }
      });
      setTodos([...newTodos]);
    } else if (action === "delete") {
      const newTodos = todos.filter((item) => item.id !== id);
      setTodos([...newTodos]);
    }
  }

  return (
    <div>
      {isLoggedIn && window.innerWidth > 800 ? (
        <Logout token={token} setIsLoggedIn={setIsLoggedIn} />
      ) : (
        ""
      )}
      {isLoggedIn && <h2>{userName ? `Welcome ${userName}!` : ""}</h2>}
      {isLoggedIn && <AddTodo />}
      {isLoggedIn && todos.length ? (
        <div className="todo-container">
          {isLoggedIn &&
            todos.map((item) => {
              return (
                <div
                  className={item.completed ? "completed" : ""}
                  key={item.id}
                >
                  <span>
                    {item.todo} {item.completed ? "done" : ""}
                  </span>
                  <FaCheck
                    className="check"
                    onClick={() => {
                      updateUI(item.id, "update");
                      updateTodo(item.id);
                    }}
                  />
                  <FaTrash
                    className="trash"
                    onClick={() => {
                      updateUI(item.id, "delete");
                      deleteTodo(item.id);
                    }}
                  />
                </div>
              );
            })}
        </div>
      ) : isLoggedIn === true ? (
        <p className="no-todos">no todos to display.</p>
      ) : (
        ""
      )}
    </div>
  );
}

export default Home;
