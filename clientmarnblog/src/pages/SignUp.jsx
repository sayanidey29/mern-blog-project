import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    // console.log("event:", e, "event Value:", e.target.value);
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    // console.log("formData:", formData);
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields");
    }
    if (formData.password?.length < 6) {
      return setErrorMessage("Password must be at less 6 characters");
    }
    if (formData.password?.includes(" ")) {
      return setErrorMessage("Password cannot contain spaces");
    }
    if (formData.username?.includes(" ")) {
      return setErrorMessage("Username cannot contain spaces");
    }
    if (formData.username?.length < 7 || formData.username?.length > 20) {
      return setErrorMessage("Username must be between 7 and 20 characters");
    }
    if (formData.username !== formData.username.toLowerCase()) {
      return setErrorMessage("Username must be lowercase");
    }
    if (!formData.username.match(/^[a-zA-Z0-9]+$/)) {
      return setErrorMessage("Username can only contain letters and numbers");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("response in frontend", res);
      if (data?.success === false) {
        setLoading(false);
        return setErrorMessage(data?.message);
      }
      console.log("response in frontend in json", data);
      setLoading(false);
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error?.message);
      setLoading(false);
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
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>
        {/*right */}
        <div className="flex-1">
          <div>
            <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
              <div>
                <Label value="Your Username" />
                <TextInput
                  type="text"
                  placeholder="Username"
                  id="username"
                  // value={formData?.username}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
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
                  "Sign Up"
                )}
              </Button>
              <OAuth />
            </form>
            <div className="flex gap-2 text-sm mt-5">
              <span>Have an account?</span>
              <Link to="/sign-in" className="text-blue-500" disabled={loading}>
                Sign In
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

export default SignUp;
