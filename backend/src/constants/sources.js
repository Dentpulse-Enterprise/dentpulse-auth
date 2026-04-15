export const EXTERNAL_SOURCES = {
  dentpulse: `${process.env.DENTPULSE_BASE_URL}/admin-panel`,
  dentscale: process.env.DENTSCALE_BASE_URL,
  dentledger: process.env.DENTLEDGER_BASE_URL,
};

export const VALID_SOURCES = ["dentpulse", "dentledger", "dentscale"];

export const VALID_PERMISSIONS = ["dentpulse", "dentledger", "dentscale"];
