import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: {
    message:
      "Too many login attempts from this IP, please try again after 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 registration requests per windowMs
  message: {
    message:
      "Too many registration attempts from this IP, please try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
