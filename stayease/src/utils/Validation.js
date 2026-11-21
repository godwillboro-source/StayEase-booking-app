export function validateRequired(value, fieldName) {
  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  ) {
    return `${fieldName} is required.`;
  }

  return "";
}

export function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return pattern.test(String(email).trim());
}

export function validatePassword(password) {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must contain at least 8 characters.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }

  if (!/[^A-Za-z0-9\s]/.test(password)) {
    return "Password must contain at least one symbol.";
  }

  return "";
}

export function validatePositiveNumber(value, fieldName) {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    return `${fieldName} must be greater than zero.`;
  }

  return "";
}

export function validateStay(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return "Please select both check-in and check-out dates.";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Please select valid dates.";
  }

  if (start < today) {
    return "Check-in cannot be in the past.";
  }

  if (end <= start) {
    return "Check-out must be after check-in.";
  }

  return "";
}