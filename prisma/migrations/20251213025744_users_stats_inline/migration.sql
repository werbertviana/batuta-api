/*
  Warnings:

  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Elo" AS ENUM ('FERRO', 'BRONZE', 'PRATA', 'OURO', 'PLATINA', 'DIAMANTE');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "fullName",
DROP COLUMN "passwordHash",
DROP COLUMN "role",
ADD COLUMN     "batutaPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "elo" "Elo" NOT NULL DEFAULT 'FERRO',
ADD COLUMN     "lifePoints" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "nivel" TEXT NOT NULL DEFAULT '1',
ADD COLUMN     "xpPoints" INTEGER NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "UserRole";
