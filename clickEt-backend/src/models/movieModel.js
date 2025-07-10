import mongoose from "mongoose";

const posterSchema = new mongoose.Schema(
  {
    sm: { type: String, required: true },
    lg: { type: String, required: true },
  },
  {
    _id: false,
  }
);

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      enum: ["Nepali", "Bollywood", "Hollywood"],
      required: true,
    },
    description: {
      type: String,
      required: true,
      unique: true,
    },

    releaseDate: {
      type: Date,
      required: true,
    },
    duration_min: {
      type: Number,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    posterURL: {
      type: posterSchema,
      required: true,
    },
    trailerURL: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "showing"],
      default: "showing",
    },
  },
  { timestamps: true }
);

export const Movie = mongoose.model("movies", movieSchema);
