const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 },
});
const { authentication } = require("../auth");
const userController = require("../Controllers/userController");
const movieController = require("../Controllers/movieController");
const castController = require("../Controllers/castController");
const overallController = require("../Controllers/overallController");

//overall routers
router.get("/details/all", authentication, overallController.getOverall);

//User routers
router.get("/details/user/all", authentication, userController.getUserAll);
router.get("/details/user/:id", authentication, userController.getUser);
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.put(
  "/profile/updated/user/:id",
  authentication,
  upload.any(),
  userController.updateUser
);
router.post("/email/verification", userController.verifyEmail);
router.post("/otp/verification/:email", userController.verifyOtp);
router.put("/password/reset/:id", userController.resetPassword);
router.delete("/delete/user/:id", authentication, userController.deleteUser);

//Cast routers
router.get("/details/cast/all", authentication, castController.getCastAll);
router.get("/details/cast/:id", authentication, castController.getCast);
router.post(
  "/new/cast/add",
  authentication,
  upload.any(),
  castController.createCast
);
router.put(
  "/update/cast/:id",
  authentication,
  upload.any(),
  castController.updateCast
);
router.delete("/delete/cast/:id", authentication, castController.deleteCast);

//Movie routers
router.get("/details/movie/all", authentication, movieController.getMovieAll);
router.get("/details/movie/:name", authentication, movieController.getMovie);
router.post(
  "/new/movie/add",
  authentication,
  upload.any(),
  movieController.createMovie
);
router.put(
  "/update/movie/:id",
  authentication,
  upload.any(),
  movieController.updateMovie
);
router.delete("/delete/movie/:id", authentication, movieController.deleteMovie);

module.exports = router;
