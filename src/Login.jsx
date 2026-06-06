import './Style/Login.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, {useState} from 'react';
import instanceAxios from './service/axios';
import { setAccessToken, setRefreshToken } from "./service/tokenService";


function Login({page, setPage, authentificated, setAuthentificated}){
    
    const [loginInfos, setLoginInfo] = useState({username : "", password : ""});

    async function handleSubmit(e) {
        e.preventDefault();

        try{
            const response = await instanceAxios.post("/auth/login",
                                                    loginInfos)
            console.info(response.status);
            console.info(response.data);
            //localStorage.setItem("token", response.data?.accessToken);
            //localStorage.setItem("refreshToken", response.data?.refreshToken);
            setAccessToken(response.data?.accessToken);
            setRefreshToken(response.data?.refreshToken);
            
            const responseAuthentificated = await instanceAxios.get("/me")
            console.info(responseAuthentificated.data);
            setPage("accueil");
            setAuthentificated({ ...authentificated, token: response.data?.accessToken, 
                                                        refreshToken : response.data?.refreshToken, 
                                                        isError: false, 
                                                        error : {},
                                                        userInfos: responseAuthentificated?.data });
            
        }catch(error){
            console.log("Authentification error", error);
            setAuthentificated({ ...authentificated, token: null, isError: true, error: {"message" : error.message, "errors" : error?.errors }});
        }
    }
    
    return(
    <div className='loginContainer'>
        <form className="form-container" onSubmit={handleSubmit}>
            <TextField label="Login"
                        error={!!authentificated.error?.errors?.username}
                        helperText={authentificated.error?.errors?.username} 
                        variant="outlined" 
                        value={loginInfos.username}
                        onChange={(e)=>setLoginInfo({...loginInfos, username : e.target.value})}/>
            <TextField label="Password"
                        type="password"
                        error={!!authentificated.error?.errors?.password}
                        helperText={authentificated.error?.errors?.password} 
                        variant="outlined" 
                        value={loginInfos.password}
                        onChange={(e)=>setLoginInfo({...loginInfos, password : e.target.value})}/>
            {authentificated.isError && (
                <div className='errorMessage'> {authentificated.error.message || "Unnknow error" }</div>
            )}
            <Button type="submit" 
                    variant="contained">Login</Button>
        </form>    
    </div>
    );
}

export default Login;

