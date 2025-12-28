export class Html_Templates {
        private getEmailTemplate(content: string): string {
                return `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Gig Link</title>
                        </head>
                        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; background-color: #f5f7fa;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f7fa;">
                                        <tr>
                                                <td align="center" style="padding: 40px 20px;">
                                                        <!-- Main container -->
                                                        <table width="100%" max-width="600px" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                                                                
                                                                <!-- Header -->
                                                                <tr>
                                                                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                                                                                <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">GIG LINK</h1>
                                                                                <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500;">Your Gateway to Opportunity</p>
                                                                        </td>
                                                                </tr>
                                                                
                                                                <!-- Content -->
                                                                <tr>
                                                                        <td style="padding: 40px 30px;">
                                                                                ${content}
                                                                        </td>
                                                                </tr>
                                                                
                                                                <!-- Footer -->
                                                                <tr>
                                                                        <td style="padding: 30px; border-top: 1px solid #e8ecf1; text-align: center; background-color: #f9fafb;">
                                                                                <p style="margin: 0 0 12px 0; color: #64748b; font-size: 13px; line-height: 1.6;">© 2025 Gig Link. All rights reserved.</p>
                                                                                <p style="margin: 0; color: #94a3b8; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
                                                                        </td>
                                                                </tr>
                                                        </table>
                                                </td>
                                        </tr>
                                </table>
                        </body>
                        </html>
                `;
        }

        generateWelcomeEmail(firstName: string, role: string) {
                const roleDisplayName = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
                const content = `
                        <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 24px; font-weight: 600;">Welcome to Gig Link, ${firstName}! 🎉</h2>
                        <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">We're thrilled to have you join our community. Your account has been successfully created as a <strong style="color: #667eea;">${roleDisplayName}</strong>.</p>
                        
                        <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">Get started by exploring opportunities that match your skills and experience:</p>
                        
                        <!-- CTA Button -->
                        <div style="text-align: center; margin: 32px 0;">
                                <a href="${process.env.FRONTEND_URL || 'https://giglink.com'}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; transition: all 0.3s ease;">
                                        Get Started
                                </a>
                        </div>
                        
                        <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">If you have any questions or need assistance, our support team is here to help.</p>
                        
                        <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 500;">Best regards,<br/>The Gig Link Team</p>
                `;
                return {
                        subject: 'Welcome to Gig Link! 🚀',
                        body: this.getEmailTemplate(content)
                };
        }

        generateOtpEmail(otp: string) {
                const content = `
                        <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 24px; font-weight: 600;">Password Reset Request</h2>
                        <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">We received a request to reset your password. Use the code below to proceed:</p>
                        
                        <!-- OTP Code Box -->
                        <div style="background: #f1f5f9; border-left: 4px solid #667eea; padding: 20px; border-radius: 6px; margin: 24px 0; text-align: center;">
                                <p style="margin: 0 0 12px 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Your Reset Code</p>
                                <p style="margin: 0; color: #1e293b; font-size: 36px; font-weight: 700; letter-spacing: 4px; font-family: 'Courier New', monospace;">${otp}</p>
                                <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 12px;">This code expires in 10 minutes</p>
                        </div>
                        
                        <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">Enter this code to create a new password. If you didn't request this, please ignore this email.</p>
                        
                        <div style="background: #fef08a; border-radius: 6px; padding: 16px; margin: 24px 0;">
                                <p style="margin: 0; color: #854d0e; font-size: 13px; line-height: 1.6;">⚠️ <strong>Security Tip:</strong> Never share this code with anyone. Gig Link staff will never ask for it.</p>
                        </div>
                        
                        <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 500;">Best regards,<br/>The Gig Link Team</p>
                `;
                return {
                        subject: 'Password Reset Code - Gig Link',
                        body: this.getEmailTemplate(content)
                };
        }
}

export const html_templates = new Html_Templates();
