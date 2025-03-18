
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Navbar from "./Navbar";
// import "../components/css/LoginPage.css";
// import { FaAddressCard } from "react-icons/fa6";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Footer from "./Footer";

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const validate = () => {
//     const { email, password } = formData;

//     if (!email || !password) {
//       toast.warning("🚨 Oops! You forgot to fill out all the fields.", {
//         position: "top-right",
//         autoClose: 3000
//       });
//       return false;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       toast.warning("📧 Hmm... that doesn't look like a valid email!", {
//         position: "top-right",
//         autoClose: 3000
//       });
//       return false;
//     }

//     if (password.length < 6) {
//       toast.warning("🔒 Password must be at least 6 characters!", {
//         position: "top-right",
//         autoClose: 3000
//       });
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       const response = await axios.post("http://localhost:4000/api/auth/login", formData);
//       const { token, user } = response.data;

//       localStorage.setItem("auth-token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       localStorage.setItem("userRole", user.role);

//       toast.success("🎉 Login successful! Welcome back!", { autoClose: 2000 });

//       if (user.role === "admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/dashboard");
//       }
//     } catch (error) {
//       toast.error("😟 Login failed! Please check your credentials.");
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <ToastContainer />
      
//       <div style={{ height: "80px" }}></div>
//       <div className="login-container">
//         <div className="login-card">
//           <div className="header">
//             <h1 className="login-heading">LOGIN</h1>
//           </div>

//           <p className="register-link">
//             New to this Site? <a href="/register">Register</a>
//           </p>

//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label htmlFor="email">EMAIL</label>
//               <input
//                 type="email"
//                 id="email"
//                 placeholder="hello@reallygreatsite.com"
//                 className="form-input"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="password">PASSWORD</label>
//               <input
//                 type="password"
//                 id="password"
//                 placeholder="********"
//                 className="form-input"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>

//             <p className="forgot-password-link">
//               <a href="/forgot-password">Forgot Password?</a>
//             </p>

//             <button type="submit" className="login-button">
//               Login
//             </button>
//           </form>
//         </div>

//         <div className="address-icon-container">
//           <FaAddressCard className="address-icon" />
//         </div>
//       </div>

//       <div style={{ height: "40px" }}></div>
//       <Footer />
//     </>
//   );
// };

// export default LoginPage;






// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Navbar from "./Navbar";
// import "../components/css/LoginPage.css";
// import { FaAddressCard } from "react-icons/fa6";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Footer from "./Footer";

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const validate = () => {
//     const { email, password } = formData;

//     if (!email || !password) {
//       toast.warning("🚨 Oops! You forgot to fill out all the fields.", {
//         position: "top-right",
//         autoClose: 3000
//       });
//       return false;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       toast.warning("📧 Hmm... that doesn't look like a valid email!", {
//         position: "top-right",
//         autoClose: 3000
//       });
//       return false;
//     }

//     if (password.length < 6) {
//       toast.warning("🔒 Password must be at least 6 characters!", {
//         position: "top-right",
//         autoClose: 3000
//       });
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
  
//     try {
//       const response = await axios.post("http://localhost:4000/api/auth/login", formData);
//       const { token, user } = response.data;
  
//       localStorage.setItem("auth-token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       localStorage.setItem("userRole", user.role);
  
//       toast.success("🎉 Login successful! Welcome back!", { autoClose: 2000 });
  
//       // Redirect immediately
//       if (user.role === "admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/dashboard");
//       }
//     } catch (error) {
//       toast.error("😟 Login failed! Please check your credentials.");
//     }
//   };
  

//   return (
//     <>
//       <Navbar />
//       <ToastContainer />
//       <div className="login-container">
//         <div className="login-wrapper">
//           <div className="login-card">
//             <div className="header">
//               <h1 className="login-heading">LOGIN</h1>
//             </div>

//             <p className="register-link">
//               New to this Site? <a href="/register">Register</a>
//             </p>

//             <form onSubmit={handleSubmit}>
//               <div className="form-group">
//                 <label htmlFor="email">EMAIL</label>
//                 <input
//                   type="email"
//                   id="email"
//                   placeholder="hello@reallygreatsite.com"
//                   className="form-input"
//                   value={formData.email}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="password">PASSWORD</label>
//                 <input
//                   type="password"
//                   id="password"
//                   placeholder="********"
//                   className="form-input"
//                   value={formData.password}
//                   onChange={handleChange}
//                 />
//               </div>
                
//               <p className="forgot-password-link">
//                 <a href="/forgot-password">Forgot Password?</a>
//               </p> 

//               <button type="submit" className="login-button">
//                 Login
//               </button>
//             </form>
//           </div>

//           <div className="address-icon-container">
//             <FaAddressCard className="address-icon" />
//           </div>
//         </div>
//       </div>

//       <Footer/>
//     </>
//   );
// };

// export default LoginPage;







import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../components/css/LoginPage.css";
import { FaAddressCard, FaEnvelope, FaLock, FaUserCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validate = () => {
    const { email, password } = formData;

    if (!email || !password) {
      toast.warning("🚨 Oops! You forgot to fill out all the fields.", {
        position: "top-right",
        autoClose: 3000
      });
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.warning("📧 Hmm... that doesn't look like a valid email!", {
        position: "top-right",
        autoClose: 3000
      });
      return false;
    }

    if (password.length < 6) {
      toast.warning("🔒 Password must be at least 6 characters!", {
        position: "top-right",
        autoClose: 3000
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:4000/api/auth/login", formData);
      const { token, user } = response.data;
      
      localStorage.setItem("auth-token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userRole", user.role);
      
      toast.success("🎉 Login successful! Welcome back!", { autoClose: 2000 });
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1000);
    } catch (error) {
      toast.error("😟 Login failed! Please check your credentials.");
      setIsLoading(false);
    }
  };
    
  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-white p-3 rounded-full shadow-md transform -translate-y-2">
                  <FaUserCircle className="text-indigo-600 text-4xl" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-wider">
                WELCOME BACK
              </h2>
              <p className="mt-2 text-sm text-indigo-100">
                Sign in to your account to continue
              </p>
            </div>
            
            <div className="p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400"
                      placeholder="hello@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                      isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                  >
                    {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    {isLoading ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div>
                    <a
                      href="#"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </div>

                  <div>
                    <a
                      href="#"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign up now
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;