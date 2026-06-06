import './Style/Login.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, {useState} from 'react';
import instanceAxios from './service/axios';
import { setAccessToken, setRefreshToken } from "./service/tokenService";


function Login({page, setPage, authentificated, setAuthentificated}){
    
    const [loginInfos, setLoginInfo] = useState({ident : "", pass : ""});

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
                                                        error: false, 
                                                        message: "", 
                                                        userInfos: responseAuthentificated?.data });
            
        }catch(error){
            setAuthentificated({ ...authentificated, token: null, error: true, message: error.message });
        }
    }
    
    return(
    <div className='loginContainer'>
        <form className="form-container" onSubmit={handleSubmit}>
            <TextField label="Login" 
                        variant="outlined" 
                        value={loginInfos.ident}
                        onChange={(e)=>setLoginInfo({...loginInfos, ident : e.target.value})}/>
            <TextField label="Password" 
                    variant="outlined" 
                    value={loginInfos.pass}
                    onChange={(e)=>setLoginInfo({...loginInfos, pass : e.target.value})}/>
            {authentificated.error && (
                <div className='errorMessage'> {authentificated.message}</div>
            )}
            <Button type="submit" 
                    variant="contained">Login</Button>
        </form>    
    </div>
    );
}

export default Login;

