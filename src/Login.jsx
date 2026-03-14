import './Style/Login.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, {useState} from 'react';
import instanceAxios from './service/axios';


function Login(page, setPage){
    
    const [loginInfos, setLoginInfo] = useState({ident : "", pass : ""});

    const handleSubmit = (e) => {
        instanceAxios.post("/login", loginInfos)
        .then((response) => {response.status;})
        .cath((response) => {response;})
        
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
            <Button type="submit" 
                    variant="contained">Login</Button>
        </form>    
    </div>
    );
}

export default Login;

