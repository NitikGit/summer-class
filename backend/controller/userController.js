const User = require("../model/userModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Profile = require("../model/ProfileModel");

async function createUserController(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All Fields are required",
    });
  }

  const checkUser = await User.findOne({ email });
  if (checkUser) {
    return res.status(400).json({
      message: "User with this email already exists",
    });
  }

  const encryptPassword = await bcrypt.hash(password, 10);

  const data = {
    name,
    email,
    password: encryptPassword,
  };

  const user = new User(data);
  await user.save();

  const profileData = {
    user: user?._id,
    bio: "",
    profilePicture: "",
    skills: [],
    github: "",
    linkedin: "",
    portfolioUrl: "",
  };
  const profile = new Profile(profileData);
  await profile.save();

  res.status(201).json({
    message: "User Created",
    user: user,
  });
}

async function loginHandleController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All Fields are required",
    });
  }

  const checkUser = await User.findOne({ email }).select("+password");
  if (!checkUser) {
    return res.status(400).json({
      message: "User with this email does not exist",
    });
  }

  const comparePassword = await bcrypt.compare(password, checkUser.password);
  if (comparePassword) {
    const token = jwt.sign(
  {
    id: checkUser._id,
    role: checkUser.role,
  },
  process.env.JWT_SECRET, // <--- must match .env
  { expiresIn: "1h" }
);


    res.status(200).json({
      message: "Login Successful",
      accessToken: token,
    });
  } else {
    return res.status(400).json({
      message: "Invalid Credentials",
    });
  }
}

async function getUserListController(req, res) {
  const userList = await User.find();

  res.status(200).json({
    message: "User List",
    users: userList,
  });
}

async function updateProfileMeController(req, res) {
  const { id } = req.user;

  const { name, email, bio, skills, github, linkedin, portfolioUrl } = req.body;

  if (name || email) {
    await User.findByIdAndUpdate(id, {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
    });
  }

  // skills can come as comma-separated string or array of names
  let skillArray = [];
  if (Array.isArray(skills)) {
    skillArray = skills.map((s) => ({ name: String(s), level: "Beginner" }));
  } else if (typeof skills === "string") {
    skillArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({ name, level: "Beginner" }));
  }

  const picturePath = req.file ? `/uploads/profile/${req.file.filename}` : undefined;

  const update = {
    ...(bio !== undefined ? { bio } : {}),
    ...(github !== undefined ? { github } : {}),
    ...(linkedin !== undefined ? { linkedin } : {}),
    ...(portfolioUrl !== undefined ? { portfolioUrl } : {}),
    ...(skillArray.length ? { skills: skillArray } : {}),
    ...(picturePath ? { profilePicture: picturePath } : {}),
  };

  const profile = await Profile.findOneAndUpdate({ user: id }, update, {
    new: true,
    upsert: true,
  });

  const user = await User.findById(id).select("name email role");

  res.status(200).json({ user, profile });
}

async function viewMyProfileController(req, res) {
  const { id } = req.user;

  const user = await User.findById(id).select("name email role");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const profile = await Profile.findOne({ user: id }).lean();

  return res.status(200).json({
    user,
    profile: profile || {
      bio: "",
      profilePicture: "",
      skills: [],
      github: "",
      linkedin: "",
      portfolioUrl: "",
    },
  });
}

async function viewProfileofUserController(req, res) {
  const { id } = req.params;

  // same logic
}

module.exports = {
  createUserController,
  loginHandleController,
  getUserListController,
  updateProfileMeController,
  viewMyProfileController,
  viewProfileofUserController,
};