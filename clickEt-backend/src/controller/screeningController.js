// screeningController.js
import { Hall } from "../models/hallsModel.js";
import { Screening } from "../models/screeningModel.js";
import { Movie } from "../models/movieModel.js";
import { validationResult } from "express-validator";
import {
  calculateFinalPrice,
  checkTimeConflicts,
  initializeSeatGrid,
  validateDistributionRights,
} from "../utils/screeningSchemaUtils/screeningUtils.js";

export const screeningController = {
  // Create new screening
  add: async (request, response) => {
    try {
      const {
        movieId,
        distributorId,
        theatreId,
        hallId,
        startTime,
        endTime,
        basePrice,
      } = request.body;

      // Check if hall exists
      const hall = await Hall.findById(hallId);
      if (!hall) {
        return response.status(404).json({ message: "Hall not found" });
      }
      console.log("Hall Layout:", hall.layout);
      // Check if movie exists and is showing
      const movie = await Movie.findOne({
        _id: movieId,
        status: "showing",
      });
      if (!movie) {
        return response
          .status(404)
          .json({ message: "Movie not found or not showing" });
      }

      // Check time conflicts
      const conflict = await checkTimeConflicts(
        hallId,
        new Date(startTime),
        new Date(endTime)
      );
      if (conflict) {
        return response
          .status(400)
          .json({ message: "Time slot conflict exists" });
      }

      // Validate distributor rights
      const hasRights = await validateDistributionRights(
        distributorId,
        movieId,
        new Date(startTime)
      );
      if (!hasRights) {
        return response
          .status(400)
          .json({ message: "Invalid distribution rights" });
      }

      // Initialize and validate seat grid
      const seatGrid = hall.layout.sections.map((section, index) => ({
        section: index, // Ensure the section index is correctly set
        rows: Array.from({ length: section.rows }, () =>
          Array.from({ length: section.columns }, () => ({
            code: "a",
            holdExpiresAt: null,
            holdId: null,
            bookingId: null,
          }))
        ),
      }));
      console.log("Seat Gridn rohan:", seatGrid);

      const finalPrice = await calculateFinalPrice(
        basePrice,
        distributorId,
        theatreId,
        movieId,
        new Date(startTime)
      );

      // Create screening
      const screening = await Screening.create({
        movieId,
        distributorId,
        theatreId,
        hallId,
        startTime,
        endTime,
        basePrice,
        finalPrice,
        seatGrid,
      });

      await screening.save();

      response.status(201).json(screening);
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },

  // Get all screenings with filters
  getAll: async (request, response) => {
    try {
      const { movieId, theatreId, startDate, endDate, status } = request.query;

      const query = {};

      if (movieId) query.movieId = movieId;
      if (theatreId) query.theatreId = theatreId;
      if (status) query.status = status;

      if (startDate || endDate) {
        query.startTime = {};
        if (startDate) query.startTime.$gte = new Date(startDate);
        if (endDate) query.startTime.$lte = new Date(endDate);
      }

      const screenings = await Screening.find(query)
        .select("-seatGrid")
        .populate("movieId", "name posterURL")
        .populate("theatreId", "name")
        .populate("hallId", "name")
        .populate("distributorId", "name")
        .sort({ startTime: 1 });
      response.json(screenings);
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },

  // Get single screening by ID
  // getById: async (request, response) => {
  //   try {
  //     const screening = await Screening.findById(request.params.id)
  //       .populate("movieId")
  //       .populate("theatreId")
  //       .populate("hallId")
  //       .populate("distributorId");

  //     if (!screening) {
  //       return response.status(404).json({ message: "Screening not found" });
  //     }

  //     response.json(screening);
  //   } catch (error) {
  //     response.status(500).json({ message: error.message });
  //   }
  // },

  getById: async (request, response) => {
    try {
      const screening = await Screening.findById(request.params.id)
        .populate("movieId", "name duration_min")
        .populate("theatreId", "name");
      response.json(screening);
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
  getByMovie: async (request, response) => {
    const { movieId } = request.params;
    try {
      // Fetch screenings by movieId
      const screenings = await Screening.find({ movieId: movieId })
        .select("-seatGrid") // Exclude seatGrid for performance reasons
        .populate("movieId", "name duration_min") // Populate movieId with name and duration_min
        .populate("theatreId", "name") // Populate theatreId with name
        .populate("hallId", "name") // Populate hallId with name
        .populate("distributorId", "name"); // Populate distributorId with name
  
      // Check if any screenings were found
      if (screenings.length === 0) {
        return response.status(404).json({ message: "No screenings found for the given movie" });
      }
    
      // Return the screenings
      response.json(screenings);
    } catch (error) {
      console.error("Error fetching screenings:", error);
      response.status(500).json({ message: error.message });
    }
  },

  // Update screening
  update: async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }

      const screeningId = request.params.id;
      const updates = request.body;

      // Find existing screening
      const screening = await Screening.findById(screeningId);
      if (!screening) {
        return response.status(404).json({ message: "Screening not found" });
      }

      if (screening.status !== "scheduled") {
        return response.status(400).json({
          message: "Cannot update non-scheduled screening",
        });
      }

      // Check time conflicts if updating times
      if (updates.startTime || updates.endTime) {
        const newStartTime = updates.startTime || screening.startTime;
        const newEndTime = updates.endTime || screening.endTime;
        const hallId = updates.hallId || screening.hallId;

        const conflict = await checkTimeConflicts(
          hallId,
          new Date(newStartTime),
          new Date(newEndTime),
          screeningId
        );
        if (conflict) {
          return response.status(400).json({ message: "Time slot conflict" });
        }
      }

      // Validate distributor rights if updating movie or distributor
      if (updates.movieId || updates.distributorId) {
        const hasRights = await validateDistributionRights(
          updates.distributorId || screening.distributorId,
          updates.movieId || screening.movieId,
          new Date(updates.startTime || screening.startTime)
        );
        if (!hasRights) {
          return response.status(400).json({
            message: "Invalid distribution rights",
          });
        }
      }

      // Reinitialize seat grid if updating hall
      if (updates.hallId) {
        const newHall = await Hall.findById(updates.hallId);
        if (!newHall) {
          return response.status(404).json({ message: "Hall not found" });
        }
        updates.seatGrid = initializeSeatGrid(newHall.layout);
      }

      const updatedScreening = await Screening.findByIdAndUpdate(
        screeningId,
        updates,
        { new: true }
      );

      response.json(updatedScreening);
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },

  getLayoutByid: async (request, response) => {
    try {
      const screening = await Screening.findById(request.params.id);
      response
        .status(200)
        .json({ seatGrid: screening.seatGrid, price: screening.basePrice });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },

  // Delete screening
  delete: async (request, response) => {
    const { id } = request.params;
    try {
      const screening = await Screening.findById(id);
      if (!screening) {
        return response.status(404).json({ message: "Screening not found" });
      }

      screening.isActive = false;
      screening.status = "cancelled";
      await screening.save();

      response.json({ message: "Screening cancelled successfully" });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
};
