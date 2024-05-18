import { registerOTel } from "@vercel/otel";
import * as Sentry from "@sentry/nextjs";

export function register() {
  registerOTel("next-app");

  Sentry.init({
    dsn: "https://408cdc47643e5237a1f706c6cfef8a4f@o4507170898444288.ingest.us.sentry.io/4507170904866816",

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: process.env.NODE_ENV === 'development',
  });
}
