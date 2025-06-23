import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { GetAdminCategory } from "../../../../../CRUD Operations/Get";
import { editCategory } from "../../../../../CRUD Operations/Edit";
import { deleteCategory } from "../../../../../CRUD Operations/Delete";
import { postAdminsWithCategories } from "../../../../../CRUD Operations/Post";
import LoadingModal from "../../../../LoadingModal";

Modal.setAppElement("#root"); // Ensure this is the root element of your application

const MainCategory = () => {
    const [loadin, setLoading] = useState(false);
  
  const [editCategoryModal, setEditCategoryModal] = useState(false);

  const UserId = useSelector((state) => state.auth.roles.admin.id);

  const [categories, setCategories] = useState([]);

  const [newCategory, setNewCategory] = useState("");
  const [newCategoryImages, setNewCategoryImages] = useState("");

  const [EditCategoryId, setEditCategory_id] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true)

    const fun = async () => {
      const response = await GetAdminCategory(UserId);
      console.log(response);

      if (response?.length > 0) {
        setCategories(response);
      }
    setLoading(false)

    };

    fun();
  }, []);

  const handleAddCategory = async () => {
    setLoading(true)

    console.log("Chalal");

    if (editCategoryModal) {
      const response = await editCategory(
        EditCategoryId,
        newCategory,
        UserId,
        newCategoryImages
      );

      console.log(response);

      if (response) {
        setCategories((prev) =>
          prev.map((item) =>
            item.id === EditCategoryId ? { ...item, ...response } : item
          )
        );

        setNewCategory("");
        setNewCategoryImages("");
        setEditCategoryModal(false);
        setEditCategory_id("");
      }
    setLoading(false)

      return;
    }

    if (newCategory) {
      const response = await postAdminsWithCategories(
        newCategory,
        UserId,
        newCategoryImages
      );
      console.log(response);
      console.log(newCategoryImages);

      if (response) {
        setCategories([
          ...categories,
          {
            id: categories.length + 1,
            name: newCategory,
            localId: UserId,
            image: newCategoryImages,
          },
        ]);
        setNewCategory("");
        setNewCategoryImages("");
      }

    setLoading(false)

    }
  };

  const handleEditCategory = async (category) => {
    setLoading(true)

    setEditCategory_id(category.id);
    setNewCategory(category.name);
    setNewCategoryImages(category.image);

    setEditCategoryModal(true);
    setLoading(false)

  };

  const handleDeleteCategory = async (categoryId) => {
    setLoading(true)

    const response = await deleteCategory(categoryId);

    if (response) {
      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );
    } else {
      toast.error("Error during Delete");
    }

    setLoading(false)

  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if(loadin) return <LoadingModal/>


  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Category Management</h1>
      </header>

      {/* Add Edit Category */}

      <section className="p-4 bg-white shadow rounded-md">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Category Management</h2>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search Categories"
              className="p-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="text"
              placeholder="New Category"
              className="p-2 border rounded-md"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="image url"
              className="p-2 border rounded-md"
              value={newCategoryImages}
              onChange={(e) => setNewCategoryImages(e.target.value)}
              required
            />

            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              {editCategoryModal ? "Edit" : "Add"}
            </button>
          </div>
        </header>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2 border-b">Image</th>
              <th className="p-2 border-b">Category Name</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          {console.log(filteredCategories)}
          <tbody>
            {filteredCategories.length >0 &&  filteredCategories.map((category) => (
              <tr key={category.id}>
                <td className="p-2 border-b">
                  <img className="h-10 w-10" src={category.image} alt="image" />
                </td>

                <td className="p-2 border-b">{category.name}</td>
                <td className="p-2 border-b">
                  <button
                    className="text-blue-500 mr-2"
                    onClick={() => handleEditCategory(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDeleteCategory(category.id)}
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

export default MainCategory;
