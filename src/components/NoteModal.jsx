import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import FormField from './FormField';
import * as Yup from 'yup';

const NoteModal = ({ note, onSave, onClose }) => {
  const [tagInput, setTagInput] = useState('');

  const initialValues = {
    title: note?.title || '',
    content: note?.content || '',
    tags: note?.tags || []
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    await onSave(values);
    setSubmitting(false);
  };

  const handleAddTag = (e, arrayHelpers, values) => {
    e.preventDefault();
    const tag = tagInput.trim().toLowerCase();
    if (tag && !values.tags.includes(tag) && values.tags.length < 10) {
      arrayHelpers.push(tag);
      setTagInput('');
    }
  };

  const handleKeyPress = (e, arrayHelpers, values) => {
    if (e.key === 'Enter') {
      handleAddTag(e, arrayHelpers, values);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{note ? 'Edit Note' : 'Create New Note'}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object({
            title:Yup.string().required('Title is required'),
            content:Yup.string().required('Content is required'),
            tags:Yup.array().of(Yup.string().max(20, 'Tag is too long')).max(10, 'Maximum 10 tags allowed')
          })}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values }) => (
            <Form className="note-form">
              <FormField
                label="Title"
                name="title"
                type="text"
                placeholder="Enter note title"
              />

              <FormField
                label="Content"
                name="content"
                as="textarea"
                rows="10"
                placeholder="Write your note content here..."
              />

              <div className="form-group">
                <label>Tags</label>
                <FieldArray name="tags">
                  {(arrayHelpers) => (
                    <>
                      <div className="tags-input-container">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, arrayHelpers, values)}
                          placeholder="Add a tag and press Enter"
                          maxLength="20"
                          className="form-input"
                        />
                        <button
                          type="button"
                          onClick={(e) => handleAddTag(e, arrayHelpers, values)}
                          className="add-tag-btn"
                          disabled={values.tags.length >= 10}
                        >
                          Add Tag
                        </button>
                      </div>

                      {values.tags.length > 0 && (
                        <div className="tags-display">
                          {values.tags.map((tag, index) => (
                            <span key={index} className="tag editable">
                              {tag}
                              <button
                                type="button"
                                onClick={() => arrayHelpers.remove(index)}
                                className="remove-tag-btn"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <ErrorMessage name="tags" component="div" className="field-error" />
                    </>
                  )}
                </FieldArray>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={onClose} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default NoteModal;
