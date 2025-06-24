import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminPanel from "../../Components/AdminPanel/AdminPanel";


const UserTypeHandler = () => {
  const { userType, token } = useParams();
  const adminToken = useSelector((state) => state?.auth?.tokens?.adminToken);

  useEffect(() => {
    document.title = "Hotel Administrator";
  }, []);

  if (userType === "admin" && token === adminToken) {
    return <AdminPanel />;
  }

  return <h1>Unauthorized or Invalid Token</h1>;
};

export default UserTypeHandler;
