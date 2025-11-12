// infrastructure/repository/WalletRepository.ts
import { IWalletRepository } from "../ports/IWalletRepository.js";
import { Wallet } from "../domain/entities/Wallet.js";
import { Prisma } from "@prisma/client";
import { ConcurrencyError } from "../domain/errors/concurrencyError.js";

export class WalletRepository implements IWalletRepository {
  async findById(id: string): Promise<Wallet | null> {
    const walletData = await prisma.wallet.findUnique({
      where: { id },
    });

    if (!walletData) return null;

    return Wallet.toEntity(walletData);
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    const walletData = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!walletData) return null;

    return Wallet.toEntity(walletData);
  }

  async save(wallet: Wallet): Promise<Wallet> {
    const state = wallet.getState();

    try {
      const updatedWallet = await prisma.wallet.update({
        where: {
          id: state.id,
          version: state.version - 1, // Expect the previous version
        },
        data: {
          balanceCents: state.balanceCents,
          reservedCents: state.reservedCents,
          version: state.version, // New version
          updatedAt: state.updatedAt,
        },
      });

      return Wallet.toEntity(updatedWallet);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw ConcurrencyError.walletModified();
      }
      throw error;
    }
  }

  async updateWithVersion(wallet: Wallet): Promise<Wallet> {
    const state = wallet.getState();

    try {
      const updatedWallet = await prisma.wallet.update({
        where: {
          id: state.id,
          version: state.version - 1, // Expect the previous version
        },
        data: {
          balanceCents: state.balanceCents,
          reservedCents: state.reservedCents,
          version: state.version, // New version
          updatedAt: new Date(),
        },
      });

      return Wallet.toEntity(updatedWallet);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw ConcurrencyError.walletModified();
      }
      throw error;
    }
  }

  async updateBalance(walletId: string, amount: number): Promise<Wallet> {
    const updatedWallet = await prisma.wallet.update({
      where: { id: walletId },
      data: {
        balanceCents: { increment: amount },
        version: { increment: 1 }, // Increment version
        updatedAt: new Date(),
      },
    });

    return Wallet.toEntity(updatedWallet);
  }
}
