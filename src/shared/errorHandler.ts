import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "./errors";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  // Se já começou a responder, delega pro handler padrão do Express
  if (res.headersSent) {
    return next(err);
  }

  // 1) Erros de negócio (AppError)
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: {
        code: err.code ?? "APP_ERROR",
        message: err.message ?? "Application error",
      },
    });
  }

  // 2) Validação (Zod)
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request body",
        details: err.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
    });
  }

  // 3) Prisma: erros conhecidos
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        error: {
          code: "UNIQUE_CONSTRAINT",
          message: "Unique constraint violation",
          meta: err.meta ?? undefined,
        },
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        error: {
          code: "RECORD_NOT_FOUND",
          message: "Record not found",
        },
      });
    }
  }

  // 4) Erro inesperado
  console.error("[errorHandler] Unhandled error:", err);

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Unexpected error",
    },
  });
}
