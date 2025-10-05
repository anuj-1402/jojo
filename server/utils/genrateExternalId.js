import crypto from "crypto";

export function generateExternalId(title, link) {
  return crypto.createHash("md5").update(`${title}-${link}`).digest("hex").slice(0, 12);
}
