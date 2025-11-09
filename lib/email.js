import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL = 'BuildConnect <onboarding@resend.dev>'; // Use your verified domain in production
const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

/**
 * Send email notification when a new bid is received on a project
 * @param {Object} builder - Builder user object with email and full_name
 * @param {Object} project - Project object with id and title
 * @param {Object} bid - Bid object with quoted_price and contractor info
 */
export async function sendBidReceivedEmail(builder, project, bid) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: builder.email,
      subject: `New bid received on "${project.title}"`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
              .bid-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .price { font-size: 24px; font-weight: bold; color: #2563eb; }
              .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 New Bid Received!</h1>
              </div>
              <div class="content">
                <p>Hello ${builder.full_name},</p>
                <p>Great news! A contractor has submitted a bid on your project: <strong>${project.title}</strong></p>

                <div class="bid-details">
                  <h3>Bid Summary</h3>
                  <p><strong>Contractor:</strong> ${bid.contractor_name || 'Contractor'}</p>
                  <p><strong>Bid Amount:</strong> <span class="price">₹${bid.quoted_price?.toLocaleString()}</span></p>
                  <p><strong>Estimated Duration:</strong> ${bid.estimated_duration} days</p>
                </div>

                <p>Review the complete bid proposal and contractor profile to make an informed decision.</p>

                <a href="${BASE_URL}/builder/projects/${project.id}" class="button">View Bid Details</a>

                <div class="footer">
                  <p>© 2025 BuildConnect. Connecting construction professionals.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending bid received email:', error);
      return { success: false, error };
    }

    console.log('Bid received email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending bid received email:', error);
    return { success: false, error };
  }
}

/**
 * Send email notification when a bid is accepted
 * @param {Object} contractor - Contractor user object with email and full_name
 * @param {Object} project - Project object with id, title, and builder info
 * @param {Object} bid - Bid object with quoted_price
 */
export async function sendBidAcceptedEmail(contractor, project, bid) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: contractor.email,
      subject: `🎉 Congratulations! Your bid has been accepted`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #f0fdf4; padding: 30px; border-radius: 0 0 8px 8px; }
              .project-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .price { font-size: 24px; font-weight: bold; color: #16a34a; }
              .button { display: inline-block; background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
              .next-steps { background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #f59e0b; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Bid Accepted!</h1>
              </div>
              <div class="content">
                <p>Congratulations ${contractor.full_name}!</p>
                <p>Your bid has been accepted for the project: <strong>${project.title}</strong></p>

                <div class="project-details">
                  <h3>Project Award Details</h3>
                  <p><strong>Project:</strong> ${project.title}</p>
                  <p><strong>Location:</strong> ${project.city}</p>
                  <p><strong>Your Bid Amount:</strong> <span class="price">₹${bid.quoted_price?.toLocaleString()}</span></p>
                  <p><strong>Builder:</strong> ${project.builder_name || 'Builder'}</p>
                  <p><strong>Builder Contact:</strong> ${project.builder_phone || 'Available in dashboard'}</p>
                </div>

                <div class="next-steps">
                  <h4>📋 Next Steps:</h4>
                  <ol>
                    <li>Review the complete project details</li>
                    <li>Contact the builder to finalize the agreement</li>
                    <li>Prepare your team and resources</li>
                    <li>Begin work as per the agreed timeline</li>
                  </ol>
                </div>

                <a href="${BASE_URL}/contractor/bids" class="button">View Project Details</a>

                <div class="footer">
                  <p>© 2025 BuildConnect. Connecting construction professionals.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending bid accepted email:', error);
      return { success: false, error };
    }

    console.log('Bid accepted email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending bid accepted email:', error);
    return { success: false, error };
  }
}

/**
 * Send email notification when a bid is rejected
 * @param {Object} contractor - Contractor user object with email and full_name
 * @param {Object} project - Project object with id and title
 */
export async function sendBidRejectedEmail(contractor, project) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: contractor.email,
      subject: `Update on your bid for "${project.title}"`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #64748b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
              .encouragement { background-color: #e0f2fe; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #0284c7; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Bid Update</h1>
              </div>
              <div class="content">
                <p>Hello ${contractor.full_name},</p>
                <p>Thank you for submitting your bid on <strong>${project.title}</strong>.</p>
                <p>We regret to inform you that your bid was not selected for this project. The builder has chosen to proceed with a different contractor.</p>

                <div class="encouragement">
                  <h4>💪 Keep Going!</h4>
                  <p>Don't be discouraged! There are many more opportunities waiting for you on BuildConnect.</p>
                  <p>Continue building your profile, showcasing your expertise, and bidding on projects that match your skills.</p>
                </div>

                <a href="${BASE_URL}/contractor/projects" class="button">Browse More Projects</a>

                <div class="footer">
                  <p>© 2025 BuildConnect. Connecting construction professionals.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending bid rejected email:', error);
      return { success: false, error };
    }

    console.log('Bid rejected email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending bid rejected email:', error);
    return { success: false, error };
  }
}

