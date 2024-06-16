import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    loading,
    error: errorMessage,
    currentUser,
  } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleChange = (e) => {
    // console.log("event:", e, "event Value:", e.target.value);
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    // console.log("formData:", formData);
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!formData.email || !formData.password) {
      // return setErrorMessage("Please fill out all fields");
      return dispatch(signInFailure("Please fill out all fields"));
    }
    try {
      // setLoading(true);
      // setErrorMessage(null);
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("response in frontend", res);
      if (data?.success === false) {
        // setLoading(false);
        // return setErrorMessage(data?.message);
        return dispatch(signInFailure(data?.message));
      }
      console.log("response in frontend in json", data);
      // setLoading(false);
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      // setErrorMessage(error?.message);
      // setLoading(false);
      dispatch(signInFailure(error?.message));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto sm:flex-col md:flex-row md:items-center gap-5">
        {/*left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Sayani's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign in with your email and password
            or with Google.
          </p>
        </div>
        {/*right */}
        <div className="flex-1">
          <div>
            <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
              <div>
                <Label value="Your Email" />
                <TextInput
                  type="email"
                  placeholder="name@email.com"
                  id="email"
                  // value={formData?.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <Label value="Your Password" />
                <TextInput
                  type="password"
                  placeholder="Password"
                  id="password"
                  // value={formData?.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <Button
                gradientDuoTone="purpleToPink"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
              <OAuth />
            </form>
            <div className="flex gap-2 text-sm mt-5">
              <span>New User, don't have an account?</span>
              <Link to="/sign-up" className="text-blue-500" disabled={loading}>
                Sign Up
              </Link>
            </div>
            <div>
              {errorMessage && (
                <Alert className="mt-5" color="failure">
                  {errorMessage}
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
