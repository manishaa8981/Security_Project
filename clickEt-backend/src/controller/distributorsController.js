import { Distributor } from "../models/distributorsModel.js";
import {
  deleteImageFromCloudinary,
  processAndUploadImages,
} from "../utils/imageUtils/cloudinaryUtils.js";

export async function addDistributor(request, response) {
  const distributor_details = request.body;
  console.log(distributor_details);

  try {
    const distributor = await Distributor.create(distributor_details);
    return response.status(201).json({
      message: "Distributor added successfully.",
      distributor: distributor,
    });
  } catch (error) {
    console.error(`Error Adding Distributor:${error.message}`);
    return response
      .status(500)
      .json({ message: "Internal Server Error. Check console for details" });
  }
}
export async function checkUniqueDistributors(request, response) {
  const { name } = request.body;

  try {
    const distributor = await Distributor.find({ name: name });
    if (distributor.length > 0) {
      return response.status(409).json({
        message: "Distributor already exists.",
        distributor: distributor,
      });
    }
    return response.status(200).json({ message: "Unique distributor." });
  } catch (error) {
    console.error(`Error Checking unique distributor:${error.message}`);
    return response
      .status(500)
      .json({ message: "Internal Server Error. Check console for details" });
  }
}
export async function getAllDistributors(request, response) {
  try {
    const distributors = await Distributor.find({});
    if (distributors.length !== 0) {
      return response.status(200).json({ distributors: distributors });
    }
    return response.status(204).json({ message: "No Distributors available." });
  } catch (error) {
    console.error(`Error Fetching All Distributors:${error.message}`);
    return response
      .status(500)
      .json({ message: "Internal Server Error. Check console for details" });
  }
}
export async function getDistributorByName(request, response) {
  const { name } = request.query;
  if (!name) {
    return response
      .status(400)
      .json({ message: "Name parameter is required in the query." });
  }
  try {
    const distributor = await Distributor.findOne({ name: name });
    if (distributor.length !== 0) {
      return response.status(200).json({ distributor: distributor });
    }
    return response
      .status(204)
      .json({ message: "No Distributor available by this name." });
  } catch (error) {
    console.error(`Error Fetching Distributors:${error.message}`);
    return response
      .status(500)
      .json({ message: "Internal Server Error. Check console for details" });
  }
}

export const getDistributorsByMovieId = async (req, res) => {
  const { movieId } = req.params; // Extract movieId from request parameters

  try {
    // Find distributors that have distribution rights for the given movieId
    const distributors = await Distributor.find({
      "distributionRights.movieId": movieId,
    }).populate({
      path: "distributionRights.movieId",
      select: "name", // Assuming the movie model has a title field
    });

    if (distributors.length === 0) {
      return res
        .status(404)
        .json({ message: "No distributors found for this movie ID" });
    }

    res.status(200).json({ distributors: distributors });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export async function getDistributorsByLocation(request, response) {
  const { location } = request.body;
  try {
    const distributors = await Distributor.find({ location: location });
    if (distributors.length !== 0) {
      return response.status(200).json({ distributors: distributors });
    }
    return response
      .status(204)
      .json({ message: "No Distributor available for this location." });
  } catch (error) {
    console.error(`Error Fetching Distributors:${error.message}`);
    return response
      .status(500)
      .json({ message: "Internal Server Error. Check console for details" });
  }
}
export async function getDistributorsbyStatus(request, response) {
  const { isActive } = request.params;
  try {
    const distributors = await Distributor.find({ isActive: isActive });
    if (distributors.length !== 0) {
      return response.status(200).json({ distributors: distributors });
    }
    return response
      .status(204)
      .json({ message: "No Distributor available for this location." });
  } catch (error) {
    console.error(`Error Fetching Distributors:${error.message}`);
    return response
      .status(500)
      .json({ message: "Internal Server Error. Check console for details" });
  }
}
export async function updateDistributor(request, response) {
  const { id } = request.params;
  const updateData = request.body;

  try {
    const updatedDistributor = await Distributor.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDistributor) {
      return response.status(404).json({ message: "Distributor not found." });
    }

    return response.status(200).json({ distributor: updatedDistributor });
  } catch (error) {
    console.error(`Error updating distributor: ${error.message}`);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}
export async function deleteDistributor(request, response) {
  const { id } = request.params;

  try {
    const deletedDistributor = await Distributor.findByIdAndDelete(id);

    if (!deletedDistributor) {
      return response.status(404).json({ message: "Distributor not found." });
    }
    return response.status(200).json({
      message: "Distributor deleted successfully.",
      distributor: deletedDistributor,
    });
  } catch (error) {
    console.error(`Error deleting distributor: ${error.message}`);
    return response
      .status(500)
      .json({ message: "Internal Server Error. Check console for details" });
  }
}

export async function uploadDistributorLogo(request, response) {
  try {
    const { distributorId, currentImageUrl } = request.body;
    if (!distributorId) {
      return response.status(400).json({ error: "distributorId is required" });
    }

    if (!request.file) {
      return response.status(400).json({ error: "No image file provided" });
    }

    const imageUrls = await processAndUploadImages(
      [request.file.buffer],
      "distributors"
    );

    // Update user profile URL in the database
    await Distributor.findByIdAndUpdate(distributorId, {
      logo_URL: imageUrls[0],
      isActive: true,
    });
    if (currentImageUrl) {
      await deleteImageFromCloudinary(currentImageUrl);
    }
    return response.status(200).json({
      message: "Profile image uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}
