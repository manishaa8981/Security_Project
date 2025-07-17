import { logger } from "../../utils/loggerUtils.js";

const loggingMiddleware = (request, response, next) => {
  const user = request.user; // ✅ this is the safe way to get the user

  // 🔐 Optional: Check password expiry only if user is authenticated
  if (user?.password_last_changed) {
    const daysSinceChange =
      (Date.now() - new Date(user.password_last_changed)) /
      (1000 * 60 * 60 * 24);
    if (daysSinceChange > 90) {
      return response.status(403).json({
        message: "Password expired. Please reset your password.",
      });
    }
  }

  const startTime = Date.now();
  const originalSend = response.send;

  response.send = (body) => {
    const responseTime = Date.now() - startTime;

    const logData = {
      requestType: request.method,
      endpoint: request.originalUrl,
      responseTime,
      statusCode: response.statusCode,
      message: body,
    };

    if (response.statusCode >= 400) {
      logger.error("Error response", logData);
    } else {
      logger.info("Successful response", logData);
    }

    originalSend.call(response, body);
  };

  next();
};

export default loggingMiddleware;
