import React, { useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier } from '../../firebase/Firebase';
import Lottie from 'lottie-react';
import animationData from "../../assets/adminHero.json";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminToken } from '../../ReduxStore/Slices/auth';

const Signin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);

  const dispatch = useDispatch();
  const admintoken = useSelector((state) => state.auth.admintoken);
  const navigate = useNavigate();

  useEffect(() => {
    if (admintoken) {
      console.log("Chala");
      navigate("/admin/dashboard");
    }
   
  }, [admintoken, navigate]);

  useEffect(() => {
    if (!auth) {
      console.error('Auth not initialized');
      return;
    }

    try {
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          console.log('reCAPTCHA solved:', response);
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      }, auth);
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
    }

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      console.log('Firebase token:', token);

      localStorage.setItem("admintoken", token);
      // dispatch(adminToken({ adminToken : token }));

      if (token) {
        console.log("Chala");
         dispatch(adminToken({ adminToken: token }));
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const signInWithPhoneNumberHandler = async () => {
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setVerificationId(confirmationResult.verificationId);
    } catch (error) {
      console.error('Error sending verification code:', error);
    }
  };

  const verifyCode = async () => {
    try {
      if (!verificationId) {
        console.error('No verification ID');
        return;
      }

      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      const result = await auth.signInWithCredential(credential);
      const token = await result.user.getIdToken();
      console.log('Firebase token:', token);

      localStorage.setItem("admintoken", token);
      dispatch(adminToken({ adminToken: token }));

      navigate("/admin/dashboard");
    } catch (error) {
      console.error('Error verifying code:', error);
    }
  };

  return (
    <div className="h-screen w-screen bg-white flex justify-center items-center">
      <div className='flex flex-col xl:flex-row justify-center items-center self-center gap-6 w-full h-full'>
        <div className="w-full xl:w-1/2 flex justify-center items-center">
          <Lottie 
            animationData={animationData} 
            loop={true} 
            style={{ width: '100%', maxWidth: 500, height: 'auto' }} 
          />
        </div>
        <div className="w-full xl:w-1/3 flex flex-col items-center p-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Welcome</h1>
          <div className="mb-4 w-full">
            <input
              type="text"
              placeholder="Phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border px-4 py-2 rounded w-full focus:outline-none"
            />
            <button
              onClick={signInWithPhoneNumberHandler}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full transition transform hover:scale-105"
            >
              Send Verification Code
            </button>
          </div>
          {verificationId && (
            <div className="mb-4 w-full">
              <input
                type="text"
                placeholder="Verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="border px-4 py-2 rounded w-full focus:outline-none"
              />
              <button
                onClick={verifyCode}
                className="bg-green-500 text-white px-4 py-2 rounded mt-2 w-full transition transform hover:scale-105"
              >
                Verify Code
              </button>
            </div>
          )}
          <button
            onClick={signInWithGoogle}
            className="bg-red-500 text-white px-4 py-2 rounded mb-4 transition transform hover:scale-105"
          >
            Sign in with Google
          </button>
          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
