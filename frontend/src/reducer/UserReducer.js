// src/reducers/UserReducer.js

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
      // Save to localStorage with consistent structure
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };

    case "LOGIN_FAILED":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case "LOGOUT":
      localStorage.removeItem("user");
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

export default UserReducer;
