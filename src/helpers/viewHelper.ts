import { config } from "../config.js";

export const prefixImageHost = (path: string) => `${config.fileHost}${path}`
