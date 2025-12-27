/*
  Warnings:

  - Added the required column `matadata` to the `ZapRun` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ZapRun" ADD COLUMN     "matadata" JSONB NOT NULL;
