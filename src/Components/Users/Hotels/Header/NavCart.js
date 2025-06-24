import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";



import { MdOutlineShoppingCart } from "react-icons/md";
import { IsOpenAuthModal } from "../../../../ReduxStore/Slices/auth";

const NavCart = ({page , showSticky}) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userToken = useSelector((state) => state.auth.tokens.userToken);


 



  

  return (
     <li
                className={`
                  
                  ${

                    showSticky ? 

                    "text-white"
                    :

                    "text-black"
                  }
                  flex text-[12px] gap-1 items-center cursor-pointer relative py-1`}
                onClick={() => userToken ? navigate(`/bookings/Cart/${userToken}`) : dispatch(IsOpenAuthModal(true))}
              >
                <MdOutlineShoppingCart className="w-6 h-6 mt-1" />
                <span className="mt-1 ">Booking Cart</span>
                {/* {reduxcartItems.data.length > 0 && (
                  <span className="absolute top-1 right-10 bg-red-500   text-white text-sm rounded-full px-1 ">
                    {reduxcartItems.data.length}
                  </span>
                )} */}
              </li>
  );
};

export default NavCart;