export function validatePasswordPolicy(password) {
  const errors = [];

  if (password.length < 12) {
    errors.push("Password must be at least 12 characters long.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one digit.");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*).");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
