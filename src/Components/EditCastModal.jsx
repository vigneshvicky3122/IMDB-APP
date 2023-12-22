import axios from "axios";
import React, { useEffect, useState } from "react";
import { URL } from "../App";

function EditCastModal({ SelectData, setSelectData }) {
  const [Name, setName] = useState("");
  const [DOB, setDOB] = useState("");
  const [Profile, setProfile] = useState("");
  const [Gender, setGender] = useState("");
  const [Bio, setBio] = useState("");
  const [Role, setRole] = useState("");
  useEffect(() => {
    setName(SelectData[0].name);
    setDOB(SelectData[0].dateOfBirth);
    setProfile(SelectData[0].image);
    setGender(SelectData[0].gender);
    setBio(SelectData[0].bio);
    setRole(SelectData[0].role.split(","));
  }, [SelectData]);

  async function handleSubmit(event) {
    event.preventDefault();
    const Data = {
      id: SelectData && SelectData[0].id,
      createdAt: SelectData && SelectData[0].createdAt,
      name: Name,
      gender: Gender,
      dateOfBirth: DOB,
      bio: Bio,
      role: Role.toString(),
      image: Profile,
    };
    const formData = new FormData();
    for (var key in Data) {
      formData.append(key, Data[key]);
    }

    setSelectData([Data]);

    try {
      const response = await axios.put(
        `${URL}/update/cast/${SelectData && SelectData[0].id}`,
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
                    (imageSize:360x360)
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
                <label htmlFor="Role" className="form-label fw-semibold">
                  Role
                </label>
                <select
                  name="Role"
                  id="Role"
                  className="form-select "
                  aria-label="Role"
                  required
                  onChange={(event) =>
                    setRole((prev) => [...prev, event.target.value])
                  }
                  value={Role[Role.length - 1]}
                >
                  <option value={null}>Select Role</option>
                  <option value="Actor">Actor</option>
                  <option value="Comedian">Comedian</option>
                  <option value="Dancer">Dancer</option>
                  <option value="Director">Director</option>
                  <option value="Producer">Producer</option>
                </select>
              </div>
              <div className="mb-3 d-flex flex-row gap-1">
                {Role &&
                  Role.map((a, i) => (
                    <p
                      className="border border-primary fw-semibold py-0 px-2 rounded-5"
                      key={i}
                    >
                      {a}
                      <i
                        className="bi bi-x fw-bold text-primary"
                        onClick={() => {
                          let update = [...Role];
                          update.splice(i, 1);
                          setRole(update);
                        }}
                      ></i>
                    </p>
                  ))}
              </div>
              <div className="mb-3">
                <label htmlFor="Gender" className="form-label fw-semibold">
                  Gender
                </label>
                <select
                  name="Gender"
                  id="Gender"
                  className="form-select "
                  defaultValue={""}
                  aria-label="Gender"
                  required
                  onChange={(event) => setGender(event.target.value)}
                  value={Gender}
                >
                  <option>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="transgender">Transgender</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="DOB" className="form-label fw-semibold">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="DOB"
                  id="DOB"
                  required
                  onChange={(event) => setDOB(event.target.value)}
                  className="form-control"
                  value={DOB}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="Bio" className="form-label fw-semibold">
                  Bio
                </label>
                <textarea
                  name="Bio"
                  id="Bio"
                  required
                  rows={3}
                  onChange={(event) => setBio(event.target.value)}
                  className="form-control"
                  value={Bio}
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

export default EditCastModal;
