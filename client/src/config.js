

import axios from "axios";

export const axiosInstance = axios.create(
    {
     baseUrl :  "https://whatsappoo.herokuapp.com/app/"
    }
)