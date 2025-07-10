// src/middleware/auth/routeProtection.js
import jwt from "jsonwebtoken";

export const protectRoute = (allowedRoles = []) => {
  return (request, response, next) => {
    const token = request.cookies.access_token;
    if (!token) {
      return response.status(401).json({ message: "Authorization token is missing" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      request.user = decoded; // Attach the decoded user info to the request object
      if (allowedRoles.length > 0 && !allowedRoles.includes(request.user.role)) {
        return response.status(403).json({ message: "You do not have permission to access this resource" });
      }
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return response.status(401).json({ message: "Token has expired, please log in again" });
      }
      console.error(`JWT Error: ${error.message}`);
      return response.status(401).json({ message: "Invalid or expired token" });
    }
  };
};