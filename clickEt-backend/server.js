import mongoose from "mongoose";
import app from "./src/app.js";

const port = process.env.BACK_PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`MongoDB connected to ${process.env.MONGODB_URI}`);
    const server = app.listen(port, () => {
      console.log(`Listening on PORT ${port}`);
    });
    app.set("server", server);
  })
  .catch((error) => {
    console.error(`Mongoose Connection Error.\nError: ${error.message}`);
  });
