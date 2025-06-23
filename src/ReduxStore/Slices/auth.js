// Slices/auth.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentRole: null, // 'user', 'admin'

  tokens: {
    userToken: null,
    adminToken: null, //all hotels
  },

  roles: {
    user: {
      registered: false,
      id: null,
      name: null,
      email: null,
      phone: null,
      gender: null,
      dob: null,
      loginPageActive: false,
      areaPin: null,
      address: {
        fullAddress: null,
        city: null,
        state: null,
        country: null,
        pincode: null,
      },

      kind: null,
      displayName: null,
      refreshToken: null,
      expiresIn: null,
    },
    admin: {
      registered: false,
      id: null,
      name: null,
      email: null,
      phone: null,
      gender: null,
      dob: null,
      loginPageActive: false,

      kind: null,
      displayName: null,
      refreshToken: null,
      expiresIn: null,
    },
  },

  UserBookingCart: {
    items: [], // Each item: { id, placeName, pricePerNight, dateRange, guests, totalPrice }
    totalItems: 0,
    totalPrice: 0,
  },

  isOpenAuthModal: false,
};

const LoginSignUpSlice = createSlice({
  name: "LoginSignUpSlice",
  initialState,
  reducers: {
    UserSignup(state, action) {
      const {
        token,
        registered,
        localId,
        name,
        email,
        phone,
        dob,
        gender,
        fullAddress,
        city,
        state: stateName,
        country,
        pincode,
        kind,
        displayName,
        refreshToken,
        expiresIn,
      } = action.payload;

      state.currentRole = "user";
      state.tokens.userToken = token || null;
      state.roles.user.registered = registered || false;
      state.roles.user.id = localId || null;
      state.roles.user.name = name || null;
      state.roles.user.email = email || null;
      state.roles.user.phone = phone || null;
      state.roles.user.dob = dob || null;
      state.roles.user.gender = gender || null;

      state.roles.user.address.fullAddress = fullAddress || null;
      state.roles.user.address.city = city || null;
      state.roles.user.address.state = stateName || null;
      state.roles.user.address.country = country || null;
      state.roles.user.address.pincode = pincode || null;

      state.roles.user.kind = kind;
      state.roles.user.displayName = displayName;
      state.roles.user.refreshToken = refreshToken;
      state.roles.user.expiresIn = expiresIn;
    },

    // UserSignin

    UserSignin(state, action) {
      const {
        token,
        registered,
        localId,
        name,
        email,
        phone,
        dob,
        gender,
        fullAddress,
        city,
        state: stateName,
        country,
        pincode,
        kind,
        displayName,
        refreshToken,
        expiresIn,
      } = action.payload;

      state.currentRole = "user";
      state.tokens.userToken = token || null;
      state.roles.user.registered = registered || false;
      state.roles.user.id = localId || null;
      state.roles.user.name = name || null;
      state.roles.user.email = email || null;
      state.roles.user.phone = phone || null;
      state.roles.user.dob = dob || null;
      state.roles.user.gender = gender || null;

      state.roles.user.address.fullAddress = fullAddress || null;
      state.roles.user.address.city = city || null;
      state.roles.user.address.state = stateName || null;
      state.roles.user.address.country = country || null;
      state.roles.user.address.pincode = pincode || null;

      state.roles.user.kind = kind;
      state.roles.user.displayName = displayName;
      state.roles.user.refreshToken = refreshToken;
      state.roles.user.expiresIn = expiresIn;
    },

    AdminSignup(state, action) {
      const { token, registered, id, name, email, phone, dob, gender } =
        action.payload;

      state.currentRole = "admin";
      state.tokens.adminToken = token;
      state.roles.admin.registered = registered;
      state.roles.admin.id = id;
      state.roles.admin.name = name;
      state.roles.admin.email = email;
      state.roles.admin.phone = phone;
      state.roles.admin.dob = dob;
      state.roles.admin.gender = gender;
    },

    AdminSignin(state, action) {
      const {
        idToken,
        localId,
        registered,
        name,
        email,
        phone,
        dob,
        kind,
        gender,
        displayName,
        refreshToken,
        expiresIn,
      } = action.payload;

      console.log(idToken);
      console.log(localId);

      state.currentRole = "admin";
      state.tokens.adminToken = idToken;
      state.roles.admin.registered = registered;
      state.roles.admin.id = localId;
      state.roles.admin.name = name;
      state.roles.admin.email = email;
      state.roles.admin.phone = phone;
      state.roles.admin.dob = dob;
      state.roles.admin.gender = gender;

      state.roles.admin.kind = kind;
      state.roles.admin.displayName = displayName;
      state.roles.admin.refreshToken = refreshToken;
      state.roles.admin.expiresIn = expiresIn;
    },

    UserLogout(state) {
      state.currentRole = null;
      state.tokens.userToken = null;

      state.user = {
        registered: false,
        id: null,
        name: null,
        email: null,
        phone: null,
        dob: null,
        gender: null,
        areaPin: null,
        address: {
          fullAddress: null,
          city: null,
          state: null,
          country: null,
          pincode: null,
        },
        loginPageActive: false,
      };

      localStorage.removeItem("UserToken");
    },

    AdminLogout(state) {
      state.currentRole = null;
      state.tokens.adminToken = null;

      state.admin = {
        registered: false,
        id: null,
        name: null,
        email: null,
        phone: null,
        dob: null,
        gender: null,
        loginPageActive: false,
      };

      localStorage.removeItem("AdminToken");
    },

    LogoutAll(state) {
      state.currentRole = null;
      state.tokens = {
        userToken: null,
        adminToken: null,
        superAdminToken: null,
      };

      state.roles.user = { ...initialState.roles.user };
      state.roles.admin = { ...initialState.roles.admin };

      localStorage.clear(); // or selectively remove only the role tokens
    },

    IsOpenAuthModal(state, action) {
      console.log(action);
      state.isOpenAuthModal = action.payload;
    },

    // updateAreaPin

    updateAreaPin(state, action) {
      const { pincode } = action.payload;
      state.roles.user.areaPin = pincode;
    },

    // bookingCart______________

    addItem(state, action) {
      const newItem = action.payload;
      console.log(newItem);

      // Check if item already exists (optional: based on unique booking id or placeId + date)
      const existingIndex = state.UserBookingCart.items.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingIndex === -1) {
        state.UserBookingCart.items.push(newItem);
        state.UserBookingCart.totalItems += 1;
        state.UserBookingCart.totalPrice += newItem.totalPrice;
      }
    },

    removeItem(state, action) {
      const id = action.payload;
      const index = state.UserBookingCart.items.findIndex(
        (item) => item.id === id
      );

      if (index !== -1) {
        state.UserBookingCart.totalPrice -=
          state.UserBookingCart.items[index].totalPrice;
        state.UserBookingCart.items.splice(index, 1);
        state.UserBookingCart.totalItems -= 1;
      }
    },

    clearCart(state) {
      state.UserBookingCart.items = [];
      state.UserBookingCart.totalItems = 0;
      state.UserBookingCart.totalPrice = 0;
    },

    setCart(state, action) {
      state.UserBookingCart.items = action.payload.items;
      state.UserBookingCart.totalItems = action.payload.items.length;
      state.UserBookingCart.totalPrice = action.payload.items.reduce(
        (acc, curr) => acc + curr.totalPrice,
        0
      );
    },
  },
});

export const {
  addItem,
  setCart,
  clearCart,
  removeItem,
  UserSignup,
  AdminSignup,
  UserSignin,
  AdminSignin,
  UserLogout,
  updateAreaPin,
  AdminLogout,
  LogoutAll,
  IsOpenAuthModal,
} = LoginSignUpSlice.actions;

export const LoginSignUpSlicee = LoginSignUpSlice.reducer;
