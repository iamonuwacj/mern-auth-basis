import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./EmailTemplates.js";
import nodemailer from 'nodemailer'
import { google } from "googleapis";


// These id's and secrets should come from .env file.
const CLIENT_ID = process.env.CLIENT_ID
const CLEINT_SECRET = process.env.CLEINT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });



export const sendVerificationEmail = async (email, verificationToken) => {
	const recipient = email;

	try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: 'onuwacjtestemail@gmail.com',
              clientId: CLIENT_ID,
              clientSecret: CLEINT_SECRET,
              refreshToken: REFRESH_TOKEN,
              accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: 'onuwacjtestemail@gmail.com',
            to: recipient,
            subject: 'Verify your email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        }

        const result = await transport.sendMail(mailOptions)

		console.log("Email sent successfully", result);

	} catch (error) {
		console.error(`Error sending verification`, error);
	}
};


export const sendWelcomeEmail = async (email, name) => {
	const recipient = email;

	try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: 'onuwacjtestemail@gmail.com',
              clientId: CLIENT_ID,
              clientSecret: CLEINT_SECRET,
              refreshToken: REFRESH_TOKEN,
              accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: 'onuwacjtestemail@gmail.com',
            to: recipient,
            subject: 'Verify your email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", name),
            category: "Welcome Email"
        }

        const result = await transport.sendMail(mailOptions)

		console.log("Welcome email sent successfully", result);

	} catch (error) {
		console.error(`Error sending welcome email`, error);
	}
};


export const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = email;

  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'onuwacjtestemail@gmail.com',
          clientId: CLIENT_ID,
          clientSecret: CLEINT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
    });

    const mailOptions = {
        from: 'onuwacjtestemail@gmail.com',
        to: recipient,
        subject: 'Reset your password',
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        category: "Password Reset"
    }

    const result = await transport.sendMail(mailOptions)

console.log("Welcome email sent successfully", result);

} catch (error) {
console.error(`Error sending welcome email`, error);
}
};



export const sendResetSuccessEmail = async (email) => {
	const recipient = email ;

	try {

    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'onuwacjtestemail@gmail.com',
          clientId: CLIENT_ID,
          clientSecret: CLEINT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
    });

    const mailOptions = {
      from: 'onuwacjtestemail@gmail.com',
      to: recipient,
      subject: 'Reset your password',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset"
  }

  const result = await transport.sendMail(mailOptions)

  console.log("Welcome email sent successfully", result);

	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		// throw new Error(`Error sending password reset success email: ${error}`);
	}
};