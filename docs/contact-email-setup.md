# Contact Email Setup

The contact form now sends `POST /contact` with:
- `name`
- `email`
- `reason`
- `message`

Backend Lambda:
- `backend/lambdas/send-contact-email/src/index.mjs`

## Required AWS setup

1. Deploy the new Lambda and API route:
- `POST /contact`
- `OPTIONS /contact`

2. Configure Lambda environment variables:
- `CONTACT_TARGET_EMAIL=navin.jairam@gmail.com`
- `CONTACT_SOURCE_EMAIL=navin.jairam@gmail.com`

3. SES verification:
- Verify the sender identity for `CONTACT_SOURCE_EMAIL` in SES.
- If SES account is in sandbox, verify recipient too (or move SES out of sandbox).

4. Lambda IAM permissions:
- `ses:SendEmail`
- `ses:SendRawEmail`

## Frontend behavior

Frontend calls:
- `submitContactForm()` in `frontend/src/utils/api.js`
- Contact UI in `frontend/src/pages/public/Contact.jsx`

If API route is not deployed yet, form will show an error message.
