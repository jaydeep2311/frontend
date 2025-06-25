import React from 'react';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content &&content.length <= maxLength) return content;
    return content?.substring(0, maxLength) + '...';
  };

  return (
    <div className="note-card">
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions">
          <button 
            onClick={() => onEdit(note)} 
            className="edit-btn"
            title="Edit note"
          >
            ✏️
          </button>
          <button 
            onClick={() => onDelete(note._id)} 
            className="delete-btn"
            title="Delete note"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="note-content">
        <p>{truncateContent(note.content)}</p>
      </div>
      
      {note.tags && note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="note-footer">
        <span className="note-date">
          {formatDate(note.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default NoteCard;