/**
 * Send email notification when a new project matching contractor's specialization is posted
 * @param {Object} contractor - Contractor user object with email and full_name
 * @param {Object} project - Project object with id, title, and details
 */
export async function sendNewProjectNotification(contractor, project) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: contractor.email,
      subject: `New project opportunity in ${project.city}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #f97316; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #fff7ed; padding: 30px; border-radius: 0 0 8px 8px; }
              .project-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .button { display: inline-block; background-color: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
              .urgent { background-color: #fee2e2; padding: 10px; border-radius: 6px; margin: 10px 0; border-left: 4px solid #dc2626; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏗️ New Project Alert!</h1>
              </div>
              <div class="content">
                <p>Hello ${contractor.full_name},</p>
                <p>A new project matching your specializations has been posted!</p>

                <div class="project-details">
                  <h3>${project.title}</h3>
                  <p><strong>Location:</strong> ${project.city}</p>
                  <p><strong>Budget:</strong> ₹${project.budget_min?.toLocaleString()} - ₹${project.budget_max?.toLocaleString()}</p>
                  <p><strong>Duration:</strong> ${project.duration_days} days</p>
                  <p><strong>Required Skills:</strong> ${project.required_specializations?.join(', ')}</p>
                </div>

                <div class="urgent">
                  <strong>⏰ Act Fast!</strong> Submit your bid before the deadline to be considered.
                </div>

                <a href="${BASE_URL}/contractor/projects/${project.id}" class="button">View Project & Submit Bid</a>

                <div class="footer">
                  <p>© 2025 BuildConnect. Connecting construction professionals.</p>
                  <p style="font-size: 12px; margin-top: 10px;">
                    <a href="${BASE_URL}/contractor/profile" style="color: #64748b;">Update notification preferences</a>
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending new project notification:', error);
      return { success: false, error };
    }

    console.log('New project notification sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending new project notification:', error);
    return { success: false, error };
  }
}

/**
 * Send welcome email to new users
 * @param {Object} user - User object with email, full_name, and user_type
 */
export async function sendWelcomeEmail(user) {
  const isBuilder = user.user_type === 'builder';

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `Welcome to BuildConnect! 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #eff6ff; padding: 30px; border-radius: 0 0 8px 8px; }
              .steps { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .step { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .step:last-child { border-bottom: none; }
              .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to BuildConnect! 🏗️</h1>
              </div>
              <div class="content">
                <p>Hello ${user.full_name},</p>
                <p>Welcome to BuildConnect, the digital platform connecting construction professionals!</p>

                <div class="steps">
                  <h3>🚀 Getting Started ${isBuilder ? 'as a Builder' : 'as a Contractor'}</h3>
                  ${isBuilder ? `
                    <div class="step">1️⃣ <strong>Post Your First Project:</strong> Create detailed project listings with requirements</div>
                    <div class="step">2️⃣ <strong>Receive Bids:</strong> Qualified contractors will submit competitive proposals</div>
                    <div class="step">3️⃣ <strong>Review & Award:</strong> Compare bids and select the best contractor</div>
                    <div class="step">4️⃣ <strong>Build Together:</strong> Execute your project with confidence</div>
                  ` : `
                    <div class="step">1️⃣ <strong>Complete Your Profile:</strong> Add your specializations and experience</div>
                    <div class="step">2️⃣ <strong>Browse Projects:</strong> Find projects matching your skills</div>
                    <div class="step">3️⃣ <strong>Submit Bids:</strong> Propose your price and timeline</div>
                    <div class="step">4️⃣ <strong>Win Projects:</strong> Build your reputation and grow your business</div>
                  `}
                </div>

                <a href="${BASE_URL}/${isBuilder ? 'builder' : 'contractor'}/dashboard" class="button">Go to Dashboard</a>

                <div class="footer">
                  <p>© 2025 BuildConnect. Connecting construction professionals.</p>
                  <p style="font-size: 12px; margin-top: 10px;">Need help? Reply to this email for support.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    console.log('Welcome email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}
