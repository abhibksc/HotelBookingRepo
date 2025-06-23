import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { postAdminsWithCategories } from "../../../../../CRUD Operations/Post";
import { useSelector } from "react-redux";
import { GetAdminAllHotels } from "../../../../../CRUD Operations/Get";
import { editCategory } from "../../../../../CRUD Operations/Edit";
import { deleteHotel } from "../../../../../CRUD Operations/Delete";
import { toast } from "react-toastify";
import AddHotelModal from "./AddHotelModal";
import LoadingModal from "../../../../LoadingModal";

Modal.setAppElement("#root"); // Ensure this is the root element of your application

const HotelManagement = () => {
  const [loadin, setLoading] = useState(false);
  const [addHotel, setAddHotel] = useState(false);
  const [currentAvailability, setCurrentAvailability] = useState(null);
  const UserId = useSelector((state) => state.auth.roles.admin.id);
  const [HotelsList, setHotelsList] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fun = async () => {
      const response = await GetAdminAllHotels(UserId);
      console.log(response);

      if (response?.success) {
        setHotelsList(response?.hotels);
        setLoading(false);

        return;
      }

      toast.error("Data is Not Fetching!!!!!!!!!!!!");
      setLoading(false);
    };

    fun();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);

    const response = await deleteHotel(id);

    if (response) {
      setHotelsList(HotelsList.filter((hotel) => hotel.id !== id));
    } else {
      toast.error("Error during Delete");
    }

    setLoading(false);
  };

  const handleOnSubmitt = async () => {
    setLoading(true);

    const response = await GetAdminAllHotels(UserId);
    console.log(response);

    if (response?.success) {
      setHotelsList(response?.hotels);

      setCurrentAvailability("");
      setAddHotel(false);
      setLoading(false);

      return;
    }

    setLoading(false);
  };

  if (loadin) return <LoadingModal />;

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Hotel Management</h1>
        <button
          onClick={() => setAddHotel(!addHotel)}
          className="border-blue-200 bg-blue-500 p-1 rounded-lg px-2 text-white"
        >
          {addHotel ? "Close" : "Add Hotels"}
        </button>
      </header>

      {/* Add Edit Hotel */}

      <AddHotelModal
        isOpen={addHotel}
        onRequestClose={() => {
          setCurrentAvailability("");
          setAddHotel(false);
        }}
        EditcurrentAvailability={currentAvailability}
        onSubmitt={handleOnSubmitt}
      />

      <section className="p-4 bg-white shadow rounded-md">
        <h2 className="text-xl font-semibold mb-4">Hotel List</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2 border-b">s.no</th>
              <th className="p-2 border-b">Image</th>

              <th className="p-2 border-b">Hotel Name</th>
              <th className="p-2 border-b">Category</th>
              <th className="p-2 border-b">Status</th>
              <th className="p-2 border-b">Price/Night</th>
              <th className="p-2 border-b">Description</th>
              <th className="p-2 border-b">Address</th>

              <th className="p-2 border-b">Edit</th>
              <th className="p-2 border-b">Delete</th>
            </tr>
          </thead>
          <tbody>
            {HotelsList.map((item, index) => (
              <tr key={item.id}>
                <td className="p-2 border-b">{index + 1}</td>
                <td className="p-2 border-b">
                  <img
                    src={item.images}
                    className="h-10 w-10 rounded-lg"
                    alt="img"
                  />
                </td>

                <td className="p-2 border-b">{item.hotelName}</td>
                <td className="p-2 border-b">{item.category}</td>
                <td className="p-2 border-b">
                  {item.Status == 1 ? "Available" : "Not Available"}
                </td>
                <td className="p-2 border-b">{item.description}</td>

                <td className="p-2 border-b">{item.pricePerNight}</td>
                <td className="p-2 border-b">{item.address}</td>

                <td className="p-2 border-b">
                  <button
                    className="text-blue-500 mr-2"
                    onClick={() => {
                      setCurrentAvailability(item);
                      setAddHotel(true);
                    }}
                  >
                    Edit
                  </button>
                </td>

                <td className="p-2 border-b">
                  <button
                    className="text-red-500 mr-2"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default HotelManagement;
