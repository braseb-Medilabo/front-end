import './Style/Login.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, {useState} from 'react';
import instanceAxios from './service/AxiosService';
import { setAccessToken, setRefreshToken } from "./service/tokenService";
import { useAuth } from './service/AuthContext';


function Login(){
    
    const [loginInfos, setLoginInfo] = useState({username : "", password : ""});
    const [authentificated, setAuthentificated] = useState({isError: false,  error : null})

    const { login } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
       
        try{
            const response = await instanceAxios.post("/auth/login",
                                                    loginInfos)
            console.info(response.status);
            console.info(response.data);
            login(response.data?.accessToken, response.data?.refreshToken);
            setAuthentificated({...authentificated, isError : false, error : null});
            
        }catch(error){
            console.log("Authentification error", error);
            setAuthentificated({ ...authentificated, isError : true, error : {"message" : error.message, "errors" : error?.errors }});
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

