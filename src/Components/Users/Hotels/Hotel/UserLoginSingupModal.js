import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IsOpenAuthModal,
  UserSignin,
  UserSignup,
} from "../../../../ReduxStore/Slices/auth";
import { LOGIN_URL, SIGNUP_URL } from "../../../Constants/URLs";
import { toast } from "react-toastify";

const DB_URL = "https://hotelbooking-app-1d34f-default-rtdb.firebaseio.com";

const UserLoginSingupModal = () => {
  const isOpenAuthModal = useSelector((state) => state.auth.isOpenAuthModal);
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    identifier: "", // phone or email
    password: "",
  });

const handleSubmit = async (e) => {
  e.preventDefault();
  const url = isLogin ? LOGIN_URL : SIGNUP_URL;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: formData.identifier,
        password: formData.password,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Authentication failed!");
    }

    const { idToken, localId, email, refreshToken, expiresIn, kind, displayName } = data;

    if (!isLogin) {
      // ✅ SIGNUP: Create user record in DB
      await fetch(`${DB_URL}/Roles/Users/${localId}.json`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          createdAt: new Date().toISOString(),
        }),
      });

      dispatch(
        UserSignup({
          token: idToken,
          registered: true,
          userId: localId,
          name: "",
          email: email,
          phone: "",
          dob: "",
          gender: "",

          fullAddress: "",
          city: "",
          state: "",
          country: "",
          pincode: "",

          kind,
          displayName,
          refreshToken,
          expiresIn,
        })
      );
      toast.success("Successfully SignedUp")

    } else {
      // ✅ LOGIN: Fetch user details
      const userRes = await fetch(`${DB_URL}/Roles/Users/${localId}.json`);
      const userExists = await userRes.json();

      if (!userExists) {
        throw new Error("User not registered in system roles!");
      }

      dispatch(
        UserSignin({
          token: idToken,
          registered: true,
          localId,
          name: userExists.name || "",
          email: userExists.email || "",
          phone: userExists.phone || "",
          dob: userExists.dob || "",
          gender: userExists.gender || "",

          fullAddress: userExists.address?.fullAddress || "",
          city: userExists.address?.city || "",
          state: userExists.address?.state || "",
          country: userExists.address?.country || "",
          pincode: userExists.address?.pincode || "",

          kind,
          displayName,
          refreshToken,
          expiresIn,
        })
      );

      toast.success("Successfully LoggedIn")
    }

    dispatch(IsOpenAuthModal(false)); // ✅ Close modal on success
  } catch (err) {
    console.error("Firebase Auth Error:", err.message);
    alert(err.message);
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
        <button
          onClick={() => dispatch(IsOpenAuthModal(false))}
          className="absolute top-3 right-3 text-xl text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login to Continue" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email / Phone</label>
            <input
              type="text"
              value={formData.identifier}
              onChange={(e) =>
                setFormData({ ...formData, identifier: e.target.value })
              }
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default UserLoginSingupModal;
