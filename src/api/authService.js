import axios from "axios";
// const baseUrl = "https://instacart-api.onrender.com/api/v1";
import { baseUrl } from "./baseUrl";
const localData = JSON.parse(localStorage.getItem("user"));

const loadUser = async () => {
  const response = await axios.get(`${baseUrl}/user`, {
    headers: {
      authorization: `Bearer ${localData.data.token}`,
    },
  });
  return response.data;
};

const login = async (body) => {
  const response = await axios.post(
    `${baseUrl}/login`,
    { ...body },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response));
  }
  return response.data;
};

const register = async (data) => {
  const response = await axios.post(`${baseUrl}/register`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log(response);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response));
  }
  return response.data;
};

const logout = async () => {
  const response = await axios.get(`${baseUrl}/logout`);

  if (response.data) {
    localStorage.removeItem("user");
  }
  return response.data;
};
const updateProfileService = async (data) => {
  const response = await axios.put(`${baseUrl}/user/update`, data, {
    headers: {
      authorization: `Bearer ${localData.data.token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.data) {
    const localData = JSON.parse(localStorage.getItem("user"));
    const token = localData.data.token;
    response.data.token = token;
    localStorage.setItem("user", JSON.stringify(response));
  }

  return response.data;
};
const authService = {
  loadUser,
  login,
  register,
  logout,
  updateProfileService,
};

export default authService;
