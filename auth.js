const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authentication = async (req, res, next) => {
  try {
    let check = JWT.verify(
      req.headers.authorization,
      process.env.ACCESS_SECRET_KEY
    );
    if (check) {
      next();
    }
  } catch (error) {
    res.status(200).json({
      statusCode: 401,
      message: "Token expired!",
    });
  }
};
const createToken = async ({ email, name }) => {
  let token = JWT.sign({ email, name }, process.env.ACCESS_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};
const refreshVerifyToken = async ({ token, email, name, id }) => {
  try {
    let check = JWT.verify(token, process.env.REFRESH_SECRET_KEY);

    let newRefreshToken = await createRefreshToken({ email, name, id });

    return { check, newRefreshToken };
  } catch (error) {
    console.log(error);
  }
};
const createRefreshToken = async ({ email, name, id }) => {
  let token = JWT.sign({ email, name, id }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};
module.exports = {
  authentication,
  createToken,
  refreshVerifyToken,
  createRefreshToken,
};
