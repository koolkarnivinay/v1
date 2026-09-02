import  SibApiV3Sdk from 'sib-api-v3-sdk';
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendVerificationEmail = async (
  toEmail: string,
  code: number
): Promise<boolean> => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { name: 'ZoDeals', email: 'lohithsairam10@gmail.com' };
    sendSmtpEmail.to = [{ email: toEmail, name: 'User' }];
    sendSmtpEmail.subject = '🔐 Your Verification Code';
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #007bff;">ZoDeals OTP Verification</h2>
        <p>Your verification code is:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
        <p>This OTP is valid for 10 minutes.</p>
        <hr>
        <p style="font-size: 12px; color: #888;">Do not reply to this email.</p>
      </div>
    `;

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return true;
  } catch (error: any) {
    console.log('Failed to send OTP emai', error?.response?.body || error.message);
    return false;
  }
};
