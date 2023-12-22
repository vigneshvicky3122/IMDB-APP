const bcrypt = require("bcryptjs");
const saltRound = 10;
const hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(saltRound);
  return await bcrypt.hash(password, salt);
};
const hashCompare = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
const hashOTP = async (otp) => {
  let salt = await bcrypt.genSalt(saltRound);
  return await bcrypt.hash(otp, salt);
};
const CompareOTP = async (otp, hashedOtp) => {
  return await bcrypt.compare(otp, hashedOtp);
};
module.exports = { hashPassword, hashCompare, hashOTP, CompareOTP };
