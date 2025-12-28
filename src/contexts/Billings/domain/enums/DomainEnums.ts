import { $Enums } from 'prisma/generated/prisma/client.js';

//Wallet-Status
export type WalletStatusType = $Enums.WalletStatus;
export const WalletStatus = $Enums.WalletStatus;

//Payment-Provider
export type PaymentProviderType = $Enums.PaymentProvider;
export const PaymentProvider = $Enums.PaymentProvider;

//Payment-Direction
export type PaymentDirectionType = $Enums.PaymentDirection;
export const PaymentDirection = $Enums.PaymentDirection;

//Payment-Status
export type PaymentStatusType = $Enums.PaymentStatus;
export const PaymentStatus = $Enums.PaymentStatus;

//Payment-Channel
export type PaymentChannelType = $Enums.PaymentChannel;
export const PaymentChannel = $Enums.PaymentChannel;

//Transaction-Type
export type TransactionType_Type = $Enums.TransactionType;
export const TransactionType = $Enums.TransactionType;

//Transaction-Status
export type TransactionStatusType = $Enums.TransactionStatus;
export const TransactionStatus = $Enums.TransactionStatus;

//Transaction-Source
export type TransactionSourceType = $Enums.TransactionSource;
export const TransactionSource = $Enums.TransactionSource;

//Escrow-Status
export type EscrowStatusType = $Enums.EscrowStatus;
export const EscrowStatus = $Enums.EscrowStatus;

//Escrow-Transaction
export type EscrowTransactionType = $Enums.EscrowTransactionType;
export const EscrowTransaction = $Enums.EscrowTransactionType;

//Transaction-metadata
export type TransactionMetadata = string | number | boolean | Record<string, any> | any[] | null;
