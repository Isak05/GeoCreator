/**
 * Configures Helmet for security headers.
 *
 * @module config/helmet
 * @author Isak Johansson Weckstén <ij222pv.student.lnu.se>
 */

import helmet from "helmet";
import type { IncomingMessage, ServerResponse } from "node:http";

export default function (): (
  req: IncomingMessage,
  res: ServerResponse,
  next: (err?: unknown) => void
) => void {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": [
          "'self'",
          "'sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz'",
          "https://unpkg.com/",
        ],
        "img-src": ["'self'", "data:", "https://unpkg.com/"],
      },
    },
  });
}
