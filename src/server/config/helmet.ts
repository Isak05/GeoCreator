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
          "'sha384-oLdnQ1gMzlJ7B7Z/Z6BN+THM/9f4ttUFMNj67N4+UMLwJsyWeY6FrmRd/9UWYjdt'",
          "'sha384-xOY5eqzqHsjfa8YYAomICWjVJ3g9q1C1tWgRF09ut5PzRJjLFSpKH7gCsIN3hKcA'",
        ],
        "img-src": ["'self'", "data:", "https://secure.gravatar.com/"],
      },
    },
  });
}
