export function generateOtp(): string {
  // Generates a random 6-digit number as a string
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}
