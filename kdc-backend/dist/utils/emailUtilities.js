import { Resend } from 'resend';
export const sendEmail = async (options) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });
};
//# sourceMappingURL=emailUtilities.js.map