import axios from "axios";
import React, { useEffect, useState } from "react";
import { URL } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

function MovieInfo() {
  const params = useParams();
  const navigate = useNavigate();
  const [CastsData, setCastsData] = useState([]);
  const [MoviesData, setMoviesData] = useState([]);
  const [SelectData, setSelectData] = useState([]);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const response = await axios.get(`${URL}/details/all`, {
        headers: {
          Authorization: window.localStorage.getItem("access-token"),
        },
      });
      if (response.data.statusCode === 200) {
        setSelectData(
          response.data.moviesData.filter(
            (fil) => fil.name.toLowerCase() === params.name.toLowerCase()
          )
        );
        setMoviesData(response.data.moviesData);
        setCastsData(response.data.castsData);
      }
      if (response.data.statusCode === 401) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${URL}/delete/movie/${id}`, {
        headers: {
          Authorization: window.localStorage.getItem("access-token"),
        },
      });
      if (response.data.statusCode === 200) {
        window.history.back();
      }
      if (response.data.statusCode === 401) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Navbar />
      {SelectData &&
        SelectData.map((item, index) => (
          <div key={index}>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={item.banner} alt="" className="d-block w-100" />
                <div className="carousel-caption d-none d-md-block">
                  <h5>{item.name}</h5>
                  <p>
                    Some representative placeholder content for the first slide.
                  </p>
                </div>
              </div>
            </div>
            <div className="container d-flex flex-column">
              <div className="my-5 d-flex flex-row justify-content-end gap-4">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
                <a
                  href={`/movie/edit/${item.id}`}
                  className="btn btn-secondary"
                >
                  Edit
                </a>
              </div>

              <div className="d-flex flex-row align-items-center gap-5 mb-5">
                <div>
                  <img
                    src={item.poster}
                    alt=""
                    width="300"
                    height="500"
                    className="img-thumbnail"
                  />
                </div>
                <div className="d-flex flex-column gap-2">
                  <h3>{item.name}</h3>
                  <div className="d-flex flex-row">
                    {item.plot.split(",").map((plot, i) => (
                      <a
                        href={`/category/movie/${plot}`}
                        className="text-decoration-none"
                        key={i}
                      >
                        {plot}
                        {item.plot.split(",").length > 1 ? (
                          <span className="text-dark fw-bold">
                            &nbsp;&#183;&nbsp;
                          </span>
                        ) : null}
                      </a>
                    ))}
                  </div>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Sunt dignissimos obcaecati non distinctio nihil eveniet
                    expedita placeat esse exercitationem ea. Autem, qui. Minus
                    beatae quaerat hic ipsam optio incidunt! Adipisci.
                  </p>

                  <div className="d-flex flex-row gap-2">
                    <p className="text-secondary">Release year :</p>
                    <p className="text-semibold">{item.yearOfRelease}</p>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <p className="text-secondary">Actors :</p>
                    {item.actors.split(",").map((castId, i) => (
                      <a
                        href={`/casting/${
                          CastsData &&
                          CastsData.filter((find) => find.id == castId)[0].name
                        }`}
                        className="text-decoration-none"
                        key={i}
                      >
                        {CastsData &&
                          CastsData.filter((find) => find.id == castId)[0].name}
                        {item.actors.split(",").length > 1 ? (
                          <span className="text-dark fw-bold">
                            &nbsp;&#183;&nbsp;
                          </span>
                        ) : null}
                      </a>
                    ))}
                  </div>

                  <div className="d-flex flex-row gap-2">
                    <p className="text-secondary">Produced by :</p>
                    <a
                      href={`/casting/${
                        CastsData &&
                        CastsData.filter((find) => find.id == item.producer)[0]
                          .name
                      }`}
                      className="text-decoration-none"
                    >
                      {CastsData &&
                        CastsData.filter((find) => find.id == item.producer)[0]
                          .name}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      {MoviesData &&
        MoviesData.filter(
          (elem, i) =>
            elem.plot.includes(SelectData[0]?.plot) &&
            i < 5 &&
            elem.name !== SelectData[0]?.name
        ).length > 0 && (
          <div className="container-fluid mt-5">
            <div className="m-5 d-flex flex-row align-items-center justify-content-between">
              <h3>Similarities</h3>
              <a
                href={`/category?name=${SelectData[0]?.name}&filter=${SelectData[0]?.plot}`}
                className="text-decoration-none text-primary fw-semibold"
              >
                More
              </a>
            </div>
            <div className="row row-cols-1 row-cols-md-5 g-5 mb-5 mx-3">
              {MoviesData &&
                MoviesData.filter(
                  (elem, i) =>
                    elem.plot.includes(SelectData[0]?.plot) &&
                    i < 5 &&
                    elem.name !== SelectData[0]?.name
                ).map((item, index) => (
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

export default MovieInfo;
