import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllFilms, deleteFilm } from "../services/filmService";
import "./styles/Films.css";

const Films = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      setLoading(true);
      const res = await getAllFilms();
      setFilms(res.data);
    } catch (error) {
      console.error("Error fetching films:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/films/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this film?")) return;

    try {
      await deleteFilm(id);
      setFilms(films.filter((film) => film.id !== id));
      alert("Film deleted successfully");
    } catch (error) {
      console.error("Error deleting film:", error);
      alert("Failed to delete film");
    }
  };

  const filteredFilms = films.filter((film) => {
    const matchesSearch = film.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || film.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    if (status === "APPROVED") return "badge-success";
    if (status === "PENDING") return "badge-warning";
    return "badge-danger";
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-light"></div>
      </div>
    );
  }

  return (
    <div className="films-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Short Films</h1>
          <p className="page-subtitle">Manage your short film library</p>
        </div>
        <button
          className="btn-primary-custom"
          onClick={() => navigate("/films/add")}
        >
          + Add New Film
        </button>
      </div>

      <div className="filters-section">
        <input
          type="text"
          className="search-input-large"
          placeholder="Search films..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="APPROVED">Approved</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="content-section">
        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Film</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Views</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredFilms.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    No films found
                  </td>
                </tr>
              ) : (
                filteredFilms.map((film) => (
                  <tr key={film.id}>
                    <td>
                      <div className="film-info">
                        <img
                          src={
                            film.thumbnail_url ||
                            "https://via.placeholder.com/80x120"
                          }
                          alt={film.title}
                          className="film-thumbnail"
                        />
                        <div className="film-details">
                          <h6>{film.title}</h6>
                        </div>
                      </div>
                    </td>

                    <td>{film.category?.name || "-"}</td>

                    <td>{film.duration_minutes} min</td>

                    <td>
                      <span
                        className={`badge-custom ${getStatusBadge(
                          film.status
                        )}`}
                      >
                        {film.status}
                      </span>
                    </td>

                    <td>{film.views}</td>

                    <td>
                      {new Date(film.created_at).toLocaleDateString()}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleEdit(film.id)}
                        >
                          ✏️
                        </button>

                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(film.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Films;