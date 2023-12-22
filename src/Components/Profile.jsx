import axios from "axios";
import React, { useEffect, useState } from "react";
import { URL } from "../App";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import moment from "moment";
import EditUser from "./EditUser";

function Profile() {
  const navigate = useNavigate();

  const [SelectData, setSelectData] = useState(null);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const response = await axios.get(
        `${URL}/details/user/${window.localStorage.getItem("userId")}`,
        {
          headers: {
            Authorization: window.localStorage.getItem("access-token"),
          },
        }
      );
      if (response.data.statusCode === 200) {
        setSelectData(response.data.userData);
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
      const response = await axios.delete(`${URL}/delete/user/${id}`, {
        headers: {
          Authorization: window.localStorage.getItem("access-token"),
        },
      });
      if (response.data.statusCode === 200) {
        window.localStorage.clear();
        navigate("/login");
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
                onClick={() => handleDelete(item._id)}
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
                  src={item.profile}
                  alt=""
                  width="200"
                  height="200"
                  className="rounded-1"
                />
              </div>

              <div className="d-flex flex-column gap-2">
                <h3>{item.name}</h3>

                <p>{item.email}</p>

                <div className="d-flex flex-row gap-2">
                  <p className="text-secondary">Joined :</p>
                  <p className="text-semibold">
                    {moment(item.createdAt).format("DD MMMM YYYY")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      {SelectData && SelectData.length > 0 && (
        <EditUser SelectData={SelectData} setSelectData={setSelectData} />
      )}
    </>
  );
}
export default Profile;
