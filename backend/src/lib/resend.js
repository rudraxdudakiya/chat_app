import { Resend } from "resend";
import ENV from "./env.js";

const { RESEND_API_KEY } = ENV;
if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

export const resendClient = new Resend(RESEND_API_KEY);

export const sender = {
    name: ENV.EMAIL_FROM_NAME || "ChitChat Support",
    email: ENV.EMAIL_FROM || "onboarding@resend.dev"
}