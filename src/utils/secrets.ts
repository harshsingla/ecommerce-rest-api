import dotenv from "dotenv";

import fs from "fs";

if (fs.existsSync(".env")) {
    console.log("Using .env file to supply config environment variables");
    dotenv.config({path: ".env"});
} else if (fs.existsSync(".env.production")) {
    console.log("Using .env file to supply config environment variables");
    dotenv.config({path: ".env.production"});
} else {
    console.log("Using .env.dev file to supply config environment variables");
    dotenv.config({path: ".env.dev"});  // you can delete this after you create your own .env file!
}

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGODB_URI = prod ? process.env["MONGODB_URI"] : process.env["MONGODB_URI_LOCAL"];

if (!SESSION_SECRET) {
    console.log("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}
