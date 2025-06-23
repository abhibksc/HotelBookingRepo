import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import LoadingModal from "../LoadingModal";
import animationData from "../../assets/animations/superadmin.json";
import { DbUrl } from "../Constants/URLs";
import { sendSignupOTP } from "../SendSignupOTP";
import { AdminSingIn, signupApi } from "../../CRUD Operations/Post";
import { AdminSignin } from "../../ReduxStore/Slices/auth";

const AdminSuperAdminAuth = () => {
  const [authMethod, setAuthMethod] = useState("email");
  const [userType, setUserType] = useState("admin"); // Default user type
  const [otpSent, setOtpSent] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [inputOtp, setInputOtp] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchUserRoles = async () => {
      try {
        const response = await fetch(`${DbUrl}Roles.json`);
        console.log(response);
        let data = await response.json();
        console.log(data);

        if (data) {
          console.log(data);
          setUserRoles(["admin"]); // Store all roles
          // setUserType(response); // Optionally set the first role as default
        }
      } catch (error) {
        console.error("Error fetching user roles:", error);
      }

      setLoading(false);
    };
    fetchUserRoles();
  }, []);





  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    navigate(`/${e.target.value}/login`);
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (generatedOtp && !inputOtp) {
      setLoading(false);

      return toast.warn("Please enter the OTP");
    }

    if (inputOtp && generatedOtp) {
      if (inputOtp !== generatedOtp) {
        setLoading(false);

        return toast.warn("Invalid Otp");
      }

      // validated!!!!!!!!!

      // userType,
      // email,
      // password,

      console.log(userType);

      if (userType == "admin") {
        try {
          const response = await signupApi(email, password, userType);
          console.log(response);
          console.log(response.success);

          if (response.success) {
            setLoading(false);

            await handleSignIn("SingUp");

            // dispatch(
            //   AdminSignup({
            //     token: response.uid,
            //     registered: true,
            //     id: response.uid,
            //     name: response?.dbData?.uid || null,
            //     email: response?.dbData?.email || null,
            //     phone: response?.dbData?.phone || null,
            //     dob: null,
            //     gender: null,
            //   })
            // );

            // setInputOtp("");
            // setGeneratedOtp("");
            // setPassword("");
            // setEmail("");

            // navigate(`/admin/${response.uid}/dashboard`);

            return;
          } else {
            setLoading(false);

            toast.success(response.message);
          }

          return;
        } catch (error) {
          console.log("Error during OTP send:", error); // Handle any errors that occur
          toast.error(error);
          return;
        }
      }
    }

    if (!email) {
      setLoading(false);

      return toast.warn("Please fill email");
    }

    if (!password) {
      setLoading(false);

      return toast.warn("Please fill password");
    }

    const generateOtp = generateOTP();

    try {
      // to_name, otp, from_name, from_phone, from_email
      const sendOtp = await sendSignupOTP(
        "abhishek",
        generateOtp,
        "rishi",
        null,
        "yuviabhishek269@gmail.com"
      );

      console.log(sendOtp); // This should now correctly log the response or error

      if (sendOtp.status === 200) {
        setGeneratedOtp(generateOtp);
        toast.success("Otp Sent Successfully");
      }
    } catch (error) {
      console.log("Error during OTP send:", error); // Handle any errors that occur
    } finally {
      setLoading(false);
    }
  };

  // ResendOtp
  const ResendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      setLoading(false);

      return toast.warn("Please fill email");
    }

    if (!password) {
      setLoading(false);

      return toast.warn("Please fill password");
    }

    const generateOtp = generateOTP();

    try {
      // to_name, otp, from_name, from_phone, from_email
      const sendOtp = await sendSignupOTP(
        "abhishek",
        generateOtp,
        "rishi",
        null,
        "yuviabhishek269@gmail.com"
      );

      console.log(sendOtp); // This should now correctly log the response or error

      if (sendOtp.status === 200) {
        setGeneratedOtp(generateOtp);
        toast.success("Resend Otp");
      }
    } catch (error) {
      console.log("Error during OTP send:", error); // Handle any errors that occur
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (message) => {
    setLoading(true);

    if (!email) {
      setLoading(false);
      return toast.warn("Please fill email");
    }

    if (!password) {
      setLoading(false);
      return toast.warn("Please fill password");
    }

    try {
      const response = await AdminSingIn(email, password, userType);

      if (response.idToken) {
        dispatch(
          AdminSignin({
            idToken: response.idToken,
            localId: response.localId,
            name: response?.name || null,
            email: response?.email || null,
            phone: response.phone || null,
            dob: null,
            gender: null,

            kind: response.kind || null,

            displayName: response.displayName || null,
            refreshToken: response.refreshToken || null,
            expiresIn: response.expiresIn || null,
            registered: response.registered || false,
          })
        );

        setInputOtp("");
        setGeneratedOtp("");
        setPassword("");
        setEmail("");

        navigate(`/admin/${response.idToken}/dashboard`);
        toast.success(`${message} Successful!`);

        return;
      } else {
        // Error from Firebase - usually a message inside 'error'
        toast.error(response.error?.message || "Login failed");
      }
    } catch (error) {
      console.log("Error during SignIn:", error);
      toast.error("Something went wrong during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white via-yellow-200 to">
      {loading && <LoadingModal />}
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg relative overflow-hidden">
        <Lottie
          animationData={animationData}
          loop={true}
          className="absolute top-0 left-0 w-full h-full opacity-30 bg-slate-100"
        />
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
            Administrator
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              User Type:
            </label>
            <select
              value={userType}
              onChange={handleUserTypeChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {userRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {generatedOtp && (
              <div className="flex gap-3">
                <input
                  type="otp"
                  placeholder="OTP"
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value)}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={(e) => ResendOtp(e)}
                  type="submit"
                  className="w-40 h-10 my-auto  text-white bg-blue-700 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Resend
                </button>
              </div>
            )}
            <button
              onClick={(e) => {
                handleSignIn("Login");
              }}
              type="submit"
              className="w-full p-3 mt-4 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign In
            </button>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={(e) => {
                handleSignUp(e);
              }}
              className="w-full p-3 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <i className="fab fa-google"></i> Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSuperAdminAuth;
