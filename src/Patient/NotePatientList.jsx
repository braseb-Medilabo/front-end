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
import instanceAxios from '../service/AxiosService';
import { red } from '@mui/material/colors';

function ListNotePatient({page, setPage}){
    const [patientNoteList, setPatientNoteList] = useState([]);
    const [errorObject, setErrorObject] = useState({isError : false, error : {}});
    const [openDialog, setOpenDialog] = useState(false);
    const [note, setNote] = useState("");
    const [riskDiabete, setRiskDiabete] = useState("");
    let index = 0;
   
    async function fetchNotePatients(patient) {
        try{
            const response = await instanceAxios.get("/patient/note/" + patient.id);
            console.log('liste:', response.data, "ok");
            setPatientNoteList(response.data);
            const risk = await instanceAxios.get("/patient/risk/" + patient.id);
            setRiskDiabete(risk?.data || "");
            setErrorObject({...errorObject,isError : false, error : {}});
        }catch (error){
            setErrorObject({...errorObject,isError : true, error : {status : error.status, message : error.message, errors : error.errors}}); 
        }
     
        
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
                setErrorObject({...errorObject,isError : true, error : {status : error.status, message : error.message, errors : error.errors}}); 
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
                <div className='errorMessage'> {errorObject.error.message}</div>
                )}  
                <div className='buttons'>
                    <Button type="button" variant="contained" onClick={(e) => handleOpenDialog(e, null)}>Append a note for the patient</Button>
                </div>
                <div className='patientButtons'>
                    <Button type='button' 
                            variant='contained' 
                            onClick={()=> setPage({...page, page : "patientList", data : null})}>Return</Button>
                </div>
                <div
                    className={`patientRisk ${
                        riskDiabete.code
                            ? riskDiabete.code.replace(/\s+/g, "").toLowerCase()
                            : "unknown"
                    }`}
                >
                    {riskDiabete.label || "Unable to get the risk"}
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
                       
                        <TableRow key={index += 1}>
                            
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
                        error={!!errorObject.error?.errors?.note}
                        helperText={errorObject.error?.errors?.note}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSaveNote} variant="contained">
                        Save
                        </Button>
                    </DialogActions>
                </Dialog>
                
                
                
            </div>
            
    );
}

export default ListNotePatient;