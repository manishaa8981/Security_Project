import { logger } from "../../utils/loggerUtils.js"; // Import the logger utility

const loggingMiddleware = (request, response, next) => {
  const startTime = Date.now();

  const originalSend = response.send;

  response.send = (body) => {
    const responseTime = Date.now() - startTime;

    const logData = {
      requestuestType: request.method,
      endpoint: request.originalUrl,
      // payload: request.body,
      responseTime,
      statusCode: response.statusCode,
      message: body,
    };

    if (response.statusCode >= 400) {
      logger.error('Error response', logData);
    } else {
      logger.info('Successful response', logData);
    }
    originalSend.call(response, body);
  };
  next();
};

export default loggingMiddleware;
