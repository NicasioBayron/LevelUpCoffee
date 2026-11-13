import React from "react";

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required = true,
  minLength,
  maxLength,
  ...props
}) {
  return (
    <label className="field">
      {label}
      <input
        className="form-control"
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        {...props}
      />
    </label>
  );
}