import { Resend } from 'resend';

const ADMIN_EMAIL = 'royaldesicrew@gmail.com';
const SENDER_EMAIL = 'no-reply@royaldesicrew.com';

// Helper function to get Resend instance
const getResend = () => {
    if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY environment variable is not set');
    }
    return new Resend(process.env.RESEND_API_KEY);
};

// Send booking/inquiry email
export const sendBookingEmail = async (req, res) => {
    try {
        const resend = getResend();
        const { name, email, phone, event_type, package_type, message, form_type } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !event_type || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        const isBooking = form_type === 'booking' || package_type;
        const formTitle = isBooking ? 'Booking Inquiry' : 'Consultation Request';
        const submitButtonText = isBooking ? 'Book Now' : 'Send Inquiry';

        // We no longer format or send the admin email from the backend, 
        // as the frontend uses FormSubmit.co for admin notifications.

        // Format customer confirmation email
        const customerEmailContent = `
<p>Dear ${name},</p>
<p>Thank you for your interest in Royal Desi Crew!</p>
${
  isBooking
    ? `<p>We have successfully received your booking inquiry for:</p>
       <ul>
         <li><strong>Event Type:</strong> ${event_type}</li>
         <li><strong>Package:</strong> ${package_type}</li>
       </ul>`
    : `<p>We have successfully received your consultation request for:</p>
       <ul>
         <li><strong>Event Type:</strong> ${event_type}</li>
       </ul>`
}
<p>Our team is reviewing your details and will contact you within 24 hours to:</p>
<ul>
  <li>✓ Confirm all details</li>
  <li>✓ Discuss your event vision</li>
  <li>✓ Explore customized options</li>
  <li>✓ Answer any questions</li>
</ul>
<p>At Royal Desi Crew, your satisfaction is our top priority. With 500+ successfully executed events since 2017, you can be confident you're in expert hands.</p>
<p>We look forward to collaborating with you!</p>
<p><strong>Best regards,</strong></p>
<p>Royal Desi Crew<br>
Premium Event Management & Production<br>
📞 +91 9614028424<br>
📧 royaldesicrew@gmail.com</p>
<p><em>P.S. If you have any urgent questions before we contact you, feel free to reach out directly.</em></p>
        `;

        // Send customer confirmation email
        const customerEmailResult = await resend.emails.send({
            from: `Royal Desi Crew <${SENDER_EMAIL}>`,
            to: [email],
            subject: `We Received Your ${formTitle}!`,
            html: customerEmailContent
        });

        // Check for errors
        if (customerEmailResult.error) {
            console.error('Email sending error:', {
                customer: customerEmailResult.error
            });

            return res.status(500).json({
                success: false,
                error: 'Failed to send confirmation email. Please try again later.'
            });
        }

        console.log('✅ Email sent successfully to customer:', {
            customer: customerEmailResult.data?.id
        });

        return res.status(200).json({
            success: true,
            message: 'Email sent successfully!',
            data: {
                customerEmail: customerEmailResult.data?.id
            }
        });

    } catch (error) {
        console.error('❌ Email controller error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
};
