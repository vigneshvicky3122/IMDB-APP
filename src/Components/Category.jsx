import axios from "axios";
import React, { useEffect, useState } from "react";
import { URL } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

function Category() {
  const params = useParams();
  const navigate = useNavigate();
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
          response.data.moviesData.filter((elem, index) =>
            elem.plot.includes(params.name)
          )
        );
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
      <div className="container-fluid">
        <div className="m-5 d-flex flex-row align-items-center justify-content-between">
          <h3>{params.name} Movies</h3>
        </div>
        <div className="row row-cols-1 row-cols-md-5 g-5 mb-5 mx-3">
          {SelectData &&
            SelectData.map((items, index) => (
              <div className="col" key={index}>
                <a href={`/movie/${items.name}`}>
                  <div className="card">
                    <img
                      src={items.poster}
                      className="img-thumbnail rounded"
                      alt="..."
                    />
                  </div>
                </a>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default Category;
