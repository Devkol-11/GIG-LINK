import { emailTransporter } from "../email/EmailTransporter";

(async () => {
  try {
    const email = "test@gmail.com";
    const subject = "🎉 Test Email from GIG-LINK API";
    const message = `
          <h2>Welcome to GIG-LINK!</h2>
          <p>This is a the third test email to confirm your EmailService is working correctly.</p>
          <p>🚀 Sent at: ${new Date().toLocaleString()}</p>
        `;

    await emailTransporter.sendEmail(email, subject, message);
    console.log("Email sending working");
  } catch (error) {
    console.error("Failed to send email", error);
  }
})();
