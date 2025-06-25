import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notesAPI } from '../services/api';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import Header from '../components/Header';
import { toast } from 'react-toastify';


const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [selectedTag, setSelectedTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, selectedTag, searchTerm]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await notesAPI.getNotes();
      setNotes(response.data.notes);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch notes';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Fetch notes error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotes = () => {
    let filtered = notes;

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(note => 
        note.tags.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase()))
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotes(filtered);
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowModal(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowModal(true);
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesAPI.deleteNote(noteId);
        setNotes(notes.filter(note => note._id !== noteId));
        toast.success('Note deleted successfully!');
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete note';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Delete note error:', error);
      }
    }
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
     await notesAPI.updateNote(editingNote._id, noteData);
       
       await fetchNotes();
        toast.success('Note updated successfully!');
      } else {
        const response = await notesAPI.createNote(noteData);
        console.log(response)
        await fetchNotes()
        toast.success('Note created successfully!');
      }
      setShowModal(false);
      setEditingNote(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to save note';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Save note error:', error);
    }
  };

  const getAllTags = () => {
    const allTags = notes?.flatMap(note => note.tags);
    return [...new Set(allTags)].sort();
  };

  

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header 
        user={user}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateNote={handleCreateNote}
      />
      
      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        
        <div className="filters">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="tag-filter"
          >
            <option value="">All Tags</option>
            {getAllTags()?.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>

         
        </div>

        <div className="notes-grid">
          {filteredNotes.length === 0 ? (
            <div className="no-notes">
              <p>No notes found. Create your first note!</p>
              <button onClick={handleCreateNote} className="create-note-btn">
                Create Note
              </button>
            </div>
          ) : (
            filteredNotes.map(note => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            ))
          )}
        </div>
      </div>

      {showModal && (
        <NoteModal
          note={editingNote}
          onSave={handleSaveNote}
          onClose={() => {
            setShowModal(false);
            setEditingNote(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
