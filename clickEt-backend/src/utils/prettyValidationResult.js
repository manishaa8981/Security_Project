// src/utils/prettyValidationResult.js
import { validationResult } from "express-validator";

export async function commonlyUsedValidationResult(request, response, next) {
  const errors = validationResult(request);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors
      .array()
      .map((error) => ({ field: error.path, message: error.msg }));
    return response.status(400).json({ errors: formattedErrors });
  }
  next();
}
