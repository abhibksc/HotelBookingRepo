import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { GetAdminCategory } from "../../../../../CRUD Operations/Get";
import { StoreHotel_InDatabase } from "../../../../../CRUD Operations/Post";
import { toast } from "react-toastify";
import { UpdateHotel_InDatabase } from "../../../../../CRUD Operations/Edit";
import LoadingModal from "../../../../LoadingModal";

Modal.setAppElement("#root");

const AddHotelModal = ({ isOpen, onRequestClose, EditcurrentAvailability,onSubmitt }) => {
  const UserId = useSelector((state) => state.auth.roles.admin.id);
  const [categories, setCategories] = useState([]);
  const [loadin, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      hotelName: "",
      pricePerNight: "",
      address: "",
      city: "",
      pinCode: "",
      images: null,
      category: "",
      description: "",
      Status: 1,
    },
  });

  useEffect(() => {
    setLoading(true)

    const fetchCategories = async () => {
      const response = await GetAdminCategory(UserId);
      if (response?.length > 0) {
        setCategories(response);
    
      }

    setLoading(false)

    };
    fetchCategories();

  }, [UserId]);

  useEffect(() => {
    setLoading(true)

    console.log(EditcurrentAvailability);

    if (EditcurrentAvailability) {
      reset({
        hotelName: EditcurrentAvailability.hotelName || "",
        pricePerNight: EditcurrentAvailability.pricePerNight || "",
        address: EditcurrentAvailability.address || "",
        city: EditcurrentAvailability.city || "",
        pinCode: EditcurrentAvailability.pinCode || "",
        category: EditcurrentAvailability.category || "",
        description: EditcurrentAvailability.description || "",
        Status: EditcurrentAvailability.Status || 1,

        images: EditcurrentAvailability.images || null, // can't prefill files
      });
    }


    setLoading(false)

  }, [EditcurrentAvailability, reset]);

  const onSubmit = async (data) => {

    setLoading(true)

    console.log("Form Data:", data);

    if (EditcurrentAvailability) {
      const response = await UpdateHotel_InDatabase(
        EditcurrentAvailability.id,
        data
      );
      console.log(response.success);

      if (response.success) {
        onSubmitt();
        reset();
    setLoading(false)

        return;
      }
    setLoading(false)

      toast.error("Error During Updation!!!");
    }

    const response = await StoreHotel_InDatabase(data, UserId);

    console.log(response);

    if (response.success) {
    setLoading(false)

     onSubmitt();
      reset();

      return;
    }

    toast.error("Error during Adding an hotel");
  };


  if(loadin) return <LoadingModal/>


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add/Edit Hotels"
      className="p-4 bg-white shadow rounded-md h-full xl:h-[500px] overflow-y-auto w-full max-w-lg hide-scrollbar"
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <h2 className="text-xl font-semibold mb-4">
        {EditcurrentAvailability ? "Edit" : "Add"} Hotel
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Hotel Name</label>
          <input
            {...register("hotelName", { required: true })}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Enter Hotel name"
          />
          {errors.placeName && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Price per Night</label>
          <input
            type="number"
            {...register("pricePerNight", { required: true })}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Enter price"
          />
          {errors.pricePerNight && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Place Address</label>
          <input
            {...register("address", { required: true })}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Enter address"
          />
          {errors.address && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            {...register("city", { required: true })}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Enter city"
          />
          {errors.city && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">PIN Code</label>
          <input
            {...register("pinCode", { required: true })}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Enter PIN code"
          />
          {errors.pinCode && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Images</label>
          <input
            placeholder="Image url"
            type="text"
            multiple
            {...register("images")}
            className="mt-1 block w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            {...register("category", { required: true })}
            className="mt-1 block w-full p-2 border rounded-md"
          >
            
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Enter description"
          />
          {errors.description && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            {...register("Status", { required: true })}
            className="mt-1 block w-full p-2 border rounded-md"
          >
            <option value="">Select Availability</option>
            <option key={1} value={1}>
              Available
            </option>
            <option key={0} value={0}>
              Not Available
            </option>
          </select>
          {errors.category && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>

        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Save
        </button>
      </form>
    </Modal>
  );
};

export default AddHotelModal;
