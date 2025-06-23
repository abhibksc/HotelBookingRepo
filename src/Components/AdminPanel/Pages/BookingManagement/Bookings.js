import React, { useEffect, useState } from "react";
import {
  GetAllbooking_forAdmin,
  GetAllBookingList,
} from "../../../../CRUD Operations/Get";
import { BookingStatus } from "../../../../CRUD Operations/Post";

const Bookings = () => {
  const [BookingList, setBookingList] = useState([]);

  useEffect(() => {
    const fun = async () => {
      const response = await GetAllbooking_forAdmin();
      console.log(response);

      if (response.length > 0) {
        setBookingList(response);
      }
    };

    fun();
  }, []);


  const handleStatus = async(books)=>{


    if(books.status == "pending"){

        const response = await BookingStatus(books.DataBase_id,  "Approved");
        console.log(response);

        if(response.success){

             const response = await GetAllbooking_forAdmin();
      console.log(response);

      if (response.length > 0) {
        setBookingList(response);
      }

        }
        

    }
    else{

        
        const response = await BookingStatus(books.DataBase_id, "pending");
        console.log(response);

    }

  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Booking Management</h1>
      <div className="p-4 bg-white shadow rounded-md">
        <h2 className="text-xl font-semibold mb-4">Booking List</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2 border-b">Booking Id</th>
              <th className="p-2 border-b">User Name</th>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Guest</th>
              <th className="p-2 border-b">Hotel Name</th>
              <th className="p-2 border-b">Total Price</th>
              <th className="p-2 border-b">CheckIn</th>
              <th className="p-2 border-b">CheckOut</th>

              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {BookingList.map((books) => (
              <tr key={books.id}>
                <td className="p-2 border-b">{books.id ? books.id : "N/A"}</td>

                <td className="p-2 border-b">
                  {books?.name ? books?.name : "N/A"}
                </td>
                <td className="p-2 border-b">
                  {books.userEmail ? books.userEmail : "N/A"}
                </td>
                <td className="p-2 border-b">
                  {books.guests ? books.guests : "N/A"}
                </td>
                <td className="p-2 border-b">
                  {books.hotelName ? books.hotelName : "N/A"}
                </td>
                <td className="p-2 border-b">
                  {books.totalPrice ? books.totalPrice : "N/A"}
                </td>
                <td className="p-2 border-b">
                  {books.checkIn ? books.checkIn : "N/A"}
                </td>
                <td className="p-2 border-b">
                  {books.checkOut ? books.checkOut : "N/A"}
                </td>
                <td className="p-2 border-b" onClick={()=>handleStatus(books)}>
                  <button className={`${books.status === "pending" ? "text-red-500" : "text-green-500"} border p-2 rounded-lg shadow-lg`}>{books.status}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
