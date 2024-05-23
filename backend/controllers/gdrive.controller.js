import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { google } from "googleapis";
import { ApiError } from "../utils/ApiError.js";
import { authorizeClient } from "../utils/index.js";

export const accessDriveFiles = asyncHandler(async function (req, res) {
  const { googleAccessToken } = req.user;
  const oAuth2Client = authorizeClient(googleAccessToken);

  const { pageSize, pageToken } = req.body;

  const drive = google.drive({ version: "v3", auth: oAuth2Client });

  try {
    const driveResponse = await drive.files.list({
      pageSize: Math.min(pageSize, 100),
      pageToken: pageToken || undefined, // Use pageToken if provided
      fields: "nextPageToken, files(id, name, mimeType, size)",
    });
    const { files, nextPageToken } = driveResponse.data;

    if (files.length) {
      res.status(200).json(new ApiResponse(200, { files, nextPageToken }));
    } else {
      res.status(200).json(new ApiResponse(200, []));
    }
  } catch (error) {
    console.error("Error accessing Drive files:", error);
    res
      .status(500)
      .json(new ApiError(500, "error while accessing drive", error.errors));
  }
});
