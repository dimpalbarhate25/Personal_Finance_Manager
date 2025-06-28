// Login.jsx
import React from 'react';
import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [authUser, setAuthUser] = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const userinfo = {
      email: data.email,
      password: data.password,
    };

    axios.post("http://localhost:5002/user/login", userinfo, {
      withCredentials: true
    })
      .then((response) => {
        alert("Logged in successfully!");

        // ✅ Save token and user data separately
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setAuthUser(response.data.user);  // If you're using context
        navigate("/dashboard"); // or wherever you want
      })
      .catch((error) => {
        if (error.response) {
          alert("Error: " + error.response.data.message);
        } else {
          alert("Login failed. Please try again.");
        }
      });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-black px-6 py-4 rounded-md space-y-3 w-96 bg-white"
      >
        <h1 className="text-2xl text-center text-fuchsia-800 font-bold">FINANCE MANAGER</h1>
        <h2 className="text-lg text-center">
          Login to your <span className="text-fuchsia-600 font-semibold">Account</span>
        </h2>
        <p className="text-sm text-center text-gray-500">Secure your budget & track expenses!</p>

        {/* Email */}
        <label className="input input-bordered flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="email"
            className="grow"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
          />
        </label>
        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

        {/* Password */}
        <label className="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            className="grow"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />
        </label>
        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

        {/* Submit Button */}
        <input
          type="submit"
          value="Login"
          className="bg-fuchsia-800 text-white w-full py-2 rounded-md cursor-pointer hover:bg-fuchsia-700"
        />

        {/* Redirect Link */}
        <p className="text-sm text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-fuchsia-600 underline">Signup</Link>
        </p>
      </form>
    </div>
  );
}
