/*
 * GeoCreator game and creation platform.
 * Copyright (C) 2025 Isak Johansson Weckstén
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, see
 * <https://www.gnu.org/licenses/>.
 */

/**
 * Configures Helmet for security headers.
 * @module config/helmet
 */

import helmet from "helmet";
import type { IncomingMessage, ServerResponse } from "node:http";

/**
 * Configures Helmet for security headers.
 * @returns A middleware function that sets security headers.
 */
export default function (): (
  req: IncomingMessage,
  res: ServerResponse,
  next: (err?: unknown) => void,
) => void {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": [
          "'self'",
          "'sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz'",
          "https://unpkg.com/",
          "https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.umd.js",
        ],
        "img-src": ["'self'", "data:", "https://unpkg.com/"],
      },
    },
  });
}
