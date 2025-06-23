import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";






const useImportUserDetails = () => {
  const dispatch = useDispatch();

  const importDetails = async (
  ) => {


    const User_login = localStorage.getItem("userToken");
    const Admin_login = localStorage.getItem("adminToken");
    const SuperAdmin_login = localStorage.getItem("superAdminToken");


    if (login) {


        toast.warn("Please login");

      

        
    } 
    else if(Admin_login) {
      toast.warn("Please login");
    }
    else if(SuperAdmin_login) {
      toast.warn("Please login");
    } else {
      toast.warn("Please login");
    }
  };


  return { importDetails };
};

export default useImportUserDetails;
