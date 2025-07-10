import { body, query, param } from "express-validator";

export const screeningValidation = {
  add: [
    body("movieId")
      .isMongoId()
      .withMessage("Invalid movie ID"),
    
    body("distributorId")
      .isMongoId()
      .withMessage("Invalid distributor ID"),
    
    body("theatreId")
      .isMongoId()
      .withMessage("Invalid theatre ID"),
    
    body("hallId")
      .isMongoId()
      .withMessage("Invalid hall ID"),
    
    body("startTime")
      .isISO8601()
      .withMessage("Invalid start time format")
      .custom((value, { req }) => {
        if (new Date(value) < new Date()) {
          throw new Error("Start time must be in the future");
        }
        return true;
      }),
    
    body("endTime")
      .isISO8601()
      .withMessage("Invalid end time format")
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.startTime)) {
          throw new Error("End time must be after start time");
        }
        return true;
      }),
    
    body("basePrice")
      .isFloat({ min: 0 })
      .withMessage("Base price must be a positive number")
  ],

  update: [
    param("id")
      .isMongoId()
      .withMessage("Invalid screening ID"),
    
    body("movieId")
      .optional()
      .isMongoId()
      .withMessage("Invalid movie ID"),
    
    body("distributorId")
      .optional()
      .isMongoId()
      .withMessage("Invalid distributor ID"),
    
    body("theatreId")
      .optional()
      .isMongoId()
      .withMessage("Invalid theatre ID"),
    
    body("hallId")
      .optional()
      .isMongoId()
      .withMessage("Invalid hall ID"),
    
    body("startTime")
      .optional()
      .isISO8601()
      .withMessage("Invalid start time format")
      .custom((value, { req }) => {
        if (new Date(value) < new Date()) {
          throw new Error("Start time must be in the future");
        }
        return true;
      }),
    
    body("endTime")
      .optional()
      .isISO8601()
      .withMessage("Invalid end time format")
      .custom((value, { req }) => {
        const startTime = req.body.startTime || req.screening?.startTime;
        if (startTime && new Date(value) <= new Date(startTime)) {
          throw new Error("End time must be after start time");
        }
        return true;
      }),
    
    body("basePrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Base price must be a positive number"),
    
    body("status")
      .optional()
      .isIn(["scheduled", "cancelled", "completed"])
      .withMessage("Invalid status")
  ],

  getAll: [
    query("movieId")
      .optional()
      .isMongoId()
      .withMessage("Invalid movie ID"),
    
    query("theatreId")
      .optional()
      .isMongoId()
      .withMessage("Invalid theatre ID"),
    
    query("startDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid start date format"),
    
    query("endDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid end date format")
      .custom((value, { req }) => {
        if (req.query.startDate && new Date(value) <= new Date(req.query.startDate)) {
          throw new Error("End date must be after start date");
        }
        return true;
      }),
    
    query("status")
      .optional()
      .isIn(["scheduled", "cancelled", "completed"])
      .withMessage("Invalid status")
  ],

  getById: [
    param("id")
      .isMongoId()
      .withMessage("Invalid screening ID")
  ],

  delete: [
    param("id")
      .isMongoId()
      .withMessage("Invalid screening ID")
  ]
};