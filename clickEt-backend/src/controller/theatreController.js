import { Theatre } from "../models/theatresModel.js";

export async function addTheatre(request, response) {
  const theatre_details = request.body;

  try {
    const theatre = await Theatre.create(theatre_details);
    return response.status(201).json({
      message: "Theatre added successfully.",
      Theatre: theatre,
    });
  } catch (error) {
    console.error(`Error Adding Theatre:${error.message}`);
    return response
      .status(500)
      .json({ message: "Internal Server Error. Check console for details" });
  }
}

export async function checkUniqueTheatres(request, response) {
  const { name } = request.body;

  try {
    const theatre = await Theatre.find({ name: name });
    if (theatre.length > 0) {
      return response.status(409).json({
        message: "Theatre already exists.",
        theatre: theatre,
      });
    }
    return response.status(200).json({ message: "Unique theatre." });
  } catch (error) {
    console.error(`Error Checking unique theatre:${error.message}`);
    return response
      .status(500)
      .json({ message: "Internal Server Error. Check console for details" });
  }
}

export async function getAllTheatres(request, response) {
  try {
    const theatres = await Theatre.find({});
    if (theatres.length !== 0) {
      return response.status(200).json({ theatres: theatres });
    }
    return response.status(204).json({ message: "No Theatres available." });
  } catch (error) {
    console.error(`Error Fetching All Theatres:${error.message}`);
    return response
      .status(500)
      .json({ message: "Internal Server Error. Check console for details" });
  }
}
export async function getTheatreByName(request, response) {
  const { name } = request.body;
  try {
    const theatre = await Theatre.find({ name: name });
    if (theatre.length !== 0) {
      return response.status(200).json({ theatre: theatre });
    } else {
      return response
        .status(204)
        .json({ message: "No Theatre available by this name." });
    }
  } catch (error) {
    console.error(`Error Fetching Theatres:${error.message}`);
    return response
      .status(500)
      .json({ message: "Internal Server Error. Check console for details" });
  }
}

export const getTheatresByAddress = async (request, res) => {
  try {
    const { address } = request.body;
    const theatres = await Theatre.find({
      "location.address": address,
    });

    if (theatres.length === 0) {
      return res
        .status(204)
        .json({ message: "No theatres found for this address." });
    }

    res.status(200).json(theatres);
  } catch (err) {
    // Handle any potential errors
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while fetching theatres." });
  }
};

export async function getTheatresbyStatus(request, response) {
  const { isActive } = request.params;
  try {
    const theatres = await Theatre.find({ isActive: isActive });
    if (theatres.length !== 0) {
      return response.status(200).json({ theatres: theatres });
    }
    return response
      .status(204)
      .json({ message: "No Theatre available for this location." });
  } catch (error) {
    console.error(`Error Fetching Theatres:${error.message}`);
    return response
      .status(500)
      .json({ message: "Internal Server Error. Check console for details" });
  }
}

export async function updateTheatre(request, response) {
  const { id } = request.params;
  const updateData = request.body;

  try {
    const updatedTheatre = await Theatre.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTheatre) {
      return response.status(404).json({ message: "Theatre not found." });
    }

    return response.status(200).json({ theatre: updatedTheatre });
  } catch (error) {
    console.error(`Error updating theatre: ${error.message}`);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteTheatre(request, response) {
  const { id } = request.params;

  try {
    const deletedTheatre = await Theatre.findByIdAndDelete(id);

    if (!deletedTheatre) {
      return response.status(404).json({ message: "Theatre not found." });
    }
    return response.status(200).json({
      message: "Theatre deleted successfully.",
      theatre: deletedTheatre,
    });
  } catch (error) {
    console.error(`Error deleting theatre: ${error.message}`);
    return response
      .status(500)
      .json({ message: "Internal Server Error. Check console for details" });
  }
}
