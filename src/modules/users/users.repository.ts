import bcrypt from "bcrypt";
import { prisma } from "../../shared/prisma";
import type { CreateUserInput, UpdateUserInput } from "./users.types";
import { Elo } from "@prisma/client";

function toPrismaElo(elo?: string): Elo | undefined {
  if (!elo) return undefined;
  const v = elo.toLowerCase();
  if (v === "ferro") return Elo.FERRO;
  if (v === "bronze") return Elo.BRONZE;
  if (v === "prata") return Elo.PRATA;
  if (v === "ouro") return Elo.OURO;
  if (v === "platina") return Elo.PLATINA;
  if (v === "diamante") return Elo.DIAMANTE;
  return Elo.FERRO;
}

export class UsersRepository {
  async create(data: CreateUserInput) {
    const gs = data.gameStats ?? {};
    const passwordHash = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,

        lifePoints: gs.lifePoints ?? 3,
        batutaPoints: gs.batutaPoints ?? 0,
        xpPoints: gs.xpPoints ?? 0,
        elo: toPrismaElo(gs.elo) ?? Elo.FERRO,
        nivel: gs.nivel ?? "1",
      },
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  // ✅ específico pra autenticação (inclui passwordHash no tipo)
  async findByEmailWithPassword(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,

        lifePoints: true,
        batutaPoints: true,
        xpPoints: true,
        elo: true,
        nivel: true,
      },
    });
  }

  async list() {
    return prisma.user.findMany({ orderBy: { id: "desc" } });
  }

  async update(id: number, data: UpdateUserInput) {
    const gs = data.gameStats;

    const patch: Record<string, any> = {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),

      ...(gs?.lifePoints !== undefined ? { lifePoints: gs.lifePoints } : {}),
      ...(gs?.batutaPoints !== undefined ? { batutaPoints: gs.batutaPoints } : {}),
      ...(gs?.xpPoints !== undefined ? { xpPoints: gs.xpPoints } : {}),
      ...(gs?.elo !== undefined ? { elo: toPrismaElo(gs.elo) ?? Elo.FERRO } : {}),
      ...(gs?.nivel !== undefined ? { nivel: gs.nivel } : {}),
    };

    if (data.password !== undefined) {
      patch.passwordHash = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.update({
      where: { id },
      data: patch,
    });
  }

  async delete(id: number) {
    return prisma.user.delete({ where: { id } });
  }
}
