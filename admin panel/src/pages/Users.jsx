import React, { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("CREATOR");
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setPageLoading(true);
      const res = await getUsers();
      console.log(res.data);
      
      setUsers(res.data);
    } catch (err) {
      console.log("Fetch users error", err);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setUsername("");
    setEmail("");
    setRole("CREATOR");
    setEditingId(null);
  };

  const openEditModal = (user) => {
    setUsername(user.username);
    setEmail(user.email);
    setRole(user.role_display);
    setEditingId(user.id);
  };

  const handleSave = async () => {
    if (!username || !email) return;

    const payload = {
      username,
      email,
      role,
      is_active: true,
      password: "123456", // temporary default
    };

    try {
      setSaving(true);

      if (editingId) {
        await updateUser(editingId, payload);
      } else {
        await createUser(payload);
      }

      fetchUsers();
      document.getElementById("closeUserModal").click();

    } catch (err) {
      console.log("Save error", err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;

    try {
      await deleteUser(id);
      fetchUsers();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="container mt-4 text-light">
      <div className="d-flex justify-content-between mb-3">
        <h3>Users</h3>

        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#userModal"
          onClick={openAddModal}
        >
          Add User
        </button>
      </div>

      {pageLoading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-light"></div>
          <p className="mt-3">Loading users...</p>
        </div>
      ) : (
        <table className="table table-dark table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u, index) => (
                <tr key={u.id}>
                  <td>{index + 1}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role_display}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#userModal"
                      onClick={() => openEditModal(u)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Modal */}
      <div className="modal fade" id="userModal">
        <div className="modal-dialog">
          <div className="modal-content bg-dark text-light">
            <div className="modal-header">
              <h5>{editingId ? "Edit User" : "Add User"}</h5>
              <button
                id="closeUserModal"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <label>Username</label>
              <input
                className="form-control mb-3"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <label>Email</label>
              <input
                className="form-control mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label>Role</label>
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="CREATOR">CREATOR</option>
                <option value="VIEWER">VIEWER</option>
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>

              <button className="btn btn-primary" onClick={handleSave}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;