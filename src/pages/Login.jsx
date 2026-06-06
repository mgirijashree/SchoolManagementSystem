import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import loginBg from "../assets/login.jpg";

const Login = () => {
    const navigate = useNavigate();
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Email Validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value.trim()) {
      setEmailError("Email is required");
    } else if (!emailRegex.test(value)) {
      setEmailError("Enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // Password Validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!value.trim()) {
      setPasswordError("Password is required");
    } else if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };


  // Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError("");

    // 1. Initial State Checks
    if (!email) {
      setEmailError("Email is required");
    }
    if (!password) {
      setPasswordError("Password is required");
    }

    // Guard Clause: Prevent submission if validation errors exist
    if (emailError || passwordError || !email || !password) {
      return;
    }

    // 2. ADMIN LOGIN VALIDATION
    if (role === "admin") {
      if (email === "admin@school.com" && password === "Admin@123") {
        // Save authentication details locally
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("isAuthenticated", "true");
        
        alert("Admin Login Successful");
        // Using React Router's native navigate for seamless transitions without heavy page reloads
        navigate("/dashboard"); 
        return;
      }
      setLoginError("Invalid Admin Credentials");
    }

    // 3. TEACHER LOGIN VALIDATION
    if (role === "teacher") {
      // Added the missing '@' to match image_6fbc04.png
      if (email === "teacher@school.com" && password === "Teacher@123") {
        localStorage.setItem("userRole", "teacher");
        localStorage.setItem("isAuthenticated", "true");
        
        alert("Teacher Login Successful");
        navigate("/teacher/dashboard"); 
        return; // Added return to prevent falling through to the error
      }
      setLoginError("Invalid Teacher Credentials");
    }
  };


  return (
    <div
  className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
  style={{
    backgroundImage: `url(${loginBg})`, 
  }}
>
      <div className="w-full max-w-2xl bg-[#FDF8EE] rounded-[40px] shadow-2xl p-8 md:p-12">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Welcome Back
        </h1>

        <p className="text-gray-500 mt-2 text-lg">
          Sign into your School Management account
        </p>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`h-14 rounded-full font-semibold transition-all ${
              role === "admin"
                ? "bg-[#E59B33] text-white"
                : "border border-[#E59B33] text-gray-800"
            }`}
          >
            Admin
          </button>

          <button
            type="button"
            onClick={() => setRole("teacher")}
            className={`h-14 rounded-full font-semibold transition-all ${
              role === "teacher"
                ? "bg-[#E59B33] text-white"
                : "border border-[#E59B33] text-gray-800"
            }`}
          >
            Teacher
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Email */}
          <div>
            <label className="block mb-2 font-semibold">
              Email
            </label>

            <div className="relative">
              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Enter your Email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full h-14 pl-12 pr-4 rounded-xl border outline-none bg-white
                  ${
                    emailError
                      ? "border-red-500"
                      : "border-[#7DC2B1] focus:border-[#E59B33]"
                  }`}
              />
            </div>

            {emailError && (
              <p className="text-red-500 text-sm mt-1">
                {emailError}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-semibold">
              Password
            </label>

            <div className="relative">
              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full h-14 pl-12 pr-12 rounded-xl border outline-none bg-white
                  ${
                    passwordError
                      ? "border-red-500"
                      : "border-[#7DC2B1] focus:border-[#E59B33]"
                  }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {passwordError && (
              <p className="text-red-500 text-sm mt-1">
                {passwordError}
              </p>
            )}
          </div>


            {loginError && (
            <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-xl text-sm">
                {loginError}
            </div>
            )}

          {/* Sign In */}
          <button
            type="submit"
            className="w-full h-14 bg-[#E59B33] hover:bg-[#D48C2A] text-white font-bold rounded-full transition-all"
          >
            Sign In
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 text-sm text-gray-500 border-t pt-4">
          <p>
            <strong>Admin:</strong> admin@school.com /
            Admin@123
          </p>
          <p>
            <strong>Teacher:</strong> teacher@school.com /
            Teacher@123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;