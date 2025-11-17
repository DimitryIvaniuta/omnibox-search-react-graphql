import type { NextFunction, Request, Response } from "express";

/**
 * Custom error type for 4xx "bad request" errors.
 */
export class BadRequestError extends Error {
    statusCode = 400 as const;
    constructor(message: string) {
        super(message);
        this.name = "BadRequestError";
    }
}

/**
 * Central error handler registered *after* all routes.
 * Interview talking point:
 *  - All errors funnel here => consistent JSON, no stack traces in response.
 */
export function errorMiddleware(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    console.error(err);

    if (err instanceof BadRequestError) {
        return res.status(err.statusCode).json({
            error: err.name,
            message: err.message,
        });
    }

    // Fallback: unexpected server error
    return res.status(500).json({
        error: "InternalServerError",
        message: "Something went wrong. Check server logs for details.",
    });
}
