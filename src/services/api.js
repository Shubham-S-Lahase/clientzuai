import axios from "axios";

const API = axios.create({
  // baseURL: "https://serverzuai.onrender.com/api/",
  baseURL: "http://localhost:5000/api/",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  try {
    const response = await API.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) 
      {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Registration failed, please try again later.");
    }
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Registration failed, please try again later.");
    }
  }
};

export const fetchUserData = async (token) => {
  const response = await API.get("/auth/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createPost = async (postData) => {
  const response = await API.post("/posts", postData);
  return response.data;
};


export const fetchPostById = async (id) => {
  const response = await API.get(`/posts/${id}`);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};


export const fetchCommentsForPost = async (postId) => {
  try {
    const response = await API.get(`/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to fetch comments, please try again later.");
    }
  }
};

export const addComment = async (postId, commentData) => {
  try {
    const response = await API.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to add comment, please try again later.");
    }
  }
};

export const editComment = async (commentId, updatedData) => {
  try {
    const response = await API.put(`/comments/${commentId}`, updatedData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to edit comment, please try again later.");
    }
  }
};

export const deleteComment = async (commentId) => {
  try {
    await API.delete(`/comments/${commentId}`);
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to delete comment, please try again later.");
    }
  }
};


export const sendOtpToEmail = async (email) => {
  try {
    const response = await API.post("/user/sendOtpToEmail", { email });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to send OTP, please try again later.");
    }
  }
};


export const verifyOtpAndChangePassword = async (email, otp, newPassword) => {
  try {
    const response = await API.post("/user/verifyOtpAndChangePassword", { email, otp, newPassword });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to change password, please try again later.");
    }
  }
};

export const updateProfilePicture = async (formData) => {
  try {
    const response = await API.post("/user/updateProfilePicture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to update profile picture, please try again later.");
    }
  }
};