import emailjs from 'emailjs-com';

// Initialize EmailJS with the public key (API Key)
emailjs.init('LEF0SXcSWqcfO0us3');  // Replace with your public key

export const sendSignupOTP = (to_name, otp, from_name, from_phone, from_email) => {
  const templateParams = {
    to_name: to_name,
    otp: otp,
    from_name: from_name,
    from_phone: from_phone,
    from_email: from_email,
  };

  // Sending email using the template and returning a promise
  return emailjs.send('service_b8a6g3k', 'template_gphnf4d', templateParams)
    .then((response) => {
      console.log('OTP email sent successfully:', response);
      return response; // Ensure this is returned so it's accessible in handleSignUp
    })
    .catch((error) => {
      console.log('Error sending OTP email:', error);
      throw error;  // Propagate the error
    });
};



