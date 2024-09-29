import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../modells/user.js";

const generateAccessandRefreshTokens = async (id) => {
  try {
    const user = await User.findById(id);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiErrors(
      500,
      "something went wrong while generating refreshtoken and accesstoken"
    );
  }
};

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

const registerUser = asyncHandler(async (req, res) => {
  const { usrName, email, fullName, password } = req.body;

  if (
    [usrName, email, fullName, password].some((field) => field.trim() === "")
  ) {
    throw new ApiErrors(400, "all fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ usrName }, { email }] });
  if (existedUser) {
    throw new ApiErrors(
      400,
      "the user allready eists use another email and username"
    );
  }

  console.table("dfd heelooll");

  let avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiErrors(400, "avatar image is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  // if (
  //   req.files &&
  //   Array.isArray(req.files.avatar) &&
  //   req.files.avatar.length > 0
  // ) {
  //   avatarLocalPath = req.files?.avatar[0]?.path;
  // }

  // if (!avatarLocalPath == "") {
  //   avatar = await uploadOnCloudinary(avatarLocalPath);
  //   if (!avatar) {
  //     throw new ApiErrors(400, "file is not uplodede successfully");
  //   }
  // }

  const user = await User.create({
    usrName: usrName.toLowerCase(),
    email,
    fullName,
    password,
    avatar: avatar?.url,
  });

  const createduser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createduser) {
    throw new ApiErrors(400, "something wemt wrong while registering the user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, createduser, "the user registered successfolly")
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { usrName, email, password } = req.body;

  if ([usrName, email, password].some((field) => field.trim() === "")) {
    throw new ApiErrors(400, "all fiels are required");
  }

  const user = await User.findOne({ $or: [{ usrName }, { email }] });

  if (!user) {
    throw new ApiErrors(400, "user does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiErrors(400, "wrong password ");
  }

  const { accessToken, refreshToken } = generateAccessandRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, loggedInUser, "logged-in successfully "));
});

export { registerUser, loginUser };
