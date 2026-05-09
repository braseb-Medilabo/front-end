import axios from "axios";

const instance = axios.create({
   baseURL : "http://localhost:8080",
   withCredentials : true,
   timeout : 3000
});

instance.interceptors.response.use(
   (response) => response,
   (error) => {
      console.log("error instance axios");

      let formattedError = {
         status : 500,
         message : "Something went wrong"
      };

      if (error.response) {

            const data = error.response.data;

            if (data){
                if (data.errors) {
                    console.log('Validation error', data.errors);
                     formattedError = {
                        status : error.response.status,
                        message : data.errors
                        
                     };
                
                }
                else{
                    console.error("no errors validation in datas");
                    formattedError = {
                        status: data.status || error.response.status,
                        message: data.error || data.message || error.response.statusText
                     };
                }
            }

            
        }
      else if (error.request) {
         console.error("request error");
         if (error.request.status === 0){
               formattedError = {
                  status: 500,
                  message: "Network error, please try again"
               };
         }
         
         else{
               formattedError = {
                  status: error.request.status,
                  message: error.request.statusText
               };
         }
      }
          
      return Promise.reject(formattedError);
   }
   
);

export default instance;