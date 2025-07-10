import { body, validationResult } from "express-validator";
import {isValidPhoneNumber} from 'libphonenumber-js'
export const validateTheatre = [
  body("name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Theatre's name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("locations")
    .isArray()
    .withMessage("Location must be an array")
    .custom((locations) => {
      locations.forEach((location) => {
        if (!location.address) {
          throw new Error("Location's address is required");
        }
        if (location.coordinates) {
          if (
            !location.coordinates.latitude ||
            !location.coordinates.longitude
          ) {
            throw new Error(
              "Location must include valid coordinates (latitude and longitude)"
            );
          }
        }
      });
      return true;
    }),

  body("contacts")
    .isArray()
    .withMessage("Contact must be an array")
    .custom((contacts) => {
      contacts.forEach((contact) => {
        if (contact.phoneNumbers) {
          contact.phoneNumbers.forEach((phone) => {
            if (!["SUPPORT", "INQUIRY"].includes(phone.type)) {
              // Enum
              throw new Error("Invalid phone number type");
            }
            if (!phone.number || !isValidPhoneNumber(phone.number, "NP")) {
              throw new Error("Invalid phone number");
            }
          });
        }

        if (contact.emails) {
          contact.emails.forEach((email) => {
            if (!["SUPPORT", "INQUIRY"].includes(email.type)) {
              throw new Error("Invalid email type");
            }
            if (
              !email.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
            ) {
              throw new Error("Invalid email format");
            }
          });
        }
      });
      return true;
    }),

  body("commissionRate")
    .isArray()
    .withMessage("commissionRate must be an array")
    .custom((rates) => {
      rates.forEach((rate) => {
        if (!rate.address) {
          throw new Error("Address is required for commission rate");
        }
        if (rate.rate === undefined || rate.rate < 0 || rate.rate > 100) {
          throw new Error("Rate must be between 0 and 100");
        }
      });
      return true;
    }),

  body("isActive")
    .isBoolean()
    .withMessage("isActive must be a boolean")
    .optional(),

  // Collect validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
