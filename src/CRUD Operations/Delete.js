import { DbUrl } from "../Components/Constants/URLs";

import GetExpense from "./Get";


const DeleteExpense = async(userId,id)=>{

    console.log(userId, id);
    try {
      let response = await fetch(
        `${DbUrl}${userId}/${id}.json`,
        {
          method: "DELETE",
        }
      );

      alert("🗑 deleted")
  
      return GetExpense(userId);
    } catch (err) {
      console.log(err);
    }
}

export default DeleteExpense;


export async function deleteCategory(categoryId) {
  try {
    const res = await fetch(
      `https://hotelbooking-app-1d34f-default-rtdb.firebaseio.com/categories/${categoryId}.json`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      alert("🗑️ Category deleted successfully!");

      return res.ok;
    } else {
      alert("❌ Failed to delete category.");
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Error deleting category.");
  }
}





export async function deleteHotel(id) {
  try {
    const res = await fetch(
      `https://hotelbooking-app-1d34f-default-rtdb.firebaseio.com/hotels/${id}.json`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      alert("🗑️ Category deleted successfully!");

      return res.ok;
    } else {
      alert("❌ Failed to delete category.");
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Error deleting category.");
  }
}
