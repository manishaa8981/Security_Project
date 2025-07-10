import { body } from "express-validator";
import { Movie } from "../../models/movieModel.js";
import mongoose from "mongoose";
import {isValidPhoneNumber} from 'libphonenumber-js'
export const validationRules = [
  body("name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Distributor name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("locations")
    .isArray({ min: 1 })
    .withMessage("At least one location is required")
    .custom((locations) => {
      locations.forEach((location) => {
        if (!["HQ", "Branch"].includes(location.type)) {   // Enum
          throw new Error("Invalid location type");
        }
        if (!location.location) {
          throw new Error("Location name is required");
        }
        if (location.coordinates) {
          if (!location.coordinates.latitude || !location.coordinates.longitude) {
            throw new Error("Valid coordinates are required");
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
            if (!['SUPPORT', 'INQUIRY'].includes(phone.type)) {
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
            if (!["SUPPORT", "INQUIRY"].includes(email.type)) {      // Enum
              // Enum
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
    .isFloat({ min: 0, max: 100 })
    .withMessage("Commission rate must be between 0 and 100"),

    body('distributionRights')
    .isArray().optional()
    .custom(async (rights) => {
      for (const right of rights) {
        if (!mongoose.Types.ObjectId.isValid(right.movieId)) {
          throw new Error(`Invalid movie ID format: ${right.movieId}`);
        }

        const movie = await Movie.findById(right.movieId);
        if (!movie) {
          throw new Error(`Movie with ID ${right.movieId} does not exist`);
        }

        if (right.commissionRate && (right.commissionRate < 0 || right.commissionRate > 100)) {
          throw new Error('Distribution right commission rate must be between 0 and 100');
        }

        // Validate dates
        if (new Date(right.validFrom) >= new Date(right.validUntil)) {
          throw new Error('Invalid date range for distribution rights');
        }

        // Validate locations
        if (!right.territories || right.territories.length === 0) {
          throw new Error('At least one location is required for distribution rights');
        }
      }
      return true;
    }),

  body("isActive")
    .isBoolean()
    .optional()
    .withMessage("Active status must be a boolean"),
];
