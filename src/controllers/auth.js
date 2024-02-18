const bcrypt = require("bcrypt");
const db = require("../core/config/db");
const User = db.user;

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ where: { phone: phone } });
    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid phone number and password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid phone number and password." });
    // await User.updateOne(
    //   { email },
    //   { status: "active" },
    //   { returnOriginal: false }
    // );
    // const token = createAccessToken({
    //   id: user._id,
    //   role: user.role,
    //   username: user.username,
    // });

    // const refresh_token = createRefreshToken({ id: user._id });
    // res.cookie("refreshtoken", refresh_token, {
    //   httpOnly: true,
    //   path: "/user/refresh_token",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });

    return res.send(user);
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.register = async (req, res) => {
  try {
    console.log(req.body);
    const { first_name, last_name, password, storename, phone } = req.body;

    if (!first_name || !last_name || !phone || !password || !storename) {
      return res.status(400).json({
        message: "Please fill in all fields, one or more fields are empty!",
      });
    }
    const user = await User.findOne({ where: { phone: phone } });
    if (user)
      return res.status(400).json({
        message:
          "This phone number already exists, please use another phone number!",
      });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be atleaast 6 characters long!" });

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = {
      first_name,
      last_name,
      password: passwordHash,
      phone,
      storename,
    };
    let user_ = new User(newUser);
    await user_.save();
    res
      .status(200)
      .json({ message: "Registration Successful, Please proceed to login" });
  } catch (err) {
    console.log("error o");
    return res.status(500).json({ message: err.message });
  }
};
