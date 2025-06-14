# EmailJS Setup Guide for ShapeUp Contact Form

## Overview

The contact form has been updated to use EmailJS for sending emails directly from the frontend. Follow these steps to complete the setup.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (allows 200 emails/month)
3. Verify your email address

## Step 2: Add Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for business)
   - **Outlook/Hotmail**
   - **Yahoo**
   - **Custom SMTP** (for business email like shapeup162@gmail.com)
4. Follow the setup instructions for your chosen provider
5. **Important**: Note down your **Service ID** (e.g., `service_abc123`)

### For Gmail Setup:

- Use your Gmail account (shapeup162@gmail.com)
- You may need to enable "Less secure app access" or use App Passwords
- For business accounts, consider using OAuth2

## Step 3: Create Email Template

1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Use this template structure:

```
Subject: New Contact Form Submission - {{subject}}

From: {{from_name}}
Email: {{from_email}}
Phone: {{phone_number}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from the ShapeUp Gym contact form.
```

4. **Template Variables** (these match the form field names):

   - `{{from_name}}` - Customer's name
   - `{{from_email}}` - Customer's email
   - `{{phone_number}}` - Customer's phone
   - `{{subject}}` - Message subject
   - `{{message}}` - Customer's message

5. **Important**: Note down your **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `abcDEF123ghiJKL`)
3. This is used for client-side authentication

## Step 5: Update Contact Page Code

Replace the placeholder values in `/src/app/[locale]/contact/page.tsx`:

```typescript
// EmailJS configuration - REPLACE THESE PLACEHOLDERS
const serviceId = "YOUR_SERVICE_ID"; // Replace with your Service ID
const templateId = "YOUR_TEMPLATE_ID"; // Replace with your Template ID
const publicKey = "YOUR_PUBLIC_KEY"; // Replace with your Public Key
```

**Example:**

```typescript
const serviceId = "service_abc123";
const templateId = "template_xyz789";
const publicKey = "abcDEF123ghiJKL";
```

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the contact page: `http://localhost:3000/contact`
3. Fill out and submit the contact form
4. Check your email inbox for the test message
5. Check browser console for any errors

## Step 7: Configure Email Settings (Optional)

### Auto-Reply Setup:

1. Create a second template for auto-replies to customers
2. Set up a second EmailJS call to send confirmation emails

### Email Filtering:

- Set up email filters in your Gmail to organize contact form submissions
- Create labels like "Website Inquiries" for better organization

## Troubleshooting

### Common Issues:

1. **"Failed to send message"**

   - Check Service ID, Template ID, and Public Key are correct
   - Verify email service is properly connected
   - Check browser console for detailed error messages

2. **Emails not received**

   - Check spam/junk folder
   - Verify template variables match form field names
   - Test with a different email address

3. **Rate Limiting**
   - Free plan allows 200 emails/month
   - Consider upgrading for higher volume

### Form Field Mapping:

The form uses these EmailJS template variables:

- `from_name` → Customer's full name
- `from_email` → Customer's email address
- `phone_number` → Customer's phone number
- `subject` → Message subject
- `message` → Customer's message content

## Security Notes

- Public Key is safe to use in frontend code
- Never expose your Private Key in client-side code
- Consider implementing rate limiting for production
- Add CAPTCHA for spam protection if needed

## Production Deployment

1. Ensure all placeholder values are replaced
2. Test thoroughly in staging environment
3. Monitor email delivery rates
4. Set up email notifications for form submissions

## Support

- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: Available through their dashboard
- For ShapeUp-specific issues: Check browser console and network tab

---

**Next Steps After Setup:**

1. Replace placeholder values in contact page
2. Test form submission
3. Configure email organization/filtering
4. Consider adding auto-reply functionality
5. Monitor form usage and email delivery
