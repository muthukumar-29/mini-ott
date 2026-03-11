import React, { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

import Swal from "sweetalert2";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ⭐ FETCH DATA WITH LOADER
  const fetchCategories = async () => {
    try {
      setPageLoading(true);

      const res = await getCategories();

      if (res && res.data) {
        setCategories(res.data);
      }

    } catch (error) {
      Swal.fire("Error", "Failed to load categories", "error");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setName("");
    setImage(null);
    setPreview(null);
    setEditingId(null);
  };

  const openEditModal = (category) => {
    setName(category.name);
    setEditingId(category.id);
    setPreview(category.image || null);
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ⭐ SAVE CATEGORY
  const handleSave = async () => {
    if (!name.trim()) {
      Swal.fire("Warning", "Category name is required", "warning");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", name);

      if (image) {
        formData.append("image", image);
      }

      let response;

      if (editingId) {
        response = await updateCategory(editingId, formData);
      } else {
        response = await createCategory(formData);
      }

      // ✅ SUCCESS CHECK
      if (response?.status === 200 || response?.status === 201) {
        Swal.fire(
          "Success",
          editingId ? "Category updated" : "Category created",
          "success"
        );

        fetchCategories();

        document.getElementById("closeCategoryModal").click();
      }

    } catch (error) {
      console.error(error);

      Swal.fire(
        "Error",
        error?.response?.data?.detail ||
        "Something went wrong. Try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // ⭐ DELETE CATEGORY
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Category?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteCategory(id);

      Swal.fire("Deleted", "Category removed", "success");

      fetchCategories();

    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  return (
    <div className="container mt-4 text-light">

      {/* HEADER */}
      <div className="d-flex justify-content-between mb-3">
        <h3>Categories</h3>

        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#categoryModal"
          onClick={openAddModal}
        >
          Add Category
        </button>
      </div>

      {/* ⭐ PAGE LOADER */}
      {pageLoading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-light"></div>
          <p className="mt-3">Loading categories...</p>
        </div>
      ) : (

        /* TABLE */
        <table className="table table-dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No categories available
                </td>
              </tr>
            ) : (
              categories.map((cat, index) => (
                <tr key={cat.id}>
                  <td>{index + 1}</td>

                  <td>
                    {cat.image && (
                      <img
                        src={cat.image}
                        alt="cat"
                        width="60"
                        height="40"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </td>

                  <td>{cat.name}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#categoryModal"
                      onClick={() => openEditModal(cat)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(cat.id)}
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

      {/* MODAL */}
      <div className="modal fade" id="categoryModal">
        <div className="modal-dialog">
          <div className="modal-content bg-dark text-light">

            <div className="modal-header">
              <h5>{editingId ? "Edit Category" : "Add Category"}</h5>

              <button
                type="button"
                id="closeCategoryModal"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <label>Name</label>
              <input
                className="form-control mb-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label>Image</label>
              <input
                type="file"
                className="form-control"
                onChange={handleImageChange}
              />

              {preview && (
                <img src={preview} alt="preview" className="mt-3" width="120" />
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
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

export default Categories;
