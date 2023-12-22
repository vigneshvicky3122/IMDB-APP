import axios from "axios";
import React, { useState } from "react";
import { URL } from "../../App";
import { useNavigate, useParams } from "react-router-dom";

function Otp() {
  const navigate = useNavigate();
  const params = useParams();
  const [Response, setResponse] = useState(false);
  const [Message, setMessage] = useState("");
  const [Color, setColor] = useState("");
  async function handleSubmit(event) {
    try {
      event.preventDefault();

      const response = await axios.post(
        `${URL}/otp/verification/${params.email}`,
        {
          otp: event.target.otp.value,
        }
      );
      setResponse(true);
      setMessage(response.data.message);
      if (response.data.statusCode === 200) {
        setColor("text-success");
        setTimeout(() => {
          navigate(`/forgot/password/reset/${response.data._id}`);
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
            <h1>Forgot Password</h1>
            <h6>Verification for OTP</h6>

            <div className="my-3">
              <label htmlFor="exampleInputOtp1" className="form-label">
                One time password
              </label>
              <input
                name="otp"
                type="password"
                className="form-control"
                id="exampleInputOtp1"
                required
                minLength={6}
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

export default Otp;
