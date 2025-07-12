import axios from "axios";
import { BASE_URL } from "./config";
import { refresh_tokens } from "./AuthService";
import { tokenStorage } from "@state/Storage";

export const appAxios = axios.create({
    baseURL: BASE_URL,
})

appAxios.interceptors.request.use(async (config) => {
    const accessToken = tokenStorage.getString('accessToken')
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}` 
    }   
    return config
})

appAxios.interceptors.response.use(
    (response) => response,

    async error => {
        const originalRequest = error.config

        if(error.response && error.response.state === 401 && !originalRequest._retry){
            originalRequest._retry = true
            try{
                const newAccessToken = await refresh_tokens()
                if(newAccessToken){
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                    // error.config.headers.Authorization = `Bearer ${newAccessToken}`
                    // return axios(error.config)
                    return axios(originalRequest) // ✅ retry using appAxios
                }
            }catch(error){
                console.log("ERROR REFRESHING TOKEN ", error)
            }
        }

        if(error.response && error.response.status !== 401){
            const errorMessage = error.response.data?.message || "something went wrong"         
            console.log( "❌ API Error:", errorMessage)
        }
        return Promise.reject(error)
    }
)