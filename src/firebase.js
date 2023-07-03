import firebase from "firebase/compat/app"
import 'firebase/compat/auth';
import 'firebase/compat/firestore'
import { v4 as uuidv4 } from 'uuid';

const firebaseConfig = {
    apiKey: "AIzaSyCwTW-ppHL34-05mETNyYTITa1g1u1pq5g",
    authDomain: "online-interview-67c1d.firebaseapp.com",
    projectId: "online-interview-67c1d",
    storageBucket: "online-interview-67c1d.appspot.com",
    messagingSenderId: "654081889402",
    appId: "1:654081889402:web:0d92c8098561f285f197c3"
  };

  
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth=firebase.auth();
  const googleProvider = new firebase.auth.GoogleAuthProvider()
  export const signInWithGoogle = () => {
    auth.signInWithPopup(googleProvider).then((res) => {
      console.log(res.user)
    }).catch((error) => {
      console.log(error.message)
    })
  }


  export {auth};
  export default db;

  export const createaccount = async (data) => {
    if(!data) return
    const {email,name,interviewer,uid} =data
    const userRef = db.doc(`users/${uid}`);
    var flag = true
    if(interviewer===true){
      flag= true
    }else{
      flag=false
    }
          try {
            await userRef.set({
              email:email,
              name: name,
              flag: flag,
              createdAt: new Date(),
            });
          } catch (error) {
            console.log('Error in creating user', error);
          }
    
  }

  export const createinterview = async (data) => {
    if(!data) return
    const {interview,user,question} =data
    const uuid =uuidv4()
    const userRef = db.doc(`interviews/${uuid}`);
          try {
            await userRef.set({
              interviewer: user.name,
              ext_time: interview.ext_time,
              position:interview.position,
              instruct:interview.instruct,
              uid:user.uid,
              noq:Object.keys(question).length,
              createdAt: new Date(),
            }).then(() =>{
             
              Object.entries(question).forEach( async (data) =>{
                const userRef2 = db.doc(`interviews/${uuid}/questions/${data[0]}`);
                try {
                  await userRef2.set({
                    q1: data[1],
                    createdAt: new Date(),
                  });
                } catch (error) {
                  console.log('Error in  adding question', error);
                }

              })

            })
          } catch (error) {
            console.log('Error in creating user', error);
          }
    
  }
  export const createanswer = async (data) => {
    if(!data) return
    const {interview,question,user} =data
    const userRef = db.doc(`interviews/${interview}/ans/${uuidv4()}`);
     try {
            await userRef.set({
              email: user.email,
              name: user.name,
              question: question,
              uid:user.uid,
              createdAt: new Date(),
            });
          } catch (error) {
            console.log('Error in adding ans', error);
          }
    
  }