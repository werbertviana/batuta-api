import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { UsersService } from "./users.service";

const eloSchema = z.enum([
  "ferro",
  "bronze",
  "prata",
  "ouro",
  "platina",
  "diamante",
]);

const gameStatsSchema = z
  .object({
    lifePoints: z.number().int().min(0).default(3),
    batutaPoints: z.number().int().min(0).default(0),
    xpPoints: z.number().int().min(0).default(0),
    elo: eloSchema.default("ferro"),
    nivel: z.string().min(1).default("1"),
  })
  .partial();

const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(4),
  gameStats: gameStatsSchema.optional(),
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(4).optional(),
  gameStats: gameStatsSchema.optional(),
});

export class UsersController {
  constructor(private service = new UsersService()) {}

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.service.listUsers();
      return res.json(users);
    } catch (err) {
      return next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const user = await this.service.getUser(id);
      return res.json(user);
    } catch (err) {
      return next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = createSchema.parse(req.body);
      const user = await this.service.createUser(body);
      return res.status(201).json(user);
    } catch (err) {
      return next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const body = updateSchema.parse(req.body);
      const user = await this.service.updateUser(id, body);
      return res.json(user);
    } catch (err) {
      return next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.service.deleteUser(id);

      // ✅ 204 não tem body (correto REST). Se quiser JSON, troque pra 200.
      return res.status(204).send();
    } catch (err) {
      return next(err);
    }
  };
}
