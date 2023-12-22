const { uploadFile } = require("../S3");
const { ObjectId, Client, Collection } = require("../Database/mongoDb");

const movieController = {
  createMovie: async (req, res) => {
    const { id, name, yearOfRelease, plot, actors, poster, banner, producer } =
      req.body;
    try {
      await Client.connect();
      let posterImg = await uploadFile(poster, name + yearOfRelease + "poster");
      let bannerImg = await uploadFile(banner, name + yearOfRelease + "banner");
      await Collection[1].insertOne({
        id,
        name,
        yearOfRelease,
        plot,
        poster: posterImg,
        banner: bannerImg,
        createdAt: new Date().toUTCString(),
        actors,
        producer,
      });
      return res.status(201).json({
        statusCode: 201,
        message: "Movie created successfully.",
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
  getMovieAll: async (req, res) => {
    try {
      await Client.connect();
      const moviesData = await Collection[1].find().toArray();
      return res.status(200).json({
        statusCode: 200,
        message: "Data fetched.",
        moviesData,
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
  getMovie: async (req, res) => {
    const { name } = req.params;
    try {
      await Client.connect();
      const movieData = await Collection[1].findOne({
        name: name,
      });
      return res.status(200).json({
        statusCode: 200,
        message: "Data fetched.",
        movieData,
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
  updateMovie: async (req, res) => {
    const { name, yearOfRelease, plot, actors, poster, banner, producer } =
      req.body;
    const { id } = req.params;
    try {
      await Client.connect();

      let posterImg;
      let bannerImg;
      if (poster.includes("http")) {
        posterImg = poster;
      } else {
        posterImg = await uploadFile(poster, name + yearOfRelease + "poster");
      }
      if (banner.includes("http")) {
        bannerImg = banner;
      } else {
        bannerImg = await uploadFile(banner, name + yearOfRelease + "banner");
      }
      await Collection[1].findOneAndUpdate(
        {
          id: id,
        },
        {
          $set: {
            name: name,
            yearOfRelease: yearOfRelease,
            plot: plot,
            poster: posterImg,
            banner: bannerImg,
            actors: actors,
            producer: producer,
          },
        }
      );
      return res.status(200).json({
        statusCode: 200,
        message: "Movie updated.",
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
  deleteMovie: async (req, res) => {
    const { id } = req.body;
    try {
      await Client.connect();
      await Collection[1].deleteOne({
        id: id,
      });
      return res.status(200).json({
        statusCode: 200,
        message: "Movie deleted.",
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
module.exports = movieController;
