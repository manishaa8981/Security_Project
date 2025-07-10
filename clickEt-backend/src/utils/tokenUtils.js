import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const decodeToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  return decoded;
};
export const getUserIdFromToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  return decoded.id;
};

export function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
