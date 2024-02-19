import Users from "../Model/userModel.js";
import bcrypt from "bcryptjs";

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await Users.findOne({ username });
    if (usernameCheck) {
      return res.status(400).json({status:400, msg: "userName already used" });
    }

    const emailCheck = await Users.findOne({ email });
    if (emailCheck) {
      return res.status(400).json({status:400, msg: "email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({
      username,
      email,
      password: hashedPassword,
    });
    delete user.password;

    if (user) {
      return res.status(201).json({
        status: 201,
        user: {
          _id: user._id,
          name: user.username,
          email: user.email,
          password: user.password,
        },
      });
    } else {
      return res.status(400);
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const LoginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ username });
    if (!user) {
      return res.status(404).json({ status:404,msg: "Incorrect username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).json({status:404, msg: "Incorrect username or password" });
    }
    delete user.password
    
    if (user) {
      return res.status(201).json({
        status: 201,
        user: {
          _id: user._id,
          name: user.username,
          password: user.password,
        },
      });
    } else {
       return res
         .status(404)
         .json({ status: 404, msg: "Incorrect username or password" });
    }
  } catch (error) {
    next(error);
    console.log(error);
     return res
       .status(404)
       .json({ status: 404, msg: "Incorrect username or password" });
  }
};

const setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image 

    const userData = await Users.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    })
    return res.status(200).json({status:200,isSet:userData.isAvatarImageSet,image:userData.avatarImage})
  } catch (error) {
    next(error)
    console.log(error)
  }
}

const getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find({ _id: { $ne: req.params._id } }).select([
      "email","username","avatarImage","_id"
    ]);
    return res.status(200).json(users)
  } catch (error) {
    next(error)
    console.log(error)
  }
}
export { registerUser, LoginUser,setAvatar,getAllUsers};
