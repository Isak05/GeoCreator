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
