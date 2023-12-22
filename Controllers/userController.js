const {
  createToken,
  refreshVerifyToken,
  createRefreshToken,
} = require("../auth");
const {
  hashPassword,
  hashCompare,
  hashOTP,
  CompareOTP,
} = require("../hashPassword");
const { mailer } = require("../nodemailer");
const { uploadFile } = require("../S3");
const { ObjectId, Client, Collection } = require("../Database/mongoDb");

const userController = {
  signup: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      await Client.connect();
      const user = await Collection[0].find({ email: email }).toArray();
      if (user.length === 0) {
        await Collection[0].insertOne({
          name,
          email,
          password: await hashPassword(password),
          profile: `${process.env.AWS_CLOUDFRONT_KEY}Assets/download.png`,
          createdAt: new Date().toUTCString(),
        });
        return res.status(200).json({
          statusCode: 200,
          message: "Sign up successful.",
        });
      } else {
        return res.status(200).json({
          statusCode: 402,
          message: "User was already exist.",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    } finally {
      await Client.close();
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      await Client.connect();
      const user = await Collection[0]
        .find({
          email: email,
        })
        .toArray();
      if (user.length === 1) {
        const verify = await hashCompare(password, user[0].password);
        if (verify) {
          const accessToken = await createToken({
            email: user[0].email,
            name: user[0].name,
          });
          const refreshToken = await createRefreshToken({
            email: user[0].email,
            name: user[0].name,
            id: user[0]._id,
          });
          await Collection[0].findOneAndUpdate(
            {
              _id: new ObjectId(user[0]._id),
            },
            {
              $set: {
                token: refreshToken,
              },
            }
          );
          return res.status(200).json({
            statusCode: 200,
            message: "Log in successful.",
            userId: user[0]._id,
            accessToken,
            refreshToken,
          });
        } else {
          return res.status(200).json({
            statusCode: 400,
            message: "Invalid credentials",
          });
        }
      } else {
        return res.status(200).json({
          statusCode: 402,
          message: "User does not exist!",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    } finally {
      await Client.close();
    }
  },
  getUserAll: async (req, res) => {
    try {
      await Client.connect();
      const usersData = await Collection[0].find().toArray();
      return res.status(200).json({
        statusCode: 200,
        message: "User data fetched.",
        usersData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    } finally {
      await Client.close();
    }
  },
  getUser: async (req, res) => {
    const { id } = req.params;
    try {
      await Client.connect();
      const userData = await Collection[0]
        .find({
          _id: new ObjectId(id),
        })
        .toArray();
      return res.status(200).json({
        statusCode: 200,
        message: "User data fetched.",
        userData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    } finally {
      await Client.close();
    }
  },
  updateUser: async (req, res) => {
    const { name, profile } = req.body;
    const { id } = req.params;
    try {
      await Client.connect();
      let img;
      if (profile.includes("http")) {
        img = profile;
      } else {
        img = await uploadFile(profile, name + "profile");
      }
      await Collection[0].findOneAndUpdate(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            name: name,
            profile: img,
          },
        }
      );
      return res.status(200).json({
        statusCode: 200,
        message: "Profile updated.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    } finally {
      await Client.close();
    }
  },
  verifyEmail: async (req, res) => {
    const { email } = req.body;
    try {
      await Client.connect();
      const user = await Collection[0]
        .find({
          email: email,
        })
        .toArray();
      if (user.length === 1) {
        let OTP = "";
        let digits = "123456789";
        for (let index = 0; index < 6; index++) {
          OTP += digits[Math.floor(Math.random() * 9)];
        }
        await mailer(user[0].email, OTP);
        const hashedOTP = await hashOTP(OTP);
        await Collection[0].findOneAndUpdate(
          {
            _id: new ObjectId(user[0]._id),
          },
          {
            $set: {
              OTP: hashedOTP,
            },
          }
        );
        return res.status(200).json({
          statusCode: 200,
          message: "OTP has send successfully.",
        });
      } else {
        return res.status(200).json({
          statusCode: 402,
          message: "User not found!",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    } finally {
      await Client.close();
    }
  },
  verifyOtp: async (req, res) => {
    const { otp } = req.body;
    const { email } = req.params;
    try {
      await Client.connect();
      const user = await Collection[0]
        .find({
          email: email,
        })
        .toArray();
      if (user.length === 1) {
        const verify = await CompareOTP(otp, user[0].OTP);
        if (verify) {
          return res.status(200).json({
            statusCode: 200,
            message: "Verification successful.",
            _id: user[0]._id,
          });
        } else {
          return res.status(200).json({
            statusCode: 400,
            message: "Invalid OTP!",
          });
        }
      } else {
        return res.status(200).json({
          statusCode: 402,
          message: "User not found!",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    } finally {
      await Client.close();
    }
  },
  resetPassword: async (req, res) => {
    const { password, confirmPassword } = req.body;
    const { id } = req.params;
    try {
      await Client.connect();
      if (password === confirmPassword) {
        await Collection[0].findOneAndUpdate(
          {
            _id: new ObjectId(id),
          },
          {
            $set: {
              password: await hashPassword(password),
            },
          }
        );
        return res.status(200).json({
          statusCode: 200,
          message: "Password changed successfully.",
        });
      } else {
        return res.status(200).json({
          statusCode: 400,
          message: "Passwords does not match.",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    } finally {
      await Client.close();
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      await Client.connect();
      await Collection[0].deleteOne({
        _id: new ObjectId(id),
      });
      return res.status(200).json({
        statusCode: 200,
        message: "Account deleted.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    } finally {
      await Client.close();
    }
  },
};

module.exports = userController;
