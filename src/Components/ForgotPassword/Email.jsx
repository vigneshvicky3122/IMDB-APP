import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../../App";

function Email() {
  const navigate = useNavigate();
  const [Response, setResponse] = useState(false);
  const [Message, setMessage] = useState("");
  const [Color, setColor] = useState("");
  async function handleSubmit(event) {
    try {
      event.preventDefault();

      const response = await axios.post(`${URL}/email/verification`, {
        email: event.target.email.value,
      });
      setResponse(true);
      setMessage(response.data.message);
      if (response.data.statusCode === 200) {
        setColor("text-success");
        setTimeout(() => {
          navigate(`/forgot/password/verify/otp/${event.target.email.value}`);
        }, 3000);
      }
      if (response.data.statusCode === 402) {
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
            <h1>Forgot Password</h1>
            <h6>Verification for Email</h6>

            <div className="my-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                name="email"
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                required
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
                placeholder="Verify"
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

export default Email;
