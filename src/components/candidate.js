import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import db, { auth, createanswer } from '../firebase';
import { useSpeechRecognition } from 'react-speech-kit';
import { useSpeechSynthesis } from 'react-speech-kit';
import "./all.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import  IconButton from '@mui/material/IconButton';
import img from "./ani3.gif";
import img2 from "./mic.png";
import img3 from "./thumbs-up.gif";


export default function Candidate({user}) {

  const [value, setValue] = React.useState('');
  const [interviews, setInterviews] = React.useState();
  const [interview, setInterview] = React.useState("");
  const [speaktext, setSpeaktext] = React.useState('');
  const [question, setQuestions] = React.useState({});
  const [onInterview, setOninterview] = React.useState(false);
  const [currentquestion, setCurrentquestion] = React.useState(0);
  const [value1, setValue1] = React.useState('1');
  const { speak,speaking ,cancel} = useSpeechSynthesis()
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      console.log(value)
      setValue(value.concat(result));
      question && Object.entries(question).forEach((hello,index) =>{

        console.log(currentquestion)
        if(index == currentquestion){
           question[hello[0]]["ans"] = value.concat(result)
        }
    
    
      })
    },
  });

  console.log(speaking)

  const handleChange = (event, newValue) => {
    setValue1(newValue);
console.log(newValue)

  };

  React.useEffect(() =>{
    const unsubscribe =  db.collection('interviews').onSnapshot((querySnapshot) => {
  console.log(querySnapshot)
  const interview  = {};
  querySnapshot.forEach((doc) => {
      interview[doc.id] = doc.data()
  });
  console.log(interview)
  setInterviews(interview)
});
  return () =>{
    unsubscribe();
    stop()
    cancel()
  }
      },[])
const  fetchquestions = (data) =>{
  if (!data) return 
  db.collection('interviews').doc(data).collection('questions').get().then((value) =>{
    const question  = {};
    value.forEach((doc) => {
        question[doc.id] = doc.data()
    });
    console.log(question)
    setQuestions(question)
  })
}


React.useEffect(()=>{
  console.log(speaktext)
if(currentquestion === 0 && !value && onInterview){
  speak({ text: `Dear ${user.name}, Thank you for joining our virtual interview. Prepare for structured questions and ensure a stable internet connection and working microphone. Excited to meet you!` })
}
if(!speaking && speaktext){
speak({text : speaktext})


}

return () =>{
  cancel()
}
},[speaktext])

const setanswer = React.useCallback(() => {


  question && Object.entries(question).forEach((hello,index) =>{

    console.log(currentquestion)
    if(index == currentquestion){
     
   
       question[hello[0]]["ans"] = value
       setValue('')
       stop()
    }


  })


}, [value]);

const speech = () =>{
  if(listening){
    stop()
  }else{
    listen()
  }
}


const uploadData = (() =>{
  createanswer({user,question,interview}).then(()=>{
      console.log("success")
      setOninterview(false)
      setCurrentquestion(0)
      setQuestions({})
      setValue('')
      setSpeaktext('')
      setInterview("")
  })
})

const askquestion = () =>{

return ( 
  <div style={{width:"90%",height:"100%",margin:"auto",marginTop:"20px"}}>
  {question && Object.entries(question).map((value2,index) =>{
   if(index != currentquestion) return
    if(speaktext!=value2[1].q1){
      setSpeaktext(value2[1].q1 )
      if(value2[1]?.ans){
        setValue(value2[1].ans)
      }
     
    }
   console.log(speaking)
    return (
      <>
       {(currentquestion=== 0 && speaking && !value2[1]?.ans)  ?  
      <div className={(currentquestion=== 0 && speaking)?'typewriter':'typewriter typewriter2'}>
   <h3 style={{fontSize:"0.875rem"}}> Dear {user.name}, Thank you for joining our virtual interview. Prepare for structured questions and ensure a stable internet connection and working microphone. Excited to meet you!  </h3>
     
      </div>:
    <>
    <div style={{width:"100%",display:"flex",justifyContent:"start",marginTop:"0px",marginBottom:"8px"}}>
          <IconButton onClick={()=>{setOninterview(false); setOninterview(false);
      setCurrentquestion(0);
      setQuestions({});
      setValue('');
      stop();
      setSpeaktext('');
      setInterview("");}} style={{color:"#F21170",margin:"0",padding:"0"}}   className='flair-badge-wrapper' aria-label="remove"    size="large" >
        
        <ArrowBackIcon  aria-hidden="true"></ArrowBackIcon>
        </IconButton>
    </div>
      <div className="typewriter typewriter2">
 <h2 style={{fontSize:"35px"}}> {value2[1].q1}</h2>
     
      </div></>}
      {!speaking &&  <> {} <div style={{marginTop:"25px"}} >
      <div  style={{position:"relative",height:"300px",width:"100%",margin:"auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <textarea
    
            value={value}
            className='textarea1'
            style={{border:"none",resize:"none",width:"100%",height:"300px",fontSize:"22px",color:"white",backgroundColor:"transparent",padding:"20px",zIndex:"2000",position:"absolute",bottom:"0",left:"0",right:"0",top:"0"}}
            onChange={(event) => setValue(event.target.value)}
            autoFocus
          />
          {listening &&
           <div className='siri' style={{position:"absolute",bottom:"0"}}> 
           <img   style={{width:"100%",height:"300px",objectFit:"contain",opacity:".7",left:"0",right:"0"}} src={img}></img>
           {listening && <div style={{position:"absolute",width:"100%",height:"100%",justifyContent:"center",display:"flex",top:"0",alignItems:"center",opacity:".6"}}><span style={{fontSize:"12px"}}>Go ahead I'm listening</span></div>}
           </div>}
         
        
      </div>
    
    <div className="tooltip">
 
    <button  onClick={()=>{speech()}} style={{background:'none',border:"none",cursor:"pointer",borderRadius:"50%",marginTop:"20px"}}>
          <img className= {!listening?'btn':'btn btn3'}style={{height:"60px",borderRadius:"50%"}} src={img2}/>
          </button>
    </div>
       
          
         
    
        </div>
        <div>
 

</div></>
        }
    
        </>
    )
  })}
  </div>
)
}




  return (
    <div className='main' style={{width:"60%",height:"100%",margin:"auto",marginTop:"70px"}}>
  
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value1}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Interviews" value="1" />
            <Tab label="Account" value="2" />
        
          </TabList>
        </Box>
        <TabPanel value="1">
          {!onInterview ? 
            <div  style={{width:"100%",display:"flex",flexDirection:"column",gap:"10px",padding:"10px",marginTop:"20px"}}>
                {interviews && Object.entries(interviews).map((data,index) =>{
                    return(
                        <div className='box' style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",padding:"10px"}}>
                            <div style={{display:"flex",flexDirection:"column",gap:"5px",alignItems:"start"}}>
                            <span><span style={{color:"#6E2CDC"}}>Position:</span> {data[1].position}</span>
                                 <span><span style={{color:"#6E2CDC"}}>Interviewer:</span> {data[1].interviewer}</span>
                                 <span><span style={{color:"#6E2CDC"}}>No of questions:</span> {data[1].noq}</span>
                                 <span><span style={{color:"#6E2CDC"}}>Extimated Time:</span> {data[1].ext_time} mins</span>
                            </div>
                            <div style={{textAlign:"end",cursor:"pointer"}}>
                                <span onClick={() =>{fetchquestions(data[0] );setOninterview(true);setInterview(data[0])}} >Attend</span>
                            </div>
                        </div>
                    )
                })}
            </div>: <div>
{askquestion()}

{question  && (Object.entries(question).length  > currentquestion) ?
<>
{!speaking &&
  <div style={{display:"flex",flexDirection:"row",width:"100%",justifyContent:"space-around"}}>

  {currentquestion!=0 ? <button className='btn2' onClick={()=>{setCurrentquestion(currentquestion-1 ===-1?0:currentquestion-1);  stop()}}>Back</button>:<div className='btn2'></div>}
  <button  className='btn2' onClick={()=>{setCurrentquestion(value?currentquestion+1:currentquestion);setanswer()}}>Next</button>
  </div>
}</>
:<>
{Object.keys(question).length>0 &&
<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"20px"}}>
<div style={{width:"100%",display:"flex",justifyContent:"start",marginTop:"10px"}}>
  <IconButton onClick={()=>{setCurrentquestion(currentquestion-1 ===-1?0:currentquestion-1)}} style={{color:"#9c27b0",margin:"0",padding:"0"}}   className='flair-badge-wrapper' aria-label="remove"    size="large" >

<ArrowBackIcon  aria-hidden="true"></ArrowBackIcon>
</IconButton>
</div>
  <img className='img_thmps' style={{height:"140px"}}  src={img3}/>
  <div onClick={uploadData} className="save_changes sub4">
    <h3   style={{margin:0}}>Submit</h3></div>
  
</div>}

  </>

  }
              </div>}
        </TabPanel>
        <TabPanel value="2">
<div className='box  logout_box' style={{display:"flex",flexDirection:"column",gap:"10px",alignItems:"start",marginTop:"10px",padding:"10px"}}>
  <span>Login as : Candidate</span>
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