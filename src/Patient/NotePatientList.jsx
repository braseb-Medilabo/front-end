import React, {useState, useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField  } from '@mui/material';
import '../Style/NotePatientList.css';
import instanceAxios from '../service/axios';
import { red } from '@mui/material/colors';

function ListNotePatient({page, setPage}){
    const [patientNoteList, setPatientNoteList] = useState([]);
    const [errorObject, setErrorObject] = useState({isError : false, errors : {}});
    const [openDialog, setOpenDialog] = useState(false);
    const [note, setNote] = useState("");

   function errorManagement(error) {
        if (error.response) {

            const data = error.response.data;

            if (data){
                if (data.errors) {
                    console.log('Validation error', data.errors);
                    setErrorObject({...errorObject,isError : true, errors : data.errors});
                
                }
                else{
                    console.error("no errors in datas");
                    setErrorObject({...errorObject,isError : true, errors : {status : data.status, message : data.error}});
                }
            }

            
        }
        else if (error.request) {
            console.error("request error");
           if (error.request.status === 0){
                setErrorObject({...errorObject,isError : true, errors : {status : 500, message : "Network error, please try again"}});
            }
            else{
                setErrorObject({...errorObject,isError : true, errors : {status : error.request.status, message : error.request.statusText}});
            }
        }
        else{
            console.error("Something went wrong");
            setErrorObject({...errorObject,isError : true, errors : {status : 500, message : "Something went wrong"}});
        }
    }

    function fetchNotePatients(patient) {
        instanceAxios.get("/patient/note/" + patient.id)
            .then((response) => {
                console.log('liste:', response.data, "tout est parfais");
                setPatientNoteList(response.data);
                setErrorObject({...errorObject,isError : false, errors : {}});
            })
            .catch((error) => { errorManagement(error) });
    }

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleSaveNote = () => {
        console.log("Note to append :", note);
        if (!note || !page.datas) return; //security
        console.log(page);
        instanceAxios.post("/patient/note", 
                            {   "patId" : page.datas.id, 
                                "patient" : page.datas.lastName,
                                "note" : note})
            .then ((response)=> {
                setNote("");
                fetchNotePatients(page.datas);
                handleCloseDialog();
                
            })
            .catch((error) => {
                errorManagement(error);
            })
        
    };    

   useEffect(() => {
        console.log(page.datas);
       
        if (page.datas != null){
            fetchNotePatients(page.datas);
        }
        

    },[])

    return(
            <div className='patientNoteListContainer'>
                {errorObject.isError && (
                <div className='errorMessage'> {errorObject.errors.message}</div>
                )}  
                <div className='buttons'>
                    <Button type="button" variant="contained" onClick={(e) => handleOpenDialog(e, null)}>Append a note for the patient</Button>
                </div>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} >
                    <TableHead>
                    <TableRow>
                        <TableCell align='center'>Patient</TableCell>
                        <TableCell align="center">Note</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {patientNoteList.map((n) => (
                        <TableRow>
                            
                            <TableCell align="center">{n.patient}</TableCell>
                            <TableCell align="center"
                                sx={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>{n.note}
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
                <Dialog open={openDialog} onClose={handleCloseDialog}
                         fullWidth         // prend toute la largeur disponible
                        maxWidth="md">     
                    <DialogTitle>Ajouter une note</DialogTitle>
                    <DialogContent>
                        <TextField
                        autoFocus
                        margin="dense"
                        label="New note"
                        fullWidth
                        multiline
                        rows={4}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        error={!!errorObject.errors?.note}
                        helperText={errorObject.errors?.note}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSaveNote} variant="contained">
                        Save
                        </Button>
                    </DialogActions>
                </Dialog>
                <div className='patientButtons'>
                    <Button type='button' 
                            variant='contained' 
                            onClick={()=> setPage({...page, page : "patientList", data : null})}>Return</Button>
                </div>
                
                
            </div>
            
    );
}

export default ListNotePatient;