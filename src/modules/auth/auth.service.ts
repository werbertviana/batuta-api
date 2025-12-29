import bcrypt from "bcrypt";
import { UsersRepository } from "../users/users.repository";
import { AppError } from "../../shared/errors";

export class AuthService {
  constructor(private usersRepo = new UsersRepository()) {}

  async login(email: string, password: string) {
    const user = await this.usersRepo.findByEmail(email);

    if (!user) {
      throw new AppError("Credenciais inválidas", 401, "INVALID_CREDENTIALS");
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new AppError("Credenciais inválidas", 401, "INVALID_CREDENTIALS");
    }

    // retorna sem passwordHash
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      gameStats: {
        lifePoints: user.lifePoints,
        batutaPoints: user.batutaPoints,
        xpPoints: user.xpPoints,
        elo: String(user.elo).toLowerCase(),
        nivel: user.nivel,
      },
    };
  }
}
