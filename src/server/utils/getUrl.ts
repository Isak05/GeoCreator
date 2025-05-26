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
 * @module utils/getUrl
 */

import { Request } from "express";

/**
 * Constructs the full URL of an incoming HTTP request.
 * @param req - The express HTTP request object.
 * @returns The full URL as a string, including the protocol, host, and original URL path.
 */
export default function getUrl(req: Request): string {
  const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const urlWithoutTrailingSlash = url.replace(/\/$/, "");
  return urlWithoutTrailingSlash;
}
