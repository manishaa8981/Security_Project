export function checkAndFormatDate(request, response, next) {
    if (request.body.releaseDate) {
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
  
      if (isoDateRegex.test(request.body.releaseDate)) {
        // Convert ISO 8601 to common format (e.g., "YYYY-MM-DD")
        const parsedDate = new Date(request.body.releaseDate);
        request.body.releaseDate = parsedDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
      }
    }
  
    // Proceed to the next middleware
    next();
  }