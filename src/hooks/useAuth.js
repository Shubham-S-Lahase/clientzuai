import React, { createContext, useContext, useReducer, useEffect } from "react";
import { registerUser, loginUser, fetchUserData } from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const initialState = {
  user: null,
  error: null,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      return { ...state, user: action.payload, error: null, loading: false };
    case "LOGOUT":
      return { ...state, user: null, loading: false };
    case "AUTH_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "LOADING":
      return { ...state, loading: true };
    case "LOADING_COMPLETE":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  const verifyToken = async () => {
    console.log("Verifying token...");
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const user = await fetchUserData(token);
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        console.log("User verified:", user);
      } catch (err) {
        console.error("Token verification error:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          dispatch({ type: "LOGOUT" });
        } else {
          dispatch({ type: "AUTH_ERROR", payload: err.message });
        }
      }
    } else {
      console.log("No token found, completing loading.");
      dispatch({ type: "LOADING_COMPLETE" });
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const register = async (userData) => {
    try {
      dispatch({ type: "LOADING" });
      const data = await registerUser(userData);
      dispatch({ type: "REGISTER_SUCCESS", payload: data });
      localStorage.setItem("token", data.token);
      await verifyToken();
      navigate("/");
    } catch (err) {
      dispatch({ type: "AUTH_ERROR", payload: err.response?.data?.message || "Registration failed" });
      dispatch({ type: "LOADING_COMPLETE" });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: "LOADING" });
      const data = await loginUser(credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: data });
      localStorage.setItem("token", data.token);
      await verifyToken();
      navigate("/");
    } catch (err) {
      dispatch({ type: "AUTH_ERROR", payload: err.response?.data?.message || "Login failed. Please try again." });
      dispatch({ type: "LOADING_COMPLETE" });
    }
  };

  const logout = () => {
    dispatch({ type: "LOADING" });
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const value = {
    ...state,
    register,
    login,
    logout,
    isAuthenticated: !!state.user && !!localStorage.getItem("token"),
  };

  return (
    <AuthContext.Provider value={value}>
      {state.loading ? (
        <div className="loadercont">
          <div className="loader"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return {
    ...context,
  };
};
