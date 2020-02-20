import { createLogger, format, LoggerOptions, transports } from "winston";
const Logger = createLogger();
const options: LoggerOptions = {
    format: format.combine(
        format.prettyPrint(),
        format.json()
    ),
    transports: [
        new transports.Console({
            level: process.env.NODE_ENV === "production" ? "error" : "debug"
        }),
        new transports.File({ filename: "debug.log", level: "debug" })
    ]
};

const logger = new Logger(options);

if (process.env.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level");
}


export default logger;