import '../Style/Patient.css';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import React, {useState, useEffect} from 'react';
import instanceAxios from '../service/AxiosService';


function Patient({page, setPage}){

    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        dateOfBirth: '',
        address: '',
        phoneNumber: '',
        gender: 'M'
    });

    const [errorObject, setErrorObject] = useState({isError : false, error : {}});
    
    /*useEffect(()=>{
       console.info(errorObject);
    }, [errorObject]);*/
   

    function handleSubmit(e) {
        e.preventDefault();
        console.log('Form submitted:', formData);
        if (page.datas != null) {
            instanceAxios.put("/patient/" + formData.id, formData)
                .then((response) => {
                    console.log('Form submitted:', formData, "all is right");
                    setPage({ ...page, page: "patientList", data: null });
                    console.log(response.status);
                    setErrorObject({...errorObject,isError : false, error : {}});

                })
                .catch((error) => {
                    setErrorObject({...errorObject, isError : true, error : {status : error.status, message : error.message, errors : error.errors}})
                })
        }
                    
        else {
            instanceAxios.post("/patient", formData).
                then((response) => {
                    console.log('Form submitted:', formData, "all is right");
                    setPage({ ...page, page: "patientList", data: null });
                    console.log(response.status);

                })
                .catch((error) => {
                    setErrorObject({...errorObject, isError : true, error : {status : error.status, message : error.message, errors : error.errors}})
                });
        }
    }
    useEffect(() => {
        console.log(page.datas);
        if (page.datas != null){
            setFormData(page.datas);
        }
    }, [])
    
    return (
        <div className='patient'>
        {errorObject.isError && (
                <div className='errorMessage'> {errorObject.error.message}</div>
        )}  
        <form className="form-container" onSubmit={handleSubmit}>
            <TextField label="Lastname" 
                        error={!!errorObject.error?.errors?.lastName}
                        helperText={errorObject.error?.errors?.lastName}
                        variant="outlined" 
                        value={formData.lastName}
                        onChange={(e)=>setFormData({...formData, lastName : e.target.value})}/>
            <TextField label="Firstname" 
                        error={!!errorObject.error?.errors?.firstName}
                        helperText={errorObject.error?.errors?.firstName}
                        variant="outlined" 
                        value={formData.firstName}
                        onChange={(e)=>setFormData({...formData, firstName : e.target.value})} />
            <FormControl>
            <InputLabel id="gender">Gender</InputLabel>
            <Select
                labelId="genderIdLabel"
                id="genderId"
                value={formData.gender}
                label="Genre"
                onChange={(e)=>setFormData({...formData, gender : e.target.value})}
            >
                <MenuItem value={"M"}>Masculine</MenuItem>
                <MenuItem value={"F"}>Feminine</MenuItem>
                <MenuItem value={"O"}>Other</MenuItem>
            </Select>
            </FormControl>
            <TextField label="Date of birth" 
                        error={!!errorObject.error?.errors?.dateOfBirth}
                        helperText={errorObject.error?.errors?.dateOfBirth}
                        variant="outlined" 
                        value={formData.dateOfBirth}
                        onChange={(e)=>setFormData({...formData, dateOfBirth : e.target.value})}/>
            <TextField label="Address" 
                        variant="outlined" 
                        value={formData.address}
                        onChange={(e)=>setFormData({...formData, address : e.target.value})}/>
            <TextField label="Phone number"
                        error={!!errorObject.error?.errors?.phoneNumber}
                        helperText={errorObject.error?.errors?.phoneNumber}
                        variant="outlined" 
                        value={formData.phoneNumber}
                        onChange={(e)=>setFormData({...formData, phoneNumber : e.target.value})}/>
            <div className='patientButtons'>
                <Button type="submit" 
                        variant="contained">Save</Button>
                <Button type='button' 
                        variant='contained' 
                        onClick={()=> setPage({...page, page : "patientList", data : null})}>Cancel</Button>
            </div>
        </form>
        </div>
    );
}

export default Patient;
