import axios from "axios";
import { DbUrl } from "../Components/Constants/URLs";
import GetExpense from "./Get";
import { json } from "react-router-dom";


import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/Firebase";



export const PostExpense = async (payload) => {
  const { amount, description, category, userId } = payload;

  let response = await fetch(`${DbUrl}${userId}.json`, {
    method: "POST",
    body: JSON.stringify({
      amount,
      description,
      category,
    }),
  });

  let data = await response.json();

  if (data.error) {
    return alert(data.err.message);
  } else {
    alert("Item Added");
    return GetExpense(userId);
  }
};

export const checkPincodeAvailability = async (pincode) => {
  console.log(pincode);

  let response = await fetch(`${DbUrl}pincodes/${pincode}.json`);

  let data = await response.json();
  console.log(data);

  if (data.error) {
    return alert(data.err.message);
  }

  return data;
};

// SignupWith_SuperAdmin

export const signupApi = async (email, password, userType) => {
  try {
    // Step 1: Create user using Firebase Auth REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBtNlKb92WJl-U8eL-hdxzfIG5gdKJKcAA`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const idToken = data.idToken; // from signup response

    const { localId } = data; // Firebase UID
    const rolePath = userType === "SuperAdmin" ? "SuperAdmin" : "Admin";

    // Step 2: Store user info in Realtime DB under Roles
    const dbResponse = await fetch(
      `https://hotelbooking-app-1d34f-default-rtdb.firebaseio.com/Roles/${rolePath}/${localId}.json?auth=${idToken}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          userType,
          createdAt: new Date().toISOString(),
        }),
      }
    );

    const dbData = await dbResponse.json();

    return {
      success: true,
      message: "Signup and DB entry successful",
      uid: localId,
      dbData,
    };
  } catch (error) {
    console.error("Signup failed:", error.message);
    return {
      success: false,
      message: error.message,
    };
  }
};

// AdminSingIn

export const AdminSingIn = async (email, password, userType) => {
  const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBtNlKb92WJl-U8eL-hdxzfIG5gdKJKcAA", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
      returnSecureToken: true,
    }),
  });
  console.log(response);
  

  const data = await response.json();
  console.log(data);

  return data;
  
};



export async function postAdminsWithCategories(newCategory,UserId,newCategoryImages) {

  console.log(newCategory);
  console.log(UserId);
  console.log(newCategoryImages);
  console.log();
  
 try {
    const res = await fetch(
      "https://hotelbooking-app-1d34f-default-rtdb.firebaseio.com/categories.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({

              name: newCategory,
    createdBy: UserId,
    UpdatedBy: UserId,

    
        image: newCategoryImages,
    createdAt: new Date().toISOString(),
       updatedAt: new Date().toISOString()

        })
      }
    );

    if (res.ok) {

      alert("✅ Category added successfully!");
      return await res.json();
    } else {
      alert("❌ Failed to add category.");
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Error adding category.");
  }
}

// StoreHotel_InDatabase




export async function StoreHotel_InDatabase(data,UserId) {
  try {
    // Prepare the hotel object
    const hotelData = {
      hotelName: data.hotelName,
      pricePerNight: data.pricePerNight,
      address: data.address,
      city: data.city,
      pinCode: data.pinCode,
      category: data.category, // Ideally this should be categoryId, adjust as needed
      description: data.description,
      images: data.images,
      createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString(),
            createdBy: UserId,
            Status : data.Status
    };

    console.log(hotelData);
    

    // Store in /hotels (auto-generated id)
    const response = await fetch(`${DbUrl}/hotels.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hotelData),
    });

    const result = await response.json();

    if (result?.name) {
      console.log("Hotel stored with ID:", result.name);

      // (Optional) Store a reference under the category
      await fetch(`${DbUrl}/categories/${data.category}/hotels/${result.name}.json`, {
        method: "PUT",
        body: JSON.stringify(true),
      });

      return { success: true, id: result.name };
    } else {
      throw new Error("Failed to save hotel");
    }
  } catch (error) {
    console.error("Error storing hotel:", error);
    return { success: false, error: error.message };
  }
}




export async function BookingStatus(DataBase_id, status) {
  try {
    const response = await fetch(`${DbUrl}/bookings/${DataBase_id}.json`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update booking status");
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false, message: error.message };
  }
}







