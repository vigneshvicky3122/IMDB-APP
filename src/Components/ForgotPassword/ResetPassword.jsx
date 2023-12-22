import axios from "axios";
import React, { useState } from "react";
import { URL } from "../../App";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const params = useParams();
  const [Response, setResponse] = useState(false);
  const [Message, setMessage] = useState("");
  const [Color, setColor] = useState("");
  async function handleSubmit(event) {
    try {
      event.preventDefault();

      const response = await axios.put(`${URL}/password/reset/${params.id}`, {
        password: event.target.password.value,
        confirmPassword: event.target.confirmPassword.value,
      });
      setResponse(true);
      setMessage(response.data.message);
      if (response.data.statusCode === 200) {
        setColor("text-success");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
      if (response.data.statusCode === 400) {
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
            <h2>Forgot Password</h2>
            <h6>Reset Password</h6>

            <div className="my-3">
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
            </div>
            <div className="my-3">
              <label
                htmlFor="exampleInputConfirmPassword1"
                className="form-label"
              >
                Confirm password
              </label>
              <input
                name="confirmPassword"
                type="password"
                className="form-control"
                id="exampleInputConfirmPassword1"
                required
                minLength={8}
                maxLength={16}
              />
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
                placeholder="Reset"
                className="form-control btn btn-primary"
              />
            </div>
            <div className="text-center fw-semibold mb-2">OR</div>
            <div className="text-center">
              Back to&nbsp;
              <a
                href="/login"
                className="text-decoration-none fw-semibold mt-2 fs-6 text-primary"
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
