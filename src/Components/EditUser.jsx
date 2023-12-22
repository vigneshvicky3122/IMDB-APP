import axios from "axios";
import React, { useEffect, useState } from "react";
import { URL } from "../App";

function EditUser({ SelectData, setSelectData }) {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Profile, setProfile] = useState("");

  useEffect(() => {
    setName(SelectData[0].name);
    setEmail(SelectData[0].email);
    setProfile(SelectData[0].image);
  }, [SelectData]);

  async function handleSubmit(event) {
    event.preventDefault();
    const Data = {
      id: SelectData && SelectData[0].id,
      createdAt: SelectData && SelectData[0].createdAt,
      name: Name,
      email: Email,
      profile: Profile,
    };
    const formData = new FormData();
    for (var key in Data) {
      formData.append(key, Data[key]);
    }

    setSelectData([Data]);

    try {
      const response = await axios.put(
        `${URL}/profile/updated/user/${SelectData && SelectData[0]._id}`,
        formData,
        {
          headers: {
            Authorization: window.localStorage.getItem("access-token"),
          },
        }
      );
      if (response.data.statusCode === 200) {
        console.log(response.data.message);
        window.location.reload();
      }
      if (response.data.statusCode === 400) {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Profile
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="Profile" className="form-label fw-semibold">
                  Profile&nbsp;
                  <span className="text-secondary fw-normal fs-6">
                    (imageSize:320x320)
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="Profile"
                  id="Profile"
                  onChange={(event) => {
                    let file = event.target.files[0];
                    const reader = new FileReader();
                    reader.addEventListener("load", (ev) => {
                      setProfile(ev.target.result);
                    });
                    reader.readAsDataURL(file);
                  }}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="Name" className="form-label fw-semibold">
                  Name
                </label>
                <input
                  type="text"
                  name="Name"
                  id="Name"
                  required
                  onChange={(event) => setName(event.target.value)}
                  className="form-control"
                  value={Name}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="Email" className="form-label fw-semibold">
                  Email address
                </label>
                <input
                  type="email"
                  name="Email"
                  id="Email"
                  disabled={true}
                  className="form-control"
                  value={Email}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditUser;
