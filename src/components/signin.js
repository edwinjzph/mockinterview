import {TextField } from '@mui/material'
import React, { useCallback } from 'react'
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import img from "./googleIcon.png"
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import "./all.css"
import { auth, createaccount, signInWithGoogle } from '../firebase';
import Snackbar from '@mui/material/Snackbar';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
function Signin() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [accountset, setAccountset] = React.useState(true);
    const [forgot, setForgot] = React.useState(true);
    const [open, setOpen] = React.useState([ "","success"]);
    const [checked, setChecked] = React.useState(true);
    const [user, setUser] = React.useState({
      email: "",
      password: "",
      candidate : false,
      interviewer : false
    });



    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
    
    const handleChange = useCallback((e) => {
      const { name, value } = e.target; 
      console.log(name,value)
      if(name==="candidate"){
        console.log("kdbcsj")
        setUser({ ...user, ["candidate"]: e.target.checked});
        console.log(value)
        user["interviewer"] = value==="on"?false:true
      console.log(user["interviewer"])
      console.log(user)
      }
      else if(name==="interviewer"){
        setUser({ ...user, [name]:  e.target.checked });
        console.log(value)
        user["candidate"] =  (value=== "on") ?false:true
       
      }
      else{
        setUser({ ...user, [name]: value });
      }

    }
      ,[user])
      console.log(user)
      const register = (e) => {
        e.preventDefault();
        if(user.password.length >= 8) {
          auth.createUserWithEmailAndPassword(
            user.email,
            user.password
        ).then((authUser) => {
          setOpen(["success","success"])
          auth.currentUser.updateProfile({
            displayName: user.name
        })
        createaccount({candidate:user.candidate,interviewer:user.interviewer,name:user.name,email:user.email,uid:authUser.user.uid})
          }).catch((error) =>{
            setOpen([ error.message,"error"])
          });
        }else{
          console.log("8 characters required")
        }     
   } 
   const signIn =(e) =>{
    e.preventDefault();
        auth.signInWithEmailAndPassword(
            user.email,
            user.password
    
        ).then((authUser) => {
     console.log("Successfully logged In")
                }).catch((error) =>{
                  setOpen([ error.message,"error"])
                });}
        
                const handleClose = (event, reason) => {
                  if (reason === 'clickaway') {
                    return;
                  }
                
                  setOpen(["","success"]);
                };
                const forgots =(e) =>{
                  e.preventDefault();
                  auth.sendPasswordResetEmail(
                      user.email,
                  ).then(() => {
           setOpen([`We have sent you an email for reset password to ${user.email}`,"success"])
                          }).catch((error) =>{
                            setOpen([error.message,"success"])
                          });
              }
   
  return (
    <div className='signin'>
              <Snackbar open={open[0]!==""} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={open[1]} sx={{ width: '100%' }}>
                    {open[0]}
                    </Alert>
                  </Snackbar>
            <div className="sign_first">
                <div className="signinbox">
                {forgot && 
                  <>
                <p>{accountset ? "Sign Up" : "Already have an account?"}</p>
              
              <button  onClick={signInWithGoogle} className='google'><img src={img}></img> Continue with Google</button>
              <div className="jss5"><span className ="jss6">or</span></div>
              <form onSubmit={accountset ? register : signIn} style={{width :"100%" ,display : "flex" ,flexDirection : "column", gap :"20px"}}>
           {accountset &&   <TextField  required type="text"    onChange={handleChange} name = "name"  fullWidth label="Fullname" id="fullWidth" />}
              <TextField  required type="email"    onChange={handleChange} name = "email"  fullWidth label={accountset ?"Enter your email address" :"Enter your registered email id"} id="fullWidth" />
              <FormControl    required  autoComplete='off' variant="outlined">
          <InputLabel   required htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            onChange={handleChange}
            name = "password"
            required
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment sx={{height : "100%" }} position="end">
                <IconButton
                 sx={{height : "100%" }} 
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                 
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
    {!accountset &&    <span  onClick={() => {setForgot(false)}} style={{textAlign :"end" ,color: "#6E2CDC",cursor:"pointer"}}>Forgot password?</span>}
    {accountset &&
    <div style={{display:"flex",justifyContent:"start"}}>
    <FormControlLabel   control={<Checkbox name='candidate' checked={user.candidate}  onChange={handleChange}  />} label="Candidate" />
    <FormControlLabel   control={<Checkbox name='interviewer' checked={user.interviewer}   onChange={handleChange}/>} label="Interviewer" />
    
    </div>}
        <div className="button_wrap">
        <button type="submit"  className='account_btn'>{ accountset ?"Create Account":"Log In"}</button>
        <span  >{accountset  ? "Already have account?" : "Don't have an account?"}  <span className='signin_btn' onClick={() => {setAccountset(!accountset)}}>{accountset ?"  Sign In" :"  Sign Up"}</span></span>
                
        </div>
        </form></>
        }
            {!forgot && 
            <>
        <form onSubmit={forgots} style={{width :"100%" ,display : "flex" ,flexDirection : "column", gap :"20px",paddingTop:"20%"}}>
        <p style={{textAlign :"start"}}>Reset Password</p>
        <span style={{textAlign: "start" ,margin:"0px",color:"#5F5F5F"}}>Dont worry! We got you. Enter your registered email id to receive a link to reset your password.</span>
        <TextField  required type="email"    onChange={handleChange} name = "email"  fullWidth label={accountset ?"Enter your email address" :"Enter your registered email id"} id="fullWidth" />
   <span onClick={() => {setForgot(true)}} style={{textAlign :"end" ,color: "#6E2CDC",cursor:"pointer"}}>Back to Log In</span>
   <button type="submit"  className='account_btn'>Submit</button>
        </form>
        </>}
                </div>
            
            </div>
        
    
        </div>
     
  )
}

export default Signin