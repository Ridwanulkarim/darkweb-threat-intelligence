/*
  Warnings:

  - Added the required column `password` to the `Analyst` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Analyst" ADD COLUMN     "password" TEXT NOT NULL;
