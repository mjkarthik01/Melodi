import React from "react";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";

const Contact = () => {
  return (
    <div className="row contactus">
      <div className="col-md-6">
        <img src="./ContactUs.png" alt="contactus" style={{ width: "100%" }} />
      </div>
      <div className="col-md-4 mt-lg-4 mt-sm-auto">
        <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
        <p>
          Any Queries, Need info About product just give a call, We are here
          24/7 to assist you
        </p>
        <p className="mt-3">
          <BiMailSend /> : www.help@melodi.com
        </p>
        <p className="mt-3">
          <BiPhoneCall /> : 012-3456789
        </p>
        <p className="mt-3">
          <BiSupport /> : 1800-0000-0000 (toll free)
        </p>
      </div>
    </div>
  );
};

export default Contact;
