import arcjet, { detectBot, slidingWindow } from "@arcjet/node";
import { Request, Response, NextFunction } from "express";

let ajRateLimit: any;
let ajBotProtect: any;

try {
  const key = process.env.ARCJET_KEY;
  if (key && key !== "ajkey_test_placeholder") {
    ajRateLimit = arcjet({
      key,
      characteristics: ["ip.src"],
      rules: [
        slidingWindow({ mode: "LIVE", interval: "10m", max: 5 }),
      ],
    });

    ajBotProtect = arcjet({
      key,
      rules: [
        detectBot({ mode: "LIVE", allow: [] }),
      ],
    });
  }
} catch (e) {
  console.warn("Arcjet could not be initialized. Security checks will be bypassed.");
}

export const arcjetRateLimit = async (req: Request, res: Response, next: NextFunction) => {
  if (!ajRateLimit) return next();
  try {
     const decision = await ajRateLimit.protect(req, { requested: 1 });
     if (decision.isDenied() && decision.reason.isRateLimit()) {
       res.status(429).json({ message: "Too many requests, please try again later." });
       return;
     }
  } catch (err) {
     console.error("Arcjet error in rate limiting:", err);
  }
  next();
};

export const arcjetBotProtect = async (req: Request, res: Response, next: NextFunction) => {
  if (!ajBotProtect) return next();
  try {
     const decision = await ajBotProtect.protect(req);
     if (decision.isDenied() && decision.reason.isBot()) {
       res.status(403).json({ message: "Automated bots are not allowed." });
       return;
     }
  } catch (err) {
     console.error("Arcjet error in bot protection:", err);
  }
  next();
};
