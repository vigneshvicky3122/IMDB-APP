import React, { useEffect, useState } from "react";
import Modal from "./AddCast";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { URL } from "../App";

function EditMovie() {
  const navigate = useNavigate();
  const params = useParams();
  const [Banner, setBanner] = useState("");
  const [Poster, setPoster] = useState("");
  const [Plot, setPlot] = useState("");
  const [Name, setName] = useState("");
  const [ReleaseYear, setReleaseYear] = useState("");
  const [Actors, setActors] = useState([]);
  const [Producer, setProducer] = useState("");
  const [CastsData, setCastsData] = useState([]);

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
        let actors = response.data.moviesData.filter(
          (fill) => fill.id === params.id
        )[0].actors;
        if (actors.split(",").length > 1) {
          setActors(actors.split(","));
        } else {
          setActors([actors]);
        }

        let plot = response.data.moviesData.filter(
          (fill) => fill.id === params.id
        )[0].plot;
        if (plot.split(",").length > 1) {
          setPlot(plot.split(","));
        } else {
          setPlot([plot]);
        }

        setBanner(
          response.data.moviesData.filter((fill) => fill.id === params.id)[0]
            .banner
        );
        setPoster(
          response.data.moviesData.filter((fill) => fill.id === params.id)[0]
            .poster
        );

        setName(
          response.data.moviesData.filter((fill) => fill.id === params.id)[0]
            .name
        );
        setReleaseYear(
          response.data.moviesData.filter((fill) => fill.id === params.id)[0]
            .yearOfRelease
        );

        setProducer(
          response.data.moviesData.filter((fill) => fill.id === params.id)[0]
            .producer
        );
        setCastsData(response.data.castsData);
      }
      if (response.data.statusCode === 401) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  async function handleSubmit(event) {
    event.preventDefault();
    const Data = {
      name: Name,
      yearOfRelease: ReleaseYear,
      plot: Plot,
      actors: Actors,
      poster: Poster,
      banner: Banner,
      producer: Producer,
    };
    const formData = new FormData();
    for (var key in Data) {
      formData.append(key, Data[key]);
    }
    try {
      const response = await axios.put(
        `${URL}/update/movie/${params.id}`,
        formData,
        {
          headers: {
            Authorization: window.localStorage.getItem("access-token"),
          },
        }
      );
      if (response.data.statusCode === 200) {
        console.log(response.data.message);
        window.history.back();
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
      <Navbar />
      <div className="container w-100 my-5">
        <h1 className="text-center">Add New Movie</h1>
        <div className="border border-dark rounded mx-auto w-75 d-flex flex-row gap-1 align-items-center">
          <div className="w-75 d-flex flex-column p-5">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="Banner" className="form-label fw-semibold">
                  Banner&nbsp;
                  <span className="text-secondary fw-normal fs-6">
                    (imageSize:1200x600)
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="Banner"
                  id="Banner"
                  onChange={(event) => {
                    let file = event.target.files[0];
                    const reader = new FileReader();
                    reader.addEventListener("load", (ev) => {
                      setBanner(ev.target.result);
                    });
                    reader.readAsDataURL(file);
                  }}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="Poster" className="form-label fw-semibold">
                  Poster&nbsp;
                  <span className="text-secondary fw-normal fs-6">
                    (imageSize:675x1000)
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="Poster"
                  id="Poster"
                  onChange={(event) => {
                    let file = event.target.files[0];
                    const reader = new FileReader();
                    reader.addEventListener("load", (ev) => {
                      setPoster(ev.target.result);
                    });
                    reader.readAsDataURL(file);
                  }}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="Name" className="form-label fw-semibold">
                  Movie Name
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
                <label htmlFor="ReleaseYear" className="form-label fw-semibold">
                  Release Year
                </label>
                <input
                  type="number"
                  name="ReleaseYear"
                  id="ReleaseYear"
                  required
                  onChange={(event) => setReleaseYear(event.target.value)}
                  className="form-control"
                  value={ReleaseYear}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="Plot" className="form-label fw-semibold">
                  Plot
                </label>
                <select
                  name="Plot"
                  id="Plot"
                  required
                  className="form-select"
                  aria-label="Plot"
                  onChange={(event) =>
                    setPlot((previous) => [...previous, event.target.value])
                  }
                  value={Plot[Plot.length - 1]}
                >
                  <option value={null}>select plot</option>
                  {[
                    "Action",
                    "Drama",
                    "Thriller",
                    "Comedy",
                    "Biography",
                    "Horror",
                    "Funny",
                    "Love",
                    "Romantic",
                    "History",
                  ].map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 d-flex flex-row gap-1">
                {Plot &&
                  Plot.map((a, i) => (
                    <p
                      className="border border-primary fw-semibold py-0 px-2 rounded-5"
                      key={i}
                    >
                      {a}
                      <i
                        className="bi bi-x fw-bold text-primary"
                        onClick={() => {
                          let update = [...Plot];
                          update.splice(i, 1);
                          setPlot(update);
                        }}
                      ></i>
                    </p>
                  ))}
              </div>
              <div className="mb-1">
                <label htmlFor="Actors" className="form-label fw-semibold">
                  Actors
                </label>
                <select
                  name="Actors"
                  id="Actors"
                  className="form-select"
                  aria-label="Default select example"
                  required
                  onChange={(event) =>
                    setActors((previous) => [...previous, event.target.value])
                  }
                  value={Actors && Actors[Actors.length - 1]}
                >
                  <option value={null}>select actors</option>
                  {CastsData &&
                    CastsData.filter((elem) => elem.role.includes("Actor")).map(
                      (item, index) => (
                        <option key={index} value={item.id}>
                          {item.name}
                        </option>
                      )
                    )}
                </select>
              </div>

              <div className="mb-3 d-flex flex-row gap-1">
                {Actors &&
                  Actors.map((a, i) => (
                    <p
                      className="border border-primary fw-semibold py-0 px-2 rounded-5"
                      key={i}
                    >
                      {CastsData &&
                        CastsData.filter((f) => f.id == a).map(
                          (data) => data.name
                        )}
                      <i
                        className="bi bi-x fw-bold text-primary"
                        onClick={() => {
                          let update = [...Actors];
                          update.splice(i, 1);
                          setActors(update);
                        }}
                      ></i>
                    </p>
                  ))}
              </div>
              <div className="mb-3 text-end">
                <a
                  href="#!"
                  className="text-decoration-none text-primary fw-semibold"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Add Actor/Producer
                </a>
              </div>

              <div className="mb-3">
                <label htmlFor="Producer" className="form-label fw-semibold">
                  Producer
                </label>
                <select
                  name="Producer"
                  id="Producer"
                  className="form-select"
                  aria-label="Default select example"
                  required
                  onChange={(event) => setProducer(event.target.value)}
                  value={Producer}
                >
                  <option value={null}>select producer</option>
                  {CastsData &&
                    CastsData.filter((elem) =>
                      elem.role.includes("Producer")
                    ).map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mt-5 d-flex flex-row gap-4">
                <input
                  type="button"
                  className="form-control btn btn-secondary"
                  value="Cancel"
                  onClick={() => window.history.back()}
                />
                <input
                  type="submit"
                  value="Update"
                  className="form-control btn btn-primary"
                />
              </div>
            </form>
          </div>
          <div className="w-25 d-flex flex-column gap-5 align-items-center">
            <div>
              <img src={Banner} alt="" className="img-thumbnail" />
            </div>
            <div>
              <img src={Poster} alt="" className="img-thumbnail" />
            </div>
          </div>
        </div>
      </div>
      <Modal CastsData={CastsData} setCastsData={setCastsData} />
    </>
  );
}

export default EditMovie;
