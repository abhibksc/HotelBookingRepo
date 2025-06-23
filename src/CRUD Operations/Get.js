import { DbUrl } from "../Components/Constants/URLs";

const GetExpense = async (userId) => {
  let response = await fetch(`${DbUrl}${userId}.json`);

  let data = await response.json();

  if (data !== null) {
    let arr = [];
    for (let key in data) {
      data[key].id = key;
      arr.push(data[key]);
    }
    arr = arr.reverse();
    return arr;
  }
};

export const GetProfileImage = async ({ userId }) => {
  const data = await fetch(
    `${DbUrl}${userId}.json`,

    {
      method: "GET",
    }
  );

  let response = await data.json();

  if (response !== null) {
    if (response.Profile.ProfileImageToken) {
      return response.Profile.ProfileImageToken;
    } else {
      alert("Please Set Profile Pic");
    }
  } else {
    console.log("Haaan yehi chala");
    alert("Please Signup");
  }
};

export const GetUserName = async ({ userId }) => {
  let url = `${DbUrl}/${userId}.json`;

  const data = await fetch(
    `${DbUrl}/${userId}.json`,

    {
      method: "GET",
    }
  );

  let response = await data.json();
  console.log(response);

  if (response !== null) {
    let arr = [];
    for (let key in response) {
      response[key].id = key;
      arr.push(response[key]);
    }
    arr = arr.reverse();

    const userNameFilter = arr.filter((ele) => ele.UserName);

    return userNameFilter;
  }
};

export const userIdChecker = async ({ UserName }) => {
  console.log(UserName);

  let userId = await fetch(`${DbUrl}.json`);
  let userIddata = await userId.json();
  console.log(userIddata);

  let flag = false;

  if (userIddata != null) {
    if (userIddata !== null && UserName !== undefined) {
      let arr = [];
      for (let key in userIddata) {
        userIddata[key].id = key;
        arr.push(userIddata[key]);
      }
      arr = arr.reverse();

      const mydata = arr.filter((ele) => ele.Profile.UserName === UserName);

      if (mydata.length === 0) {
        return (flag = true);
      } else {
        alert("UserName Already Exits");
        console.log("UserName Already Exits");
      }

      return flag;
    }
  } else {
    return (flag = true);
  }
};

export default GetExpense;

export const getRoles = async () => {
  let response = await fetch(`${DbUrl}/Roles.json`);

  let data = await response.json();
  console.log(data);

  if (data.error) {
    return alert(data.err.message);
  }

  return data;
};




export const GetAllUsers = async () => {


  try {
    const response = await fetch(`${DbUrl}/Roles/Users.json`);
    const data = await response.json();

    if (data?.error) {
      alert(data.error.message);
      return [];
    }

    // Filter categories where createdBy === UserId
    const filteredUsers = Object.entries(data)
      .filter(([key, value]) => value)
      .map(([key, value]) => ({
        id: key,
        ...value,
      }));

    return filteredUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const GetAllbooking_forAdmin = async () => {


  try {
    const response = await fetch(`${DbUrl}/bookings.json`);
    const data = await response.json();

    if (data?.error) {
      alert(data.error.message);
      return [];
    }

    // Filter categories where createdBy === UserId
    const filteredbookings = Object.entries(data)
      .filter(([key, value]) => value)
      .map(([key, value]) => ({
        DataBase_id: key,
        ...value,
      }));

    return filteredbookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};





















// GetAdminCategory

export const GetAdminCategory = async (UserId) => {
  console.log(UserId);

  try {
    const response = await fetch(`${DbUrl}/categories.json`);
    const data = await response.json();

    if (data?.error) {
      alert(data.error.message);
      return [];
    }

    // Filter categories where createdBy === UserId
    const filteredCategories = Object.entries(data)
      .filter(([key, value]) => value.createdBy === UserId)
      .map(([key, value]) => ({
        id: key,
        ...value,
      }));

    return filteredCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export async function GetAdminAllHotels(UserId) {
  try {
    const response = await fetch(`${DbUrl}/hotels.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!data) {
      return { success: true, hotels: [] };
    }

    const filteredHotels = Object.entries(data)
      .filter(([key, value]) => value.createdBy === UserId)
      .map(([key, value]) => ({
        id: key,
        ...value,
      }));

    // Convert the object of hotels into an array with IDs

    return { success: true, hotels: filteredHotels };
  } catch (error) {
    console.error("Error retrieving hotels:", error);
    return { success: false, error: error.message };
  }
}

// getUsersCategoy

export async function getUsersCategoy() {
  try {
    const response = await fetch(`${DbUrl}/categories.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!data) {
      return { success: false, hotels: [] };
    }

    const filteredHotels = Object.entries(data)
      .map(([key, value]) => ({
        id: key,
        ...value,
      }));

    // Convert the object of hotels into an array with IDs

    return { success: true, Category: filteredHotels };
  } catch (error) {
    console.error("Error retrieving hotels:", error);
    return { success: false, error: error.message };
  }
}


export async function getUsersHotels(categoryId) {
  try {
    const response = await fetch(`${DbUrl}/hotels.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!data) {
      return { success: true, hotels: [] };
    }

    const filteredHotels = Object.entries(data)
      .filter(([key, value]) => value.category === categoryId)
      .map(([key, value]) => ({
        id: key,
        ...value,
      }));

    // Convert the object of hotels into an array with IDs

    return { success: true, hotels: filteredHotels };
  } catch (error) {
    console.error("Error retrieving hotels:", error);
    return { success: false, error: error.message };
  }
}


export async function getUsersParticular_Hotels(id) {
  console.log(id);
  
  try {
    const response = await fetch(`${DbUrl}/hotels.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!data) {
      return { success: true, hotels: [] };
    }

 
 


 const filteredHotels = Object.entries(data)
      .find(([key]) => key === id)[1]
      console.log(filteredHotels);
      

    // Convert the object of hotels into an array with IDs

    return { success: true, hotels: filteredHotels };
  } catch (error) {
    console.error("Error retrieving hotels:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserAllBookings(id, userToken = null) {
  try {
    const url = userToken
      ? `${DbUrl}/bookings.json?auth=${userToken}`
      : `${DbUrl}/bookings.json`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || typeof data !== "object") {
      return { success: true, bookings: [] };
    }

    const filteredBookings = Object.entries(data)
      .filter(([_, value]) => value.userId === id)
      .map(([key, value]) => ({
        id: key,
        ...value,
      }));

    return { success: true, bookings: filteredBookings };
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    return { success: false, error: error.message };
  }
}

