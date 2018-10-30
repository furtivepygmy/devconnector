import React from 'react';
import PropTypes from 'prop-types';

const SelectListGroup = ({
  name,
  value,
  error,
  info,
  onChange,
  options,
  placeholderOption
}) => {
  return (
    <div className="form-group">
      <select
        className={`form-control form-control-lg ${error && 'is-invalid'}`}
        name={name}
        value={value}
        onChange={onChange}
      >
        {<option hidden>{placeholderOption}</option>}
        {options.map(option => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

SelectListGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  options: PropTypes.array.isRequired,
  placeholderOption: PropTypes.string.isRequired
};

export default SelectListGroup;
