const User = require("../models/usersModel");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        msg: "Incorrect Password And Username..!",
        status: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        msg: "Incorrect Password and Username..!",
        status: false,
      });
    }

    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {

  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {

  try {

    const { SelectedAvatar, _id } = req.body;

    const avtarModifiedCheck = await User.findByIdAndUpdate(
      _id,
      { isAvatarImageSet: true, AvtarImage: SelectedAvatar },
      { new: true, runValidators: true, returnDocument: 'after' }
    )

    if (avtarModifiedCheck !== null) {
      return res.json({ status: true, avtarModifiedCheck });
    } else {
      return res.json({ msg: "Image is not Saved", status: false });
    }

  } catch (ex) {
    next(ex);
  }

}

module.exports.getAllUsers = async (req, res, next) => {

  try {

    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username", 
      "AvtarImage", 
      "_id"
    ]);

    return res.json(users)

  } catch (ex) {
    next(ex)
  }


}