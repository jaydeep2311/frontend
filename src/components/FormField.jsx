import React from 'react';
import { Field, ErrorMessage, useField } from 'formik';

const FormField = ({ label, name, type = 'text', placeholder, as, rows, ...props }) => {
  const [, meta] = useField(name);
  
  const getFieldClass = () => {
    let className = 'form-input';
    if (meta.touched) {
      if (meta.error) {
        className += ' is-invalid';
      } else {
        className += ' is-valid';
      }
    }
    return className;
  };

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <Field
        id={name}
        name={name}
        type={type}
        as={as}
        rows={rows}
        placeholder={placeholder}
        className={getFieldClass()}
        {...props}
      />
      <ErrorMessage name={name} component="div" className="field-error" />
    </div>
  );
};

export default FormField;
