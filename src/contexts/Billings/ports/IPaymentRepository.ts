import { Payment } from "../domain/entities/Payment.js";
import { PaymentStatus } from "../domain/entities/Payment.js";

export interface IPaymentRepository {
  findById(id: string): Promise<Payment | null>;
  findByReference(reference: string): Promise<Payment | null>;
  save(payment: Payment): Promise<Payment>;
  updateStatus(paymentId: string, status: PaymentStatus): Promise<void>;
  findPendingOlderThan(date: Date): Promise<Payment[]>;
}
