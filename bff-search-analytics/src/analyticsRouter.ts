import { Router } from "express";
import { z } from "zod";
import { searchAnalyticsStore } from "./store";
import type { TypedRequest, SearchPickEvent } from "./types";
import { BadRequestError } from "./errors";

/**
 * Zod schema for validating incoming JSON.
 * Interview talking point:
 *  - ALWAYS validate untrusted input at the boundary (controller layer).
 */
const searchPickSchema = z.object({
    kind: z.enum([
        "contact",
        "listing",
        "transaction",
        "product",
        "mailing",
        "referral",
    ]),
    entityId: z.string().min(1).max(64),
    label: z.string().min(1).max(200).optional(),
    pickedAt: z
        .string()
        .datetime()
        .optional(), // frontend may omit => we fill in server time
});

const router = Router();

/**
 * POST /api/analytics/search
 *
 * Logs a single "user picked result from omnibox" event.
 */
router.post(
    "/search",
    (req: TypedRequest<unknown>, res, next) => {
        try {
            // Parse & validate
            const parsed = searchPickSchema.parse(req.body);

            const event: SearchPickEvent = {
                kind: parsed.kind,
                entityId: parsed.entityId,
                label: parsed.label,
                pickedAt: parsed.pickedAt ?? new Date().toISOString(),
            };

            searchAnalyticsStore.add(event);

            // 204 No Content -> write-behind style endpoint, no payload
            return res.status(204).send();
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Turn validation errors into 400s
                return next(
                    new BadRequestError(
                        "Invalid search analytics payload: " +
                        error.errors
                            .map((e) => `${e.path.join(".")}: ${e.message}`)
                            .join(", "),
                    ),
                );
            }
            return next(error);
        }
    },
);

/**
 * GET /api/analytics/search/top?limit=20
 *
 * Returns the most frequently picked labels.
 */
router.get("/search/top", (req, res) => {
    const limit = Number(req.query.limit ?? 20);
    const safeLimit = Number.isFinite(limit) && limit > 0 && limit <= 100 ? limit : 20;

    const top = searchAnalyticsStore.getTopLabels(safeLimit);
    const byKind = searchAnalyticsStore.getCountsByKind();

    return res.json({
        top,
        byKind,
    });
});

/**
 * DELETE /api/analytics/search
 * - Convenience endpoint to reset in-memory stats during development.
 */
router.delete("/search", (_req, res) => {
    searchAnalyticsStore.clear();
    res.status(204).send();
});

export { router as analyticsRouter };
