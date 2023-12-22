import axios from "axios";
import React, { useEffect, useState } from "react";
import { URL } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import moment from "moment";
import EditCastModal from "./EditCastModal";
function CastInfo() {
  const params = useParams();
  const navigate = useNavigate();
  const [MoviesData, setMoviesData] = useState([]);
  const [SelectData, setSelectData] = useState(null);
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
          response.data.castsData.filter(
            (fil) => fil.name.toLowerCase() === params.name.toLowerCase()
          )
        );
        setMoviesData(response.data.moviesData);
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
      const response = await axios.delete(`${URL}/delete/cast/${id}`, {
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
          <div key={index} className="container d-flex flex-column ">
            <div className="my-5 d-flex flex-row justify-content-end gap-4">
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
              <button
                className="btn btn-secondary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Edit
              </button>
            </div>
            <div className="d-flex flex-row align-items-center gap-5 mb-5">
              <div>
                <img
                  src={item.image}
                  alt=""
                  width="200"
                  height="250"
                  className="rounded-1"
                />
              </div>

              <div className="d-flex flex-column gap-2">
                <h3>{item.name}</h3>
                <div className="d-flex flex-row">
                  {item.role.split(",").length > 1 ? (
                    item.role.split(",").map((plot, i) => (
                      <a
                        href={`/category/casting/${plot}`}
                        className="text-decoration-none"
                        key={i}
                      >
                        {plot}
                        {item.role.split(",").length > 1 ? (
                          <span className="text-dark fw-bold">
                            &nbsp;&#183;&nbsp;
                          </span>
                        ) : null}
                      </a>
                    ))
                  ) : (
                    <a
                      href={`/category/casting/${item.role}`}
                      className="text-decoration-none"
                    >
                      {item.role}
                    </a>
                  )}
                </div>
                <p>{item.bio}</p>

                <div className="d-flex flex-row gap-2">
                  <p className="text-secondary">Date of Birth :</p>
                  <p className="text-semibold">
                    {moment(item.dateOfBirth).format("DD MMMM YYYY")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      {MoviesData &&
        MoviesData.filter(
          (elem, i) => elem.actors.includes(SelectData[0]?.id) && i < 5
        ).length > 0 && (
          <div className="container-fluid mt-5">
            <div className="m-5 d-flex flex-row align-items-center justify-content-between">
              <h3>Acting Movies</h3>
              <a
                href={`/casting?id=${SelectData[0]?.id}&filter=Acting Movies`}
                className="text-decoration-none text-primary fw-semibold"
              >
                More
              </a>
            </div>
            <div className="row row-cols-1 row-cols-md-5 g-5 mb-5 mx-3">
              {MoviesData &&
                MoviesData.filter(
                  (elem, i) => elem.actors.includes(SelectData[0]?.id) && i < 5
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

      {MoviesData &&
        MoviesData.filter((elem, i) => elem.producer == SelectData[0]?.id)
          .length > 0 && (
          <div className="container-fluid mt-5">
            <div className="m-5 d-flex flex-row align-items-center justify-content-between">
              <h3>Producing Movies</h3>
              <a
                href={`/casting?id=${SelectData[0]?.id}&filter=Producing Movies`}
                className="text-decoration-none text-primary fw-semibold"
              >
                More
              </a>
            </div>
            <div className="row row-cols-1 row-cols-md-5 g-5 mb-5 mx-3">
              {MoviesData &&
                MoviesData.filter(
                  (elem, i) => elem.producer == SelectData[0]?.id && i < 5
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
      {SelectData && SelectData.length > 0 && (
        <EditCastModal SelectData={SelectData} setSelectData={setSelectData} />
      )}
    </>
  );
}
export default CastInfo;
