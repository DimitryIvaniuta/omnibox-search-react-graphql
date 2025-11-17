import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { analyticsRouter } from "./analyticsRouter";
import { errorMiddleware } from "./errors";

const app = express();

/**
 * Basic JSON body parsing.
 * In Node18+ this is fine for typical BFF-sized payloads.
 */
app.use(express.json());

/**
 * CORS – allow calls only from our React origin in dev.
 * Interview talking point:
 *  - In prod, use env var with concrete domain, not "*".
 */
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";
app.use(
    cors({
        origin: FRONTEND_ORIGIN,
    }),
);

/**
 * morgan – structured access log.
 * In real setups this gets shipped to ELK / Loki / CloudWatch.
 */
app.use(morgan("dev"));

/**
 * Mount our /api/analytics routes.
 * Clear, versionable base path (e.g. /api/v1/analytics).
 */
app.use("/api/analytics", analyticsRouter);

/**
 * Health endpoints – used by k8s liveness/readiness probes.
 */
app.get("/health/live", (_req, res) => res.send("OK"));
app.get("/health/ready", (_req, res) => res.send("OK"));

/** Error handler last */
app.use(errorMiddleware);

const PORT = Number(process.env.PORT ?? 4000);

/**
 * Start HTTP server and handle graceful shutdown.
 */
const server = app.listen(PORT, () => {
    console.log(`Search analytics BFF listening on http://localhost:${PORT}`);
});

const shutdown = () => {
    console.log("Shutting down gracefully...");
    server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
    });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
