import React from "react";

function Carousel({ MoviesData }) {
  return (
    <>
      <div
        id="carouselExampleAutoplaying"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          {MoviesData &&
            MoviesData.filter((elem, index) => index < 5)
              .reverse()
              .map((items, ind) => (
                <button
                  key={ind}
                  type="button"
                  data-bs-target="#carouselExampleAutoplaying"
                  data-bs-slide-to={`${ind}`}
                  className={ind === 0 ? "active" : ""}
                  aria-current={ind === 0 ? "true" : "false"}
                  aria-label={`Slide ${ind + 1}`}
                ></button>
              ))}
        </div>
        <div className="carousel-inner">
          {MoviesData &&
            MoviesData.filter((elem, index) => index < 5)
              .reverse()
              .map((items, ind) => (
                <div
                  className={
                    ind === 0 ? "carousel-item active" : "carousel-item"
                  }
                  key={ind}
                >
                  <img
                    src={items.banner}
                    className="d-block w-100"
                    alt="movie-banner"
                  />
                  <div className="carousel-caption d-none d-md-block">
                    <a
                      href={`/movie/${items.name}`}
                      className="text-decoration-none text-white"
                    >
                      <h5>{items.name}</h5>
                    </a>
                    <p>
                      Some representative placeholder content for the first
                      slide.
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </>
  );
}

export default Carousel;
