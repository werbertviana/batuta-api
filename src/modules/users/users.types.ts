export type EloInput =
  | "ferro"
  | "bronze"
  | "prata"
  | "ouro"
  | "platina"
  | "diamante";

export type GameStatsInput = {
  lifePoints: number;
  batutaPoints: number;
  xpPoints: number;
  elo: EloInput;
  nivel: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  gameStats?: Partial<GameStatsInput>;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
  password?: string;
  gameStats?: Partial<GameStatsInput>;
};

export type UserResponse = {
  id: number;
  name: string;
  email: string;
  gameStats: GameStatsInput;
};
