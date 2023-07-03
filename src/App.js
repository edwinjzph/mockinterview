import './App.css';
import Candidate from './components/candidate';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Signin from './components/signin';
import { login, logout, selectUser } from './features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import db, { auth } from './firebase';
import { useEffect} from 'react';
import Interviewer from './components/interviewer';
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth =>{
      if(userAuth){
        db.collection('users').doc(userAuth.uid).get().then((value)=>{
          
          dispatch(login({
            uid: userAuth.uid,
            email: userAuth.email,
            name: value.data().name,
            flag: value.data().flag
          }));
        })   
      }else{
        dispatch(logout());   
      }
    });
    return () =>{
      unsubscribe();
    }
  },[dispatch])

  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <div className="App">
      {user?user.flag?<Interviewer user= {user}/>:<Candidate user={user}/>:<Signin/>}
    </div>
    </ThemeProvider>
  );
}

export default App;
