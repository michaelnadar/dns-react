import { Box, CircularProgress, Fab } from '@mui/material';
import { useEffect, useState } from 'react';
import { Check, Save } from '@mui/icons-material';
import { green } from '@mui/material/colors';
import axios from 'axios';

const ZoneAction = ({ params, rowId, setRowId ,setDone,data,setSuccessMessage,setErrorMessage}) => {
    const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
    // console.log(rowId);
   //  console.log(params.row);
 //  console.log('hello');
  const handleSubmit = async () => {
    setLoading(true);
    const {Id,Name} = params.row;
    console.log()
    if(params.row.Config){

      try {
        const result =  await axios.post('https://dns-manager-tan.vercel.app/updatehostedzone',{
           Id,Name
         });
        
         if (result.status === 200) {
           setSuccess(true);
           setDone(Id);
           setRowId(null);
           setSuccessMessage('Successfully Updated!!');
         }
        
      } catch (error) {
        console.log(error);
        setErrorMessage(error.response.data.error);
        console.log(error.response);
        setLoading(false);
      }
    }else{
      console.log(data);
      const {Name,Type,TTL,ResourceRecords,id}= params.row;
      console.log(Name,ResourceRecords);
      console.log(Type,TTL);
      var val =[];
      if(!Array.isArray(ResourceRecords)){
        if(ResourceRecords.includes(',')){
        var demo = ResourceRecords.split(',');
      demo.forEach(element => {
         
        val.push({Value:element});
        
      });
      }else{
          val.push({ Value:ResourceRecords});
        }
      }else{
         val = ResourceRecords;
      }
      try {
        const result =  await axios.post('https://dns-manager-tan.vercel.app/updatednsrecord',{
          data,Name,Type,TTL,val
        });
        if (result.status ===200) {
          setSuccess(true);
          setSuccessMessage('Updated successfully!!!')
          setDone(id);
          setRowId(null);
        setLoading(false);

        }
        
      } catch (error) {
        setErrorMessage(error.response.data.error.message)
        setLoading(false);
        
      }
    }

    }

  useEffect(() => {
    console.log(params.row.Id,rowId);
    console.log(success)
    if(params.row.Config){
      if (rowId === params.row.Id && success) setSuccess(false);
    }else{
      if (rowId === params.row.id && success) setSuccess(false);
    }
  }, [rowId]);


  return (
    <Box
    sx={{
      m: 1,
      position: 'relative',
    }}
  >
    {success ? (
      <Fab
        color="primary"
        sx={{
          width: 40,
          height: 40,
          bgcolor: green[500],
          '&:hover': { bgcolor: green[700] },
        }}
      >
        <Check />
      </Fab>
    ) : (
      <Fab
        color="primary"
        sx={{
          width: 40,
          height: 40,
        }}
        disabled={params.id !== rowId ||loading}
        onClick={handleSubmit}
      >
        <Save />
      </Fab>
    )}
    {loading && (
      <CircularProgress
        size={52}
        sx={{
          color: green[500],
          position: 'absolute',
          top: -6,
          left: -6,
          zIndex: 1,
        }}
      />
    )}
  </Box>
  )
}

export default ZoneAction