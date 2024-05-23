import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken)
      return res.status(401).json(new ApiError(401, "Unauthorized"));

    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res.status(401).json(new ApiError(401, "Invalid access token"));
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json(new ApiError(401, "Invalid access token", error));
  }
};
