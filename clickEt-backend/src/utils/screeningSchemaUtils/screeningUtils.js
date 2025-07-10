import { Distributor } from "../../models/distributorsModel.js";
import { Screening } from "../../models/screeningModel.js";
import { Theatre } from "../../models/theatresModel.js";

// Utility function to check time conflicts
export const checkTimeConflicts = async (
  hallId,
  startTime,
  endTime,
  excludeScreeningId = null
) => {
  const query = {
    hallId,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
    status: "scheduled",
  };

  if (excludeScreeningId) {
    query._id = { $ne: excludeScreeningId };
  }

  return await Screening.findOne(query);
};

// Utility function to validate distributor rights
export const validateDistributionRights = async (
  distributorId,
  movieId,
  screeningDate
) => {
  return await Distributor.findOne({
    _id: distributorId,
    distributionRights: {
      $elemMatch: {
        movieId,
        validFrom: { $lte: screeningDate },
        validUntil: { $gte: screeningDate },
      },
    },
  });
};

// Initialize seat grid based on hall layout
export const initializeSeatGrid = (hallLayout) => {
  const seatGrid = [];
  
  // Process each section in the hall layout
  hallLayout.sections.forEach((section, sectionIndex) => {
    // Create array for each row in the section
    const rows = [];
    for (let r = 0; r < section.rows; r++) {
      const seats = [];
      for (let c = 0; c < section.columns; c++) {
        // Create seat with all necessary properties
        seats.push({
          code: "a", // available
          holdExpiresAt: null,
          holdId: null,
          bookingId: null
        });
      }
      rows.push(seats);
    }
    seatGrid.push(rows);
  });

  return seatGrid;
};

export const calculateFinalPrice = async (basePrice, distributorId, theatreId, movieId, screeningDate) => {
  // Get distributor commission
  const distributor = await Distributor.findById(distributorId);
  let distributorCommission = distributor.commissionRate;
  
  // Check distribution rights
  const right = distributor.distributionRights.find(r => 
    r.movieId.equals(movieId) &&
    r.validFrom <= screeningDate &&
    r.validUntil >= screeningDate
  );
  if (right) distributorCommission = right.commissionRate;

  // Get theatre commission
  const theatre = await Theatre.findById(theatreId);
  const theatreCommission = theatre.commissionRate.reduce((max, rate) => 
    rate.rate > max ? rate.rate : max, 0
  );

  // Calculate final price
  const totalCommission = distributorCommission + theatreCommission;
  return basePrice * (1 + totalCommission / 100);
};

// Validation function to ensure seat grid matches hall layout
export const validateSeatGrid = (seatGrid, hallLayout) => {
  if (!hallLayout?.sections || !Array.isArray(hallLayout.sections)) {
    return false;
  }

  // Check if number of sections matches
  if (seatGrid.length !== hallLayout.sections.length) {
    return false;
  }

  // Check each section's dimensions
  return hallLayout.sections.every((section, index) => {
    const gridSection = seatGrid[index];
    return (
      gridSection.length === section.rows &&
      gridSection[0].length === section.columns
    );
  });
};
