/*
  Warnings:

  - You are about to drop the column `mercadoria_id` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `unidade_medida` on the `pedidos` table. All the data in the column will be lost.
  - The `status` column on the `pedidos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `endereco` to the `feirantes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor_total` to the `pedidos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('EM_ANDAMENTO', 'FINALIZADO', 'CANCELADO', 'PENDENTE', 'ENTREGUE', 'EM_PREPARACAO', 'EM_ROTA', 'RETORNANDO');

-- CreateEnum
CREATE TYPE "StatusFeirante" AS ENUM ('Aberto', 'Fechado');

-- CreateEnum
CREATE TYPE "StatusFeira" AS ENUM ('Aberto', 'Fechado');

-- DropForeignKey
ALTER TABLE "pedidos" DROP CONSTRAINT "pedidos_mercadoria_id_fkey";

-- AlterTable
ALTER TABLE "feirantes" ADD COLUMN     "avaliacao" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "banca" VARCHAR(100),
ADD COLUMN     "endereco" VARCHAR(60) NOT NULL,
ADD COLUMN     "especialidade" VARCHAR(100),
ADD COLUMN     "feiraId" INTEGER,
ADD COLUMN     "foto" TEXT,
ADD COLUMN     "status" "StatusFeirante" DEFAULT 'Aberto',
ADD COLUMN     "totalAvaliacoes" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "mercadorias" ADD COLUMN     "emoji" VARCHAR(10);

-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "mercadoria_id",
DROP COLUMN "quantidade",
DROP COLUMN "unidade_medida",
ADD COLUMN     "valor_total" DECIMAL(10,2) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "StatusPedido" NOT NULL DEFAULT 'PENDENTE';

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "cestas" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "desconto" VARCHAR(50),
    "imagem" TEXT,
    "emoji" VARCHAR(10),
    "categoria" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "feirante_id" INTEGER NOT NULL,

    CONSTRAINT "cestas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cestas_recorrentes" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "frequencia" VARCHAR(50) NOT NULL,
    "dia_entrega" VARCHAR(50) NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usuario_id" VARCHAR(36) NOT NULL,
    "feirante_id" INTEGER NOT NULL,

    CONSTRAINT "cestas_recorrentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_items" (
    "id" SERIAL NOT NULL,
    "quantidade" DECIMAL(10,2) NOT NULL,
    "preco_unitario" DECIMAL(10,2) NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "mercadoria_id" INTEGER NOT NULL,

    CONSTRAINT "pedido_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feiras" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "endereco" VARCHAR(255) NOT NULL,
    "status" "StatusFeira" NOT NULL DEFAULT 'Aberto',
    "horario" VARCHAR(100) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "imagem" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feiras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CestaToMercadoria" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CestaRecorrenteToMercadoria" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CestaToMercadoria_AB_unique" ON "_CestaToMercadoria"("A", "B");

-- CreateIndex
CREATE INDEX "_CestaToMercadoria_B_index" ON "_CestaToMercadoria"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CestaRecorrenteToMercadoria_AB_unique" ON "_CestaRecorrenteToMercadoria"("A", "B");

-- CreateIndex
CREATE INDEX "_CestaRecorrenteToMercadoria_B_index" ON "_CestaRecorrenteToMercadoria"("B");

-- AddForeignKey
ALTER TABLE "feirantes" ADD CONSTRAINT "feirantes_feiraId_fkey" FOREIGN KEY ("feiraId") REFERENCES "feiras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cestas" ADD CONSTRAINT "cestas_feirante_id_fkey" FOREIGN KEY ("feirante_id") REFERENCES "feirantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cestas_recorrentes" ADD CONSTRAINT "cestas_recorrentes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cestas_recorrentes" ADD CONSTRAINT "cestas_recorrentes_feirante_id_fkey" FOREIGN KEY ("feirante_id") REFERENCES "feirantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_items" ADD CONSTRAINT "pedido_items_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_items" ADD CONSTRAINT "pedido_items_mercadoria_id_fkey" FOREIGN KEY ("mercadoria_id") REFERENCES "mercadorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CestaToMercadoria" ADD CONSTRAINT "_CestaToMercadoria_A_fkey" FOREIGN KEY ("A") REFERENCES "cestas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CestaToMercadoria" ADD CONSTRAINT "_CestaToMercadoria_B_fkey" FOREIGN KEY ("B") REFERENCES "mercadorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CestaRecorrenteToMercadoria" ADD CONSTRAINT "_CestaRecorrenteToMercadoria_A_fkey" FOREIGN KEY ("A") REFERENCES "cestas_recorrentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CestaRecorrenteToMercadoria" ADD CONSTRAINT "_CestaRecorrenteToMercadoria_B_fkey" FOREIGN KEY ("B") REFERENCES "mercadorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;
