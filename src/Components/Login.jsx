import axios from "axios";
import React, { useState } from "react";
import { URL } from "../App";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [Response, setResponse] = useState(false);
  const [Message, setMessage] = useState("");
  const [Color, setColor] = useState("");
  async function handleSubmit(event) {
    try {
      event.preventDefault();

      const response = await axios.post(`${URL}/login`, {
        email: event.target.email.value,
        password: event.target.password.value,
      });
      setResponse(true);
      setMessage(response.data.message);
      if (response.data.statusCode === 200) {
        window.localStorage.setItem("access-token", response.data.accessToken);
        window.localStorage.setItem(
          "refresh-token",
          response.data.refreshToken
        );
        window.localStorage.setItem("userId", response.data.userId);
        setColor("text-success");
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      }
      if (response.data.statusCode >= 400) {
        setColor("text-danger");
        setTimeout(() => {
          setResponse(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <div className="container">
        <div className="w-50 my-5 mx-auto border border-dark p-5 rounded-2">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className="my-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                name="email"
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                required
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                required
                minLength={8}
                maxLength={16}
              />
              <a
                href="/forgot/password/verify/email"
                className="nav-link mt-2 text-end fs-6 text-primary"
              >
                forgot password
              </a>
            </div>
            {Response ? (
              <div
                id="responseMessage"
                className={`form-text mb-4 fw-semibold text-center ${Color}`}
              >
                {Message}
              </div>
            ) : null}
            <div className="my-5">
              <input
                type="submit"
                placeholder="Log In"
                className="form-control btn btn-primary"
              />
            </div>
            <div className="text-center fw-semibold mb-2">OR</div>
            <div className="text-center">
              Create new one?&nbsp;
              <a
                href="/signup"
                className="text-decoration-none fw-semibold mt-2 fs-6 text-primary"
              >
                Signup
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
