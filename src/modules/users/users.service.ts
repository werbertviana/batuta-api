import { Prisma } from "@prisma/client";
import { AppError, NotFoundError } from "../../shared/errors";
import { UsersRepository } from "./users.repository";
import type {
  CreateUserInput,
  UpdateUserInput,
  UserResponse,
  EloInput,
} from "./users.types";

function toEloInput(value: unknown): EloInput {
  const v = String(value).toLowerCase();
  if (v === "ferro") return "ferro";
  if (v === "bronze") return "bronze";
  if (v === "prata") return "prata";
  if (v === "ouro") return "ouro";
  if (v === "platina") return "platina";
  if (v === "diamante") return "diamante";
  return "ferro";
}

function toResponse(u: any): UserResponse {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    gameStats: {
      lifePoints: u.lifePoints,
      batutaPoints: u.batutaPoints,
      xpPoints: u.xpPoints,
      elo: toEloInput(u.elo),
      nivel: u.nivel,
    },
  };
}

function isPrismaKnownError(
  err: unknown
): err is Prisma.PrismaClientKnownRequestError {
  return err instanceof Prisma.PrismaClientKnownRequestError;
}

export class UsersService {
  constructor(private repo = new UsersRepository()) {}

  async createUser(input: CreateUserInput): Promise<UserResponse> {
    const existing = await this.repo.findByEmail(input.email);
    if (existing) {
      throw new AppError("E-mail already in use", 409, "EMAIL_ALREADY_EXISTS");
    }

    try {
      const user = await this.repo.create(input);
      return toResponse(user);
    } catch (err) {
      if (isPrismaKnownError(err) && err.code === "P2002") {
        throw new AppError("E-mail already in use", 409, "EMAIL_ALREADY_EXISTS");
      }
      throw err;
    }
  }

  async listUsers(): Promise<UserResponse[]> {
    const users = await this.repo.list();
    return users.map(toResponse);
  }

  async getUser(id: number): Promise<UserResponse> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundError("User not found", "USER_NOT_FOUND");
    }
    return toResponse(user);
  }

  async updateUser(id: number, input: UpdateUserInput): Promise<UserResponse> {
    const exists = await this.repo.findById(id);
    if (!exists) {
      throw new NotFoundError("User not found", "USER_NOT_FOUND");
    }

    if (input.email) {
      const sameEmail = await this.repo.findByEmail(input.email);
      if (sameEmail && sameEmail.id !== id) {
        throw new AppError("E-mail already in use", 409, "EMAIL_ALREADY_EXISTS");
      }
    }

    try {
      const user = await this.repo.update(id, input);
      return toResponse(user);
    } catch (err) {
      if (isPrismaKnownError(err) && err.code === "P2002") {
        throw new AppError("E-mail already in use", 409, "EMAIL_ALREADY_EXISTS");
      }
      throw err;
    }
  }

  async deleteUser(id: number): Promise<void> {
    const exists = await this.repo.findById(id);
    if (!exists) {
      throw new NotFoundError("User not found", "USER_NOT_FOUND");
    }
    await this.repo.delete(id);
  }
}
