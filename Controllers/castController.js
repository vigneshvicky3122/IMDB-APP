const { uploadFile } = require("../S3");
const { ObjectId, Client, Collection } = require("../Database/mongoDb");

const castController = {
  createCast: async (req, res) => {
    const { id, createdAt, name, gender, dateOfBirth, bio, role, profile } =
      req.body;
    try {
      await Client.connect();
      let img = await uploadFile(profile, name + "profile");
      await Collection[2].insertOne({
        id,
        name,
        gender,
        dateOfBirth,
        bio,
        role,
        image: img,
        createdAt,
      });
      return res.status(201).json({
        statusCode: 200,
        message: "Profile created successfully.",
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
  getCastAll: async (req, res) => {
    try {
      await Client.connect();
      const castsData = await Collection[2].find().toArray();
      return res.status(200).json({
        statusCode: 200,
        message: "Data fetched.",
        castsData,
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
  getCast: async (req, res) => {
    const { id } = req.params;
    try {
      await Client.connect();
      const castData = await Collection[2].findOne({
        _id: id,
      });
      return res.status(200).json({
        statusCode: 200,
        message: "Data fetched.",
        castData,
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
  updateCast: async (req, res) => {
    const { name, gender, dateOfBirth, bio, role, image } = req.body;
    const { id } = req.params;
    try {
      await Client.connect();
      let img;
      if (image.includes("http")) {
        img = image;
      } else {
        img = await uploadFile(image, name + "profile");
      }
      await Collection[2].findOneAndUpdate(
        {
          id: id,
        },
        {
          $set: {
            name: name,
            gender: gender,
            dateOfBirth: dateOfBirth,
            bio: bio,
            role: role,
            image: img,
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
  deleteCast: async (req, res) => {
    const { id } = req.body;
    try {
      await Client.connect();
      await Collection[2].deleteOne({
        id: id,
      });
      return res.status(200).json({
        statusCode: 200,
        message: "Profile deleted.",
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
module.exports = castController;
