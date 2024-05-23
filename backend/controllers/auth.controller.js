import { SCOPE } from "../constants/index.js";
import { User } from "../models/user.model.js";
import { getUserDetails } from "../services/google.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authorizeClient } from "../utils/index.js";

export const login = asyncHandler(async (req, res) => {
  const { googleAccessToken } = req.body;

  try {
    const userDetails = await getUserDetails(googleAccessToken);

    const existingUser = await User.findOne({ email: userDetails?.email });

    if (!existingUser) {
      const newUser = await User.create({
        googleId: userDetails?.sub,
        firstName: userDetails?.given_name,
        lastName: userDetails?.family_name,
        email: userDetails?.email,
        profilePicture: userDetails?.picture,
        googleAccessToken,
      });

      let accessToken = newUser.generateAccessToken();

      return res
        .status(201)
        .json(new ApiResponse(201, { user: newUser, accessToken }));
    }

    existingUser.googleAccessToken = googleAccessToken;
    await existingUser.save();

    let accessToken = existingUser.generateAccessToken();

    res
      .status(200)
      .json(new ApiResponse(200, { user: existingUser, accessToken }));
  } catch (error) {
    res
      .status(400)
      .json(
        new ApiError(400, "Something went wrong while login" + error, error)
      );
  }
});

export const logout = asyncHandler(async (req, res) => {
  const oAuth2Client = authorizeClient(req.user.googleAccessToken);
  try {
    await oAuth2Client.revokeCredentials();

    await User.findByIdAndUpdate(req.user._id, {
      $set: { googleAccessToken: null },
    });

    res.status(200).json(new ApiResponse(200, {}, "Access revoked"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, {}, "Failed to revoke access"));
  }
});
