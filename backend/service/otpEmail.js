const siteUrl = process.env.FRONTEND_URL;
const logoUrl = `${process.env.FRONTEND_URL}/logo.png`; 

export const getOtpEmailHtml = (otp, userNameOrEmail = "") => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7faff; padding: 24px; border-radius: 12px; color:#4267B2; max-width:500px; margin:auto;">
    <div style="text-align:center; margin-bottom:20px;">
      <img src="${logoUrl}" alt="MedHaven Logo" style="height:64px; margin-bottom:8px;" />
      <h2>Verify Your Email – MedHaven</h2>
    </div>
    <p>Hello${userNameOrEmail ? ", " + userNameOrEmail : ""},</p>
    <p>Your one-time password for completing registration at <a href="${siteUrl}" style="color:#4267B2; text-decoration:underline;">MedHaven</a> is:</p>
    <div style="background:#e9f7fe; border-radius:8px; padding:16px; margin:16px 0; text-align:center; font-size:28px; letter-spacing:2px; font-weight:bold;">
      ${otp}
    </div>
    <p>This OTP will expire in 5 minutes.</p>
    <a href="${siteUrl}" style="display:inline-block; margin:16px 0 8px 0; padding:10px 24px; background:#4267B2; color:#fff; border-radius:6px; text-decoration:none; font-weight:500;">Go to MedHaven</a>
    <hr style="margin:24px 0; border:none; border-top:1px solid #bdd5fd;" />
    <footer style="font-size:15px; color:#555; text-align:center;">
      <p>Best regards,</p>
      <p><strong>MedHaven Team</strong></p>
      <p>
        <a href="${siteUrl}" style="color:#4267B2; text-decoration:underline;">${siteUrl}</a>
      </p>
      <p style="margin-top:8px;">
        <img src="${logoUrl}" alt="MedHaven Logo" style="height:32px; vertical-align:middle;" />
      </p>
    </footer>
  </div>
`;
