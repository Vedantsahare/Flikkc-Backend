import axios from "axios";

const sendOtp = async (phone, otp) => {
  const message = `Your Flikkc KYC verification OTP is ${otp}`;

  await axios.post(
    "https://www.fast2sms.com/dev/bulkV2",
    {
      route: "q",
      message,
      numbers: phone
    },
    {
      headers: {
        authorization: process.env.FAST2SMS_API_KEY
      }
    }
  );
};

export default sendOtp;