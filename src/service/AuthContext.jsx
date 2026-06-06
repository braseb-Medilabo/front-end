import React, { createContext, useContext, useState, useEffect } from "react";
import { getAccessToken, setAccessToken, clearTokens, setRefreshToken } from "./tokenService";
import instanceAxios from './AxiosService'

const AuthContext = createContext(null);

export function useAuth(){
    return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
    const [authToken, setAuthToken] = useState(null);
    const [userInfos, setUserInfos] = useState(null);

    //page refresh check if token is in storage 
    useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();
      
        if (!token) return;

      try {
        setAuthToken(token);

        const response = await instanceAxios.get("/me")
        console.log("refresh user infos");
        setUserInfos(response?.data);
        
      } catch (error) {
        console.log("error useffect /me");
     }
    };

    checkAuth();
  }, []);

    const login = async (token, refreshToken) => {
        setAuthToken(token);
        setAccessToken(token);
        setRefreshToken(refreshToken);
        console.log("Token:", token);
        console.log("RefreshToken:", refreshToken);
        try{
            const response = await instanceAxios.get("/me");
            setUserInfos(response?.data);
            
        } catch (error) {
            setUserInfos(null);
            console.error("Unable to get user infos");
        }
        
    };

    const logout = () => {
        setAuthToken(null);
        setUserInfos(null);
        clearTokens();
    };

    

    return <AuthContext.Provider value={{authToken, userInfos, login, logout}}>
        {children}
    </AuthContext.Provider>
}