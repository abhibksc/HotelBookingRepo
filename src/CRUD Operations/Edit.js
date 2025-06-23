import { DbUrl } from "../Components/Constants/URLs";

import GetExpense from "./Get";

const EditExpense = async (userId, id, data) => {
  const { amount, category, description } = data;

  try {
    let response = await fetch(`${DbUrl}${userId}/${id}.json`, {
      method: "PUT",
      body: JSON.stringify({
        amount,
        description,
        category,
      }),
    });
    let data = await response.json();
    if (data.error) return alert(data.error.message);
    else {
      return GetExpense(userId);
    }
  } catch (err) {
    console.log(err);
  }
};

export const UpdateProfile = async (payload) => {
  const { Name, UserName, userId, ragistered, imgFile } = payload;
  console.log(Name);
  console.log(UserName);
  console.log(userId);
  console.log(ragistered);
  console.log(imgFile);

  try {
    if (ragistered && userId) {
      if (imgFile && UserName && Name) {
        let response = await fetch(`${DbUrl}${userId}/Profile.json`, {
          method: "PUT",
          body: JSON.stringify({
            UserName: UserName,
            ProfileImageToken: imgFile,
            Name: Name,
          }),
        });
        let data = await response.json();
        return data;
      } else if (!imgFile && UserName && Name) {
        console.log(imgFile);
        console.log(UserName);
        console.log(Name);

        let response = await fetch(`${DbUrl}${userId}/Profile.json`, {
          method: "PUT",
          body: JSON.stringify({
            UserName: UserName,
            ProfileImageToken: "not Assigned",
            Name: Name,
          }),
        });
        let data = await response.json();
        return data;
      } else if (imgFile && UserName && !Name) {
        let response = await fetch(`${DbUrl}${userId}/Profile.json`, {
          method: "PUT",
          body: JSON.stringify({
            UserName: UserName,
            ProfileImageToken: imgFile,
            Name: "not Assigned",
          }),
        });
        let data = await response.json();

        return data;
      } else if (!imgFile && UserName && !Name) {
        let response = await fetch(`${DbUrl}${userId}/Profile.json`, {
          method: "POST",
          body: JSON.stringify({
            UserName: UserName,
            ProfileImageToken: "not Assigned",
            Name: "not Assigned",
          }),
        });
        let data = await response.json();

        return data;
      } else {
        console.log("imgFile && UserName && Name nothing you have");
      }
    } else {
      console.log("You are not ragistered!!");
    }
  } catch (err) {
    console.log(err);
  }
};

export const UpdateProfileImage = async ({
  Name,
  userId,
  UserName,
  imgFile,
  ragistered,
}) => {
  try {
    if (
      ragistered &&
      (userId !== "" || userId !== undefined) &&
      imgFile &&
      UserName
    ) {
      console.log(imgFile);
      const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/social-media-6a985.appspot.com/o?name=${userId}/Profile/imgFile`;
      const response = await axios.post(uploadUrl, imgFile, {
        headers: {
          "Content-Type": imgFile.type,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // setUploadProgress(progress);
        },
      });
      console.log("Upload successful", response);

      const data = await UpdateProfile({
        Name,
        UserName,
        userId,
        ragistered,
        imgFile: response.data.downloadTokens,
      });

      alert("Photo Updated");
      return data;
    } else {
      console.log("you are not ragistered");
    }
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

export default EditExpense;

export async function editCategory(
  EditCategoryId,
  newCategory,
  UserId,
  newCategoryImages
) {
  try {
    const res = await fetch(
      `https://hotelbooking-app-1d34f-default-rtdb.firebaseio.com/categories/${EditCategoryId}.json`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategory,
          UpdatedBy: UserId,
          image: newCategoryImages,
          updatedAt: new Date().toISOString(),
        }),
      }
    );

    if (res.ok) {
      alert("✅ Category updated successfully!");
      return await res.json();
    } else {
      alert("❌ Failed to update category.");
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Error updating category.");
  }
}


// CRUD Operations/Put.js

export async function UpdateHotel_InDatabase(hotelId, data) {
  try {
    const response = await fetch(`${DbUrl}/hotels/${hotelId}.json`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update hotel");
    }

    const dataa = await response.json();
    return { success: true, dataa };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, error: error.message };
  }
}

