// src/pages/Signup.jsx

import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [authUser, setAuthUser] = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password", "");
  const navigate = useNavigate();

  const validatePasswordMatch = (value) => {
    return value === password || "Password and confirm password do not match.";
  };

  const onSubmit = async (data) => {
    const userinfo = {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmpassword: data.confirmPassword,
      profession: data.profession,
    };

    try {
const response = await axios.post("http://localhost:5002/user/signup", userinfo, {
  withCredentials: true,
});
      if (response.data) {
        alert("Signed up successfully! You can now log in.");
        localStorage.setItem("messenger", JSON.stringify(response.data));
        setAuthUser(response.data);
        navigate("/");
      }
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || "Signup failed."));
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="border border-black px-6 py-4 rounded-md space-y-3 w-96 bg-white">
        <h1 className="text-2xl font-bold text-fuchsia-800 text-center">MESSENGER</h1>
        <h2 className="text-lg font-semibold text-center">
          Create a new <span className="text-fuchsia-700">Account</span>
        </h2>
        <p className="text-sm text-gray-500 text-center">It's free and always will be</p>

        {/* Name */}
        <input
          placeholder="Username"
          className="input input-bordered w-full"
          {...register("name", { required: true })}
        />
        {errors.name && <span className="text-red-500 text-sm">Name is required</span>}

        {/* Email */}
        <input
          placeholder="Email"
          className="input input-bordered w-full"
          {...register("email", { required: true })}
        />
        {errors.email && <span className="text-red-500 text-sm">Email is required</span>}

        {/* Profession */}
        <input
          placeholder="Profession"
          className="input input-bordered w-full"
          {...register("profession", { required: true })}
        />
        {errors.profession && <span className="text-red-500 text-sm">Profession is required</span>}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full"
          {...register("password", { required: true })}
        />
        {errors.password && <span className="text-red-500 text-sm">Password is required</span>}

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          className="input input-bordered w-full"
          {...register("confirmPassword", {
            required: true,
            validate: validatePasswordMatch,
          })}
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
        )}

        <input
          type="submit"
          value="Signup"
          className="bg-fuchsia-800 text-white w-full py-2 rounded-md cursor-pointer hover:bg-fuchsia-700"
        />

        <p className="text-sm text-center">
          Already have an account?
          <Link to="/login" className="text-fuchsia-700 underline ml-1">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
