export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return "Email is required.";
  if (!emailRegex.test(email.trim())) return "Please enter a valid email address.";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter.";
  if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number.";
  if (!/(?=.*[@$!%*?&])/.test(password)) return "Password must contain at least one special character (@$!%*?&).";
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (!username.trim()) return "Username is required.";
  if (username.trim().length < 3) return "Username must be at least 3 characters long.";
  if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) return "Username can only contain letters, numbers, and underscores.";
  return null;
};
