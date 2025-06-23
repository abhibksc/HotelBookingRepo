import { useEffect, useState } from "react";
import { GetAdminAllHotels, GetAllbooking_forAdmin, getUsersHotels } from "../../../CRUD Operations/Get";
import { useSelector } from "react-redux";


const Dashboard = () => {
  const UserId = useSelector((state) => state.auth.roles.admin.id);

  const [BookingList, setBookingList] = useState([]);
    const [hotels, setHotels] = useState([]);
  


      useEffect(() => {
        const fun = async () => {
          const response = await GetAllbooking_forAdmin();
          console.log(response);
    
          if (response.length > 0) {
            setBookingList(response);
          }


              const responsegetUsersHotels = await GetAdminAllHotels(UserId);
              console.log(responsegetUsersHotels);
              
                  if (responsegetUsersHotels.success) {
              console.log(responsegetUsersHotels);

                    setHotels(responsegetUsersHotels.hotels);
                  }
        };
    
        fun();
      }, []);

  return (
    <div className="p-4  bg-gray-100 min-h-screen ">
    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Total Booking</h2>
            <p className="text-2xl">{BookingList.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Available Hotels</h2>
            <p className="text-2xl">{hotels.length}</p>
        </div>
       
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Total Revenue</h2>
            <p className="text-2xl">7500</p>
        </div>
    </div>
    
</div>
  );
};

export default Dashboard;
