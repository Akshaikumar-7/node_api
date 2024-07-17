import React, { useEffect, useState } from "react";

const Todo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const [edittitle, setEditTitle] = useState("");
  const [editdescription, setEditDescription] = useState("");
  const apiurl = "http://localhost:3000";

  //create
  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiurl + "/todos", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { title, description }]);
            setTitle("");
            setDescription("");
            setMessage("Item added Successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            setError("Unable to create Todo Item");
            setTimeout(() => {
              setError("");
            }, 3000);
          }
        })
        .catch(() => {
          setError("Unable to create Todo Item");
          setTimeout(() => {
            setError("");
          }, 3000);
        });
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  //list
  const getItems = () => {
    fetch(apiurl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      })
      .catch();
  };

  //edit and update
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };
  const handleUpdate = () => {
    setError("");
    if (edittitle.trim() !== "" && editdescription.trim() !== "") {
      fetch(apiurl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title: edittitle,
          description: editdescription,
        }),
      })
        .then((res) => {
          if (res.ok) {
            const updatedTodos = todos.map((item) => {
              if (item._id == editId) {
                item.title = edittitle;
                item.description = editdescription;
              }
              return item;
            });
            setTodos(updatedTodos);
            setTitle("");
            setDescription("");
            setMessage("Item Updated Successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);

            setEditId(-1);
          } else {
            setError("Unable to Update Todo Item");
            setTimeout(() => {
              setError("");
            }, 3000);
          }
        })
        .catch(() => {
          setError("Unable to Update Todo Item");
          setTimeout(() => {
            setError("");
          }, 3000);
        });
    }
  };

  //delet
  const handleDelete = (id) => {
    if (window.confirm("Are you sure want to delete?")) {
      fetch(apiurl + "/todos/" + id, {
        method: "DELETE",
      }).then(() => {
        const deletedTodos = todos.filter((item) => item._id !== id);
        setTodos(deletedTodos);
      });
    }
  };
  const handleEditCancel = () => {
    setEditId(-1);
  };

  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>Todo Project with MERN stack</h1>
      </div>
      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
      <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="col-md-6">
          {" "}
          <ul className="list-group">
            {todos.map((item) => (
              <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                <div className="d-flex flex-column">
                  {editId == -1 || editId !== item._id ? (
                    <>
                      <span className="fw-bold">{item.title}</span>
                      <span className="">{item.description}</span>
                    </>
                  ) : (
                    <>
                      {" "}
                      <div className="form-group d-flex gap-2">
                        <input
                          type="text"
                          className="form-control"
                          value={edittitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          className="form-control"
                          value={editdescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Description"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="d-flex gap-2">
                  {editId == -1 || editId !== item._id ? (
                    <button
                      className="btn btn-success"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                  ) : (
                    <button className="btn btn-warning" onClick={handleUpdate}>
                      Update
                    </button>
                  )}
                  {editId == -1 ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  ) : (
                    <button className="btn btn-dark" onClick={handleEditCancel}>
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Todo;
