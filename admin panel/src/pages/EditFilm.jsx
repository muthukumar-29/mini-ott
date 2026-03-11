import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditFilm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="edit-film-page">
      <div className="page-header">
        <h1 className="page-title">Edit Film #{id}</h1>
        <button className="btn-secondary" onClick={() => navigate('/films')}>
          ← Back to Films
        </button>
      </div>
      <div className="content-section">
        <p>Edit film form goes here (similar to AddFilm)</p>
      </div>
    </div>
  );
};

export default EditFilm;
