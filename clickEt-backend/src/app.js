import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cron from "node-cron";

import loggingMiddleware from "./middleware/utils/loggingMiddleware.js";
import { cleanupExpiredHolds } from "./utils/bookingSchemaUtils/bookingUtils.js";

//  Routes
import bookingRoute from "./routes/bookingRoute.js";
import distributorRoute from "./routes/distributorsRoute.js";
import hallRoute from "./routes/hallRoute.js";
import moviesRoute from "./routes/movieRoute.js";
import { default as mfaRoute, default as otpRoute } from "./routes/otpRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import screeningRoute from "./routes/screeningRoute.js";
import theatreRoute from "./routes/theatreRoute.js";
import userRoute from "./routes/userRoute.js";

const app = express();
const apiVersion = "/api/v1";

//  Middleware
app.use(
  helmet({
    referrerPolicy: { policy: "no-referrer" }, // Added Referrer-Policy
    contentSecurityPolicy: false, // disable if you plan to add custom CSP manually
  })
);

// Add Permissions-Policy manually
app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), fullscreen=(), payment=()"
  );
  next();
});
app.use(
  cors({
    origin: ["https://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use(cookieParser());
app.use(loggingMiddleware);

// Enforce HTTPS and HSTS in production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect("https://" + req.headers.host + req.url);
    }
    next();
  });
  app.use((req, res, next) => {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    next();
  });
  // If using a reverse proxy (nginx, etc.), SSL termination should be handled there.
}

// Route registration
app.use(`${apiVersion}/auth`, userRoute);
app.use(`${apiVersion}/mfa`, mfaRoute); // MFA route
app.use(`${apiVersion}/movie`, moviesRoute);
app.use(`${apiVersion}/distributor`, distributorRoute);
app.use(`${apiVersion}/theatre`, theatreRoute);
app.use(`${apiVersion}/hall`, hallRoute);
app.use(`${apiVersion}/screening`, screeningRoute);
app.use(`${apiVersion}/booking`, bookingRoute);
app.use(`${apiVersion}/payments`, paymentRoute);
app.use(`${apiVersion}/otp`, otpRoute);
// Health check
app.use(`${apiVersion}/health`, (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Cron jobs
cron.schedule(
  "*/5 * * * *",
  () => {
    cleanupExpiredHolds();
  },
  {
    scheduled: true,
    timezone: "UTC",
  }
);

export default app;
