import fs from "fs";
import https from "https";
import mongoose from "mongoose";
import app from "./src/app.js";

const port = process.env.BACK_PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`MongoDB connected to ${process.env.MONGODB_URI}`);
    const certPath = "../certs";

    const options = {
      key: fs.readFileSync(`${certPath}/key.pem`),
      cert: fs.readFileSync(`${certPath}/cert.pem`),
    };

    https.createServer(options, app).listen(port, () => {
      console.log(`✅ HTTPS server running on https://localhost:${port}`);
    });

    app.set("server", app);
  })
  .catch((error) => {
    console.error(`Mongoose Connection Error.\nError: ${error.message}`);
  });
