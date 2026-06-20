export const staffWelcomeEmail = (
  firstName: string,
  employeeId: string,
  password: string,
  role: string,
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <div style="background-color: #1e3a5f; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #facc15; margin: 0;">KDC School System</h1>
        <p style="color: #ffffff; margin: 5px 0 0;">Karmo Development Centre</p>
      </div>

      <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
        <h2 style="color: #1e3a5f;">Welcome, ${firstName}!</h2>
        <p style="color: #374151;">
          Your ${role} account has been created on the KDC School Management System.
          Below are your login credentials — keep them safe and do not share them.
        </p>

        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 10px;"><strong style="color: #1e3a5f;">Employee ID:</strong> 
            <span style="color: #374151;">${employeeId}</span>
          </p>
          <p style="margin: 0 0 10px;"><strong style="color: #1e3a5f;">Password:</strong> 
            <span style="color: #374151;">${password}</span>
          </p>
          <p style="margin: 0;"><strong style="color: #1e3a5f;">Role:</strong> 
            <span style="color: #374151; text-transform: capitalize;">${role}</span>
          </p>
        </div>

        <div style="background-color: #fef9c3; border-left: 4px solid #facc15; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #374151;">
            <strong>Important:</strong> You will be required to change your password on first login.
            Your Employee ID is required for sensitive operations like uploading results and setting exams.
          </p>
        </div>

        <a href="${process.env.FRONTEND_URL}/login" 
           style="display: inline-block; background-color: #1e3a5f; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Login to Your Dashboard →
        </a>
      </div>

      <div style="background-color: #1e3a5f; padding: 15px; border-radius: 0 0 8px 8px; text-align: center;">
        <p style="color: #9ca3af; margin: 0; font-size: 12px;">
          © ${new Date().getFullYear()} Karmo Development Centre. All rights reserved.
        </p>
      </div>

    </div>
  `;
};
