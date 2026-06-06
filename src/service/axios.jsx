import axios from "axios";
import {getAccessToken,setAccessToken, getRefreshToken, setRefreshToken, clearTokens} from "./tokenService";


const instance = axios.create({
   baseURL : "http://localhost:8080/api/v1",
   withCredentials : true,
   timeout : 3000
});

// Interceptor exécuté avant chaque requête
instance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
   (response) => response,
   async (error) => {
      console.log("error instance axios");

      const originalRequest = error.config;

      let formattedError = {
         status : 500,
         message : "Something went wrong",
         errors : null
      };

      if (error.response) {

            const data = error.response.data;
            console.log(error.response);
            

            if (data){
                if (data.errors) {
                    console.log('Validation error', data.errors);
                     formattedError = {
                        status : error.response.status,
                        message : data.message,
                        errors : data.errors
                     };
                
                }
               
               // Si access token expiré
               else if (
                     error.response?.status === 401 &&
                     !originalRequest._retry
               ) {

                  console.log("try to refresh token");
                  
                  originalRequest._retry = true;

                     try {
                        const refreshToken = getRefreshToken();
                        
                        if (!refreshToken){
                           Promise.reject("No refresh token");
                        }

                        const response = await axios.post(
                           "http://localhost:8080/api/v1/auth/refresh", 
                           refreshToken
                        );

                        const newAccessToken = response.data.accessToken;
                        const newRefreshToken = response.data.refreshToken;

                        setAccessToken(newAccessToken);
                        setRefreshToken(newRefreshToken);

                        // remet le nouveau token
                        originalRequest.headers.Authorization =
                           `Bearer ${newAccessToken}`;

                        console.log("refresh token ok");

                        // rejoue la requête originale
                        return instance(originalRequest);

                     } catch (refreshError) {
                        console.log("expired refresh token")
                        // refresh expiré => logout
                        clearTokens();
                        //setAccessToken(null);
 
                        return Promise.reject(refreshError);
                     }
                  }

                else{
                    console.error("no errors validation in datas");
                    formattedError = {
                        status: data.status || error.response.status,
                        message: data.error || data.message || error.response.statusText,
                        errors : data.error
                     };
                }
            }

            
        }
      else if (error.request) {
         console.error("request error");
         if (error.request.status === 0){
               formattedError = {
                  status: 500,
                  message: "Network error, please try again",
                  errors : null
               };
         }
         
         else{
               formattedError = {
                  status: error.request.status,
                  message: error.request.statusText,
                  errors : {error : error.request.statusText}
               };
         }
      }
          
      return Promise.reject(formattedError);
   }
   
);

export default instance;