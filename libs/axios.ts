import axios from "axios";

const Axios = axios.create({
  baseURL: "http://localhost:3000/api/auth/",
});

export default Axios;
