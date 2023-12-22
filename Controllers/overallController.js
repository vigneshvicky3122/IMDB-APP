const { uploadFile } = require("../S3");
const { ObjectId, Client, Collection } = require("../Database/mongoDb");

const overallController = {
  getOverall: async (req, res) => {
    try {
      await Client.connect();
      const moviesData = await Collection[1].find().toArray();
      const castsData = await Collection[2].find().toArray();
      return res.status(200).json({
        statusCode: 200,
        message: "Data fetched.",
        moviesData,
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
};
module.exports = overallController;
