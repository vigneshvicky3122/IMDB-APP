import React from "react";

function List({ MoviesData }) {
  return (
    <>
      {MoviesData && MoviesData.length > 1 && (
        <div className="container-fluid">
          <div className="m-5 d-flex flex-row align-items-center justify-content-between">
            <h3>Latest</h3>
            <a
              href={`/category?name=Latest&filter=Latest`}
              className="text-decoration-none text-primary fw-semibold"
            >
              More
            </a>
          </div>
          <div className="row row-cols-1 row-cols-md-5 g-5 mb-5 mx-3">
            {MoviesData &&
              MoviesData.filter((elem, i) => i < 5)
                .reverse()
                .map((item, index) => (
                  <div className="col" key={index}>
                    <a href={`/movie/${item?.name}`}>
                      <div className="card">
                        <img
                          src={item?.poster}
                          className="img-thumbnail"
                          alt="..."
                        />
                      </div>
                    </a>
                  </div>
                ))}
          </div>
        </div>
      )}
    </>
  );
}

export default List;
