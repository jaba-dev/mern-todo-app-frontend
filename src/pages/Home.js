import React from "react";
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
      const result = await fetch(`http://localhost:8080/api/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
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
      try {
        const result = await fetch(
          `http://localhost:8080/api/users/${userId}/todos`,
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
      } catch (err) {}
    }

    function reset() {
      setTimeout(() => {
        setErrorText("");
        setSuccessText("");
      }, 2000);
    }

    function handleChange(e) {
      setNewTodo(e.target.value);
    }
    function handleSubmit(e) {
      e.preventDefault();
      if (newTodo) {
        addNewTodo();
        setSuccessText("todo added successfully");
        reset();
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
          <p className={errorText ? "error-text" : "success-text"}>
            {errorText ? errorText : successText}
          </p>
          <button className="add-btn">add todo</button>
        </form>
      </div>
    );
  }

  async function updateTodo(todoId) {
    try {
      const result = await fetch(
        `http://localhost:8080/api/users/${userId}/todos/${todoId}/edit`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await result.json();
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteTodo(todoId) {
    try {
      const result = await fetch(
        `http://localhost:8080/api/users/${userId}/todos/${todoId}`,
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
      console.log("something went wrong", err);
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
      ) : null}
      {isLoggedIn && <h2>{userName ? `Welcome ${userName}!` : null}</h2>}
      {isLoggedIn && <AddTodo />}
      {isLoggedIn && todos.length > 0 ? (
        <div className="todo-container">
          {isLoggedIn &&
            todos.map((item) => {
              return (
                <div
                  className={item.completed ? "completed" : null}
                  key={item.id}
                >
                  <span>
                    {item.todo} {item.completed ? "done" : null}
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
      ) : null}
    </div>
  );
}

export default Home;
