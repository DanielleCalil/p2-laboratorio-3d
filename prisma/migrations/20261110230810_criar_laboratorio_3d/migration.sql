-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Impressora` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `larguraMm` INTEGER NOT NULL,
    `profundidadeMm` INTEGER NOT NULL,
    `alturaMm` INTEGER NOT NULL,
    `tiposCompativeis` JSON NOT NULL,

    UNIQUE INDEX `Impressora_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Material` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `cor` VARCHAR(191) NOT NULL,
    `estoqueGramas` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `solicitante` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `larguraMm` INTEGER NOT NULL,
    `profundidadeMm` INTEGER NOT NULL,
    `alturaMm` INTEGER NOT NULL,
    `materialId` INTEGER NOT NULL,
    `consumoGramas` INTEGER NOT NULL,
    `status` ENUM('PENDENTE', 'EM_IMPRESSAO', 'CONCLUIDO') NOT NULL DEFAULT 'PENDENTE',
    `impressoraId` INTEGER NULL,
    `iniciadoEm` DATETIME(3) NULL,
    `concluidoEm` DATETIME(3) NULL,

    INDEX `Pedido_impressoraId_status_idx`(`impressoraId`, `status`),
    INDEX `Pedido_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_impressoraId_fkey` FOREIGN KEY (`impressoraId`) REFERENCES `Impressora`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
