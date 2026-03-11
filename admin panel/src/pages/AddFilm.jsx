import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../services/categoryService";
import { createFilm } from "../services/filmService";
import { supabase } from "../config/supabase";

const MAX_DURATION = 60; // minutes
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

const AddFilm = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    duration_minutes: "",
    language: "",
    is_premium: false,
    video_url: "",
    thumbnail_url: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔥 Auto duration detection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Only video files are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("File size must be below 500MB");
      return;
    }

    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      const durationInMinutes = video.duration / 60;

      if (durationInMinutes > MAX_DURATION) {
        alert("Video must be less than 60 minutes");
        setVideoFile(null);
        return;
      }

      setVideoFile(file);
      setFormData((prev) => ({
        ...prev,
        duration_minutes: Math.ceil(durationInMinutes),
      }));
    };
  };

  const uploadToSupabase = async (file, folder) => {
    const fileName = `${folder}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("shortfilms")
      .upload(fileName, file);

    if (error) {
      console.log("SUPABASE ERROR:", error);
      throw error;
    }

    const { data } = supabase.storage
      .from("shortfilms")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      alert("Please upload video file");
      return;
    }

    try {
      setLoading(true);
      setUploading(true);

      const videoUrl = await uploadToSupabase(videoFile, "videos");

      let thumbnailUrl = "";
      if (thumbnailFile) {
        thumbnailUrl = await uploadToSupabase(
          thumbnailFile,
          "thumbnails"
        );
      }

      const payload = {
        ...formData,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
      };

      await createFilm(payload);

      alert("Film added successfully!");
      navigate("/films");
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="container mt-4 text-light">
      <h3>Add New Film</h3>

      <form onSubmit={handleSubmit} className="mt-4">

        <div className="mb-3">
          <label>Title *</label>
          <input
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Category *</label>
          <select
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Description *</label>
          <textarea
            name="description"
            className="form-control"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Duration (Auto Calculated)</label>
          <input
            type="number"
            name="duration_minutes"
            className="form-control"
            value={formData.duration_minutes}
            disabled
          />
        </div>

        <div className="mb-3">
          <label>Language</label>
          <input
            name="language"
            className="form-control"
            value={formData.language}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Upload Video *</label>
          <input
            type="file"
            accept="video/*"
            className="form-control"
            onChange={handleVideoChange}
          />
          <small className="text-muted">
            Max duration: 60 mins | Max size: 500MB
          </small>
        </div>

        <div className="mb-3">
          <label>Upload Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
          />
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="is_premium"
            checked={formData.is_premium}
            onChange={handleChange}
          />
          <label className="form-check-label">
            Premium Content
          </label>
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {uploading ? "Uploading..." : "Add Film"}
        </button>
      </form>
    </div>
  );
};

export default AddFilm;