import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import  IconButton from '@mui/material/IconButton';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import "./all.css";
import db, { auth, createinterview } from '../firebase';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



export default function Interviewer({user}) {
  const [value, setValue] = React.useState('1');
  const [question, setQuestion] = React.useState({});
  const [ans, setAns] = React.useState({});
  const [viewans, setViewans] = React.useState("");
  const [candi, setCandi] = React.useState(true);
  const [dataquestion, setDataquestion] = React.useState("");
  const [interviews, setInterviews] = React.useState({});
  const [addtest, setAddtest] = React.useState(false);
  const [interview, setInterview] = React.useState({
    position: "",
    ext_time: "",
    instruct: ""
  });

  React.useEffect(() =>{
    console.log(user)
    const unsubscribe =   db.collection('interviews').where("uid","==",user.uid ).onSnapshot((value2)=>{
    
     const inter ={}
     value2.forEach((doc) => {
        inter[doc.id] = doc.data()
    });
    console.log(inter)
    setInterviews(inter)
    })
    return () =>{
        unsubscribe();
    
      }
  },[])
  const handleChange = (event, newValue) => {
    setValue(newValue);


  };
  const handleChange2 = React.useCallback((e) => {
    const { value } = e.target; 
    setDataquestion(value );
  }
    ,[])
    const handleChange3 = React.useCallback((e) => {
        const { name, value } = e.target;
        console.log(name,value)
        setInterview({ ...interview, [name]: value });
      },[interview])

  const setquestion  = (() =>{
     setQuestion({...question,[uuidv4()]: dataquestion})
  })
  const deletequ = ((id) =>{
setQuestion(current => {
    const copy = {...current};
    delete copy[id];
    return copy;
  });
  })
  const uploadData = ((e) =>{
    e.preventDefault();
    if(Object.keys(question).length===0) return
    createinterview({interview,user,question}).then(()=>{
        console.log("success")
    })
})

const  fetchanswers = (data) =>{
    if (!data) return 
    db.collection('interviews').doc(data).collection('ans').get().then((value) =>{
      const ans  = {};
      value.forEach((doc) => {
          ans[doc.id] = doc.data()
      });
      console.log(ans)
      setAns(ans)
    })
  }

  return (
    <div className='main' style={{width:"60%",height:"100%",margin:"auto",marginTop:"70px"}}>
  
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Tests" value="1" />
            <Tab label="Account" value="2" />
        
          </TabList>
        </Box>
        <TabPanel value="1">
 
        {(candi && interviews && Object.entries(interviews).length>0) &&
  <>
  
 { !addtest ?  <div  style={{width:"100%",display:"flex",justifyContent:"end",marginTop:"10px"}}>



  <IconButton onClick={()=>{setAddtest(true);    setInterview({
    position: "",
    instruct:"",
    ext_time:"",  
    }); setQuestion({})}} style={{color:"#F21170 ",}} disableRipple={true}  className='flair-badge-wrapper' aria-label="remove"    size="small" >
    <h5 style={{margin:"0px"}}>Create New</h5>
<AddIcon  aria-hidden="true"></AddIcon>
</IconButton>
</div>:
<div style={{width:"100%",display:"flex",justifyContent:"start",marginTop:"15px"}}>
  <IconButton onClick={()=>{setAddtest(false)}} style={{color:"#F21170 ",margin:"0",padding:"0"}}   className='flair-badge-wrapper' aria-label="remove"    size="large" >

<ArrowBackIcon  aria-hidden="true"></ArrowBackIcon>
</IconButton>
</div>}
</>}
{candi && <>
            { Object.keys(interviews).length>0 && !addtest ? 
        <div  style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",gap:"20px",marginTop:"10px"}}>
                {interviews && Object.entries(interviews).map((data,index) =>{
                    return(
                        <div className='box' style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",padding:"10px"}}>
                            <div style={{display:"flex",flexDirection:"column",gap:"5px",alignItems:"start",textAlign:"start"}}>
                                 <span><span style={{color:"#6E2CDC"}}>Position:</span> {data[1].position}</span>
                                 <span><span style={{color:"#6E2CDC"}}>Interviewer:</span> {data[1].interviewer}</span>
                                 <span><span style={{color:"#6E2CDC"}}>No of questions:</span> {data[1].noq}</span>
                                 <span><span style={{color:"#6E2CDC"}}>Extimated Time:</span> {data[1].ext_time} mins</span>
                            </div>
                            <div style={{textAlign:"end",cursor:"pointer"}}>
                                <span  onClick={() =>{fetchanswers(data[0]);setCandi(false)}}  >View candidates</span>
                            </div>
                        </div>
                    )
                })}
            </div>:
       
        <form onSubmit={uploadData}>

<div className="details  det">
    <h4>Details</h4>
<TextField    name='position' onChange={handleChange3}  value={interview.position} required fullWidth id="outlined-basic" label="Position" variant="outlined" sx={{marginTop: '10px'}} />
<TextField
      id="outlined-multiline-static"
      fullWidth
      value={interview.ext_time}
      required
      onChange={handleChange3}
      name='ext_time'
      label="Extimated Time"
      sx={ { marginTop : '10px'}
      }

    />

<TextField
      id="outlined-multiline-static"
      fullWidth
      required
      value={interview.instruct}
      onChange={handleChange3}
      name='instruct'
      label="Instructions"
      sx={ { marginTop : '10px'}
      }
      multiline
      rows={2}
   
    />
<div className="details" style={{width:"100%"}}>
<h4>Questions</h4>
{Object.keys(question).length>0 &&
  <div style={{display:"flex",flexDirection:"column",justifyContent:"start",width:"100%",gap:"10px",marginTop:"10px",marginBottom:"20px",}}>
    {question &&  Object.entries(question).map((data =>{
        return(
            <div className='box_qu' style={{width:"100%",justifyContent:"space-between",padding:"10px",display:"flex",borderRadius:"10px"}}>
                <span>{data[1]}</span>
                <IconButton  onClick={() => {deletequ(data[0])}} className='flair-badge-wrapper' aria-label="remove"    size="small" >
 <DeleteIcon  aria-hidden="true"></DeleteIcon>
 </IconButton>
                </div>
        )
    }))}
  </div>}
        <div  style={{display:"flex",gap:"10px",alignItems:"center",marginTop:"10px"}}>
        <TextField
      id="outlined-multiline-static"
      fullWidth
      onChange={handleChange2}
      required
      name='question'
      label="Question"
      sx={ { marginTop : 'auto',flexBasis:"70%"}
      }

    />
       <div   onClick={() =>{setquestion()}} style={{flexBasis:"30%"}} className="save_changes sub2">
    <h5>Add Question</h5></div>

        </div>
      

   
   
    </div>
    <button type='submit'  className="save_changes sub4">
    <h5>Save Changes</h5></button>

    </div>
    </form>}</>}
    {candi ==false &&
    <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
    <div style={{width:"100%",display:"flex",justifyContent:"start",marginTop:"15px",marginBottom:"8px"}}>
  <IconButton onClick={()=>{setCandi(true);setAns({})}} style={{color:"#F21170",margin:"0",padding:"0"}}   className='flair-badge-wrapper' aria-label="remove"    size="large" >

<ArrowBackIcon  aria-hidden="true"></ArrowBackIcon>
</IconButton>
</div>
    {Object.entries(ans).map((data) =>{
        console.log(data[1])
        return(
            <>
            {viewans != data[0] ?
            <div className='box' style={{display:"flex",justifyContent:"space-between",padding:"10px",alignItems:"center"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"start",justifyContent:"start"}}>
                <span style={{color:"white"}}>Name: {data[1].name}</span>
                <span style={{color:"white"}}>Email:{data[1].email}</span>
                <span style={{color:"white"}}>Attended at: {data[1].createdAt.toDate().toDateString()}</span>
                </div>
                <div  style={{textAlign:"end",cursor:"pointer"}}>
                                <span onClick={() =>{setViewans(data[0])}}  >View answers</span>
                            </div>
                </div>: <div className='box' style={{display:"flex",justifyContent:"space-between",padding:"10px",alignItems:"center",flexDirection:"column",alignItems:'start',gap:"10px",marginTop:"10px"}}>
                <IconButton onClick={()=>{setViewans("")}} style={{color:"#F21170 ",margin:"0",padding:"0"}}   className='flair-badge-wrapper' aria-label="remove"    size="large" >

<ArrowBackIcon  aria-hidden="true"></ArrowBackIcon>
</IconButton>
{Object.entries(data[1].question).map((data2) =>{
    console.log(data2)
    return( 
     
        <div className='box' style={{display:"flex",flexDirection:"column",gap:"3px",width:"100%",padding:"5px",alignItems:"start",textAlign:"start"}}>
            <span>Question: {data2[1].q1}
            </span>
            <span>Answer: {data2[1].ans}
            </span>
        </div>
    )
})}
                    </div>}</>
        )
    })}
    </div>}
 

        </TabPanel>
        <TabPanel value="2">
        <div className='box logout_box' style={{display:"flex",flexDirection:"column",gap:"10px",alignItems:"start",marginTop:"10px",padding:"10px"}}>
  <span>Login as : Interviewer</span>
  <span>Name : {user.name}</span>
  <span>Email : {user.email}</span>
  <div onClick={()=>{auth.signOut()}} className="save_changes sub2">
    <h5 style={{margin:"0"}}>Signout</h5></div>

</div>
        </TabPanel>
    
      </TabContext>
    </Box>
    </div>

  );
}