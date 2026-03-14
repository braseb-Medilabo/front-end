import '../Style/Patient.css';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import React, {useState, useEffect} from 'react';
import instanceAxios from '../service/axios';


function Patient({page, setPage}){

    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        dateOfBirth: '',
        address: '',
        phoneNumber: '',
        gender: 'M'
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        if (page.datas != null){
            instanceAxios.put("/patient/" + formData.id, formData)
            .then((response)=> {
                console.log('Form submitted:', formData, "tout est parfais");
                setPage({...page, page : "patientList", data : null});
                console.log(response.status);

            })
            .catch((error) => {
                console.log('Error : ', error)
        });
        }
        else{
            instanceAxios.post("/patient",formData).
            then((response)=> {
                console.log('Form submitted:', formData, "tout est parfais");
                setPage({...page, page : "patientList", data : null});
                console.log(response.status);

            })
            .catch((error) => {
                console.log('Error : ', error)
        });
        }
        
    };

    useEffect(() => {
        console.log(page.datas);
        if (page.datas != null){
            setFormData(page.datas);
        }
    }, [])

    
    
    return (
        <div className='patient'>
          
        <form className="form-container" onSubmit={handleSubmit}>
            <TextField label="Lastname" 
                        variant="outlined" 
                        value={formData.lastName}
                        onChange={(e)=>setFormData({...formData, lastName : e.target.value})}/>
            <TextField label="Firstname" 
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
                        variant="outlined" 
                        value={formData.dateOfBirth}
                        onChange={(e)=>setFormData({...formData, dateOfBirth : e.target.value})}/>
            <TextField label="Address" 
                    variant="outlined" 
                    value={formData.address}
                    onChange={(e)=>setFormData({...formData, address : e.target.value})}/>
            <TextField label="Phone number" 
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
