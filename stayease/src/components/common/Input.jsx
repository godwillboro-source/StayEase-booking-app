import React, { useState } from "react";

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  error = "",
  min,
  max,
  step,
  minLength,
  autoComplete,
  className = ""
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputType = type === "password" && passwordVisible ? "text" : type;
  const input = (
    <input
      id={name}
      name={name}
      type={inputType}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      minLength={minLength}
      autoComplete={autoComplete}
      className={`form-input ${error ? "input-error" : ""}`}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${name}-error` : undefined}
    />
  );

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required-mark"> *</span>}
        </label>
      )}

      {type === "password" ? (
        <div className="password-input-wrapper">
          {input}
          <button
            type="button"
            className="password-toggle"
            aria-label={passwordVisible ? "Hide password" : "Show password"}
            aria-controls={name}
            aria-pressed={passwordVisible}
            onClick={() => setPasswordVisible((visible) => !visible)}
          >
            {passwordVisible ? "Hide" : "Show"}
          </button>
        </div>
      ) : (
        input
      )}

      {error && (
        <small id={`${name}-error`} className="field-error">
          {error}
        </small>
      )}
    </div>
  );
}

export default Input;