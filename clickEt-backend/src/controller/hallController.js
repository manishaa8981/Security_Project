// controllers/hallController.js

import { Hall } from "../models/hallsModel.js";

export const createHall = async (request, response) => {
  try {
    const { theatreId, location, name, layout } = request.body;

    // Optionally, you can validate that theatreId exists, etc.
    // For now, just create the Hall.
    const newHall = await Hall.create({
      theatreId,
      location,
      name,
      layout,
    });

    return response.status(201).json({
      message: "Hall created successfully",
      hall: newHall,
    });
  } catch (error) {
    console.error("Error creating hall:", error);
    return response.status(500).json({ error: "Failed to create hall" });
  }
};

/**
 * Get all Halls
 */
export const getAllHalls = async (request, response) => {
  try {
    // If you want to populate the theatre details:
    // const halls = await Hall.find().populate("theatreId");
    const halls = await Hall.find();
    return response.status(200).json(halls);
  } catch (error) {
    console.error("Error fetching halls:", error);
    return response.status(500).json({ error: "Failed to fetch halls" });
  }
};

export const getHallsByTheatre = async (request, response) => {
  try {
    const { theatreId } = request.params;
    const halls = await Hall.find({ theatreId });
    return response.status(200).json(halls);
  } catch (error) {
    console.error("Error fetching halls by theatre:", error);
    return response
      .status(500)
      .json({ error: "Failed to fetch halls by theatre" });
  }
};
/**
 * Get one Hall by ID
 */
export const getHallById = async (request, response) => {
  try {
    const { id } = request.params;
    const hall = await Hall.findById(id);
    if (!hall) {
      return response.status(404).json({ error: "Hall not found" });
    }
    return response.status(200).json(hall);
  } catch (error) {
    console.error("Error fetching hall:", error);
    return response.status(500).json({ error: "Failed to fetch hall" });
  }
};

/**
 * Update an existing Hall
 */
export const updateHall = async (request, response) => {
  try {
    const { id } = request.params;
    const { theatreId, name, layout, isActive } = request.body;

    // findByIdAndUpdate or findOneAndUpdate
    const updatedHall = await Hall.findByIdAndUpdate(
      id,
      { theatreId, name, layout, isActive },
      { new: true } // return the updated doc
    );

    if (!updatedHall) {
      return response.status(404).json({ error: "Hall not found" });
    }

    return response.status(200).json({
      message: "Hall updated successfully",
      hall: updatedHall,
    });
  } catch (error) {
    console.error("Error updating hall:", error);
    return response.status(500).json({ error: "Failed to update hall" });
  }
};

export const toggleHallStatus = async (request, response) => {
  try {
    const { id } = request.params;

    const hall = await Hall.findById(id);
    if (!hall) {
      return response.status(404).json({ error: "Hall not found" });
    }

    // Toggle the isActive status
    hall.isActive = !hall.isActive;
    await hall.save();

    return response.status(200).json({
      message: `Hall ${
        hall.isActive ? "activated" : "deactivated"
      } successfully`,
      hall,
    });
  } catch (error) {
    console.error("Error toggling hall status:", error);
    return response.status(500).json({ error: "Failed to toggle hall status" });
  }
};

/**
 * Delete a Hall
 */
export const deleteHall = async (request, response) => {
  try {
    const { id } = request.params;
    const hall = await Hall.findByIdAndDelete(id);
    if (!hall) {
      return response.status(404).json({ error: "Hall not found" });
    }
    return response.status(200).json({ message: "Hall deleted successfully" });
  } catch (error) {
    console.error("Error deleting hall:", error);
    return response.status(500).json({ error: "Failed to delete hall" });
  }
};
