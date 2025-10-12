export interface IEmailService {
  sendEmail(to: string, subject: string, message: string): Promise<void>;
}
