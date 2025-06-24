import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingModal from "../../../LoadingModal";

const BASE_URL = "https://hotelbooking-app-1d34f-default-rtdb.firebaseio.com/pincodes";

const initialState = {
  pincode: "",
  city: "",
  state: "",
  active: true,
  isEditMode: false,
  editId: "",
  searchTerm: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "EDIT_PIN":
      return {
        ...state,
        pincode: action.payload.pincode,
        city: action.payload.city,
        state: action.payload.state,
        active: action.payload.active,
        editId: action.payload.pincode,
        isEditMode: true,
      };
    case "RESET_FORM":
      return { ...initialState, searchTerm: state.searchTerm };
    default:
      return state;
  }
};

const ManagePincode = () => {
  const [pincodes, setPincodes] = useState({});
  const [loading, setLoading] = useState(false);
  const adminId = useSelector((state) => state.auth.roles.admin.id);
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchPincodes = async () => {
    setLoading(true);
    const res = await axios.get(`${BASE_URL}.json`);
    setPincodes(res.data || {});
    setLoading(false);
  };

  useEffect(() => {
    fetchPincodes();
  }, []);

const handleSubmit = async () => {
  const { pincode, city, state: st, active, isEditMode, editId } = state;
  if (!pincode || !city || !st) return toast.warn("Fill all fields");

  setLoading(true);

  if (isEditMode) {
    // If pincode value was changed, delete old key and insert new one
    if (pincode !== editId) {
      await axios.delete(`${BASE_URL}/${editId}.json`);
    }

    await axios.put(`${BASE_URL}/${pincode}.json`, {
      city,
      state: st,
      active,
      createdBy: adminId,
    });

    toast.success("Pincode updated!");
  } else {
    // Add new
    await axios.put(`${BASE_URL}/${pincode}.json`, {
      city,
      state: st,
      active,
      createdBy: adminId,
    });

    toast.success("Pincode added!");
  }

  dispatch({ type: "RESET_FORM" });
  fetchPincodes();
};


  const handleEdit = (code, data) => {
    dispatch({
      type: "EDIT_PIN",
      payload: {
        pincode: code,
        ...data,
      },
    });
  };

  const handleDelete = async (code) => {
    if (!window.confirm("Delete this pincode?")) return;
    await axios.delete(`${BASE_URL}/${code}.json`);
    toast.success("Deleted!");
    fetchPincodes();
  };

  const filtered = Object.entries(pincodes).filter(([code, data]) =>
    code.includes(state.searchTerm)
  );

  if (loading) return <LoadingModal />;

return (
  <div className="p-6 max-w-7xl mx-auto space-y-6">
    <h2 className="text-3xl font-bold text-gray-800 mb-4">Manage Pincodes</h2>

    {/* Form Row */}
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Add / Update Pincode</h3>
      <div className="grid md:grid-cols-6 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Search Pincode"
          value={state.searchTerm}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "searchTerm", value: e.target.value })
          }
          className="p-2 border rounded-md"
        />
        <input
          type="text"
          placeholder="Pincode"
          value={state.pincode}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "pincode", value: e.target.value })
          }
          className="p-2 border rounded-md"
        />
        <input
          type="text"
          placeholder="City"
          value={state.city}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "city", value: e.target.value })
          }
          className="p-2 border rounded-md"
        />
        <input
          type="text"
          placeholder="State"
          value={state.state}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "state", value: e.target.value })
          }
          className="p-2 border rounded-md"
        />
        <select
          value={state.active}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "active", value: e.target.value === "true" })
          }
          className="p-2 border rounded-md"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {state.isEditMode ? "Update" : "Add"}
        </button>
      </div>
    </div>

    {/* Table Display */}
    <div className="overflow-auto rounded-lg shadow border border-gray-200 bg-white">
      <table className="w-full table-auto text-left">
        <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
          <tr>
            <th className="p-3 border-b">Pincode</th>
            <th className="p-3 border-b">City</th>
            <th className="p-3 border-b">State</th>
            <th className="p-3 border-b">Status</th>
            <th className="p-3 border-b">Created By</th>
            <th className="p-3 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {filtered.map(([code, data]) => (
            <tr key={code} className="border-t hover:bg-gray-50 transition">
              <td className="p-3">{code}</td>
              <td className="p-3">{data.city}</td>
              <td className="p-3">{data.state}</td>
              <td className="p-3">{data.active ? "✅" : "❌"}</td>
              <td className="p-3">{data.createdBy}</td>
              <td className="p-3 text-center space-x-2">
                <button
                  onClick={() => handleEdit(code, data)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(code)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-gray-500 p-4">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

};

export default ManagePincode;
