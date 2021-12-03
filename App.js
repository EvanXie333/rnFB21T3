import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//components

import { Signup } from './components/Signup';
import { Signin} from './components/Signin';
import { Home } from './components/Home';
import {Signout} from './components/Signout'

//firebase
import { firebaseConfig } from './Config';
import {initializeApp} from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword,signOut } from "firebase/auth";
import { initializeFirestore, getFirestore, setDoc, doc, addDoc, collection } from 'firebase/firestore'


const FBapp = initializeApp( firebaseConfig)
const FSdb = initializeFirestore(FBapp, {useFetchStreams: false})
const FBauth = getAuth()


const Stack = createNativeStackNavigator();

export default function App() {
  const[ auth, setAuth] =useState()
  const[ user, setUser] = useState()
  const [signupError,setSignupError] = useState()
  const [signinError,setSigninError] = useState()

  

  useEffect( ()=> {
    onAuthStateChanged(FBauth, (user) => {
      if(user) {
        setAuth(true)
        setUser(user)
      }
      else{
        setAuth(false)
        setUser(null)
      }
    })
  })


  const SignupHandler = (email,password) =>{
    setSignupError(null)
    createUserWithEmailAndPassword(FBauth, email, password)
    .then( (userCredential )=>{
      addDoc( collection (firestore,'users'), {id:userCredential.user.uid, email: userCredential.user.email})
      //createUser('user', {id:userCredential.user.uid, email: userCredential.user.email})
      setUser(userCredential)
      setAuth(true)
    })
    .catch( (error) =>{ console.log(error.code) })

  }

  

  const SigninHandler =(email, password) =>{
    signInWithEmailAndPassword(FBauth, email, password )
    .then( (userCredential) => {
      
      setUser(userCredential)
      setAuth(true)
    })
    .catch( (error) =>{ setSignupError(error) } )
  } 

  const SignoutHandler = () =>{
    signOut( FBauth).then( ()=> {
      setAuth(false)
      setUser(null)
    })
    .catch( (error) => console.log(error.code))
  }

  const createUser = async ( collection, data) => {
    firestore.collection( collection).doc(data.id).set(data)
    .then((response) => console.log(response))
    .catch((error) => console.log(error))
  }
  return (
    <NavigationContainer>
      
        {/* <Stack.Screen name="Signup" component ={Signup} 
        options={{title:'Sign up'}}/> */}
        <Stack.Navigator>
        <Stack.Screen name="Signup" options={ {title:'Sign up'}}>
        
        { (props) => <Signup {...props} handler= { SignupHandler} auth={auth} error= { signupError }/>}
        </Stack.Screen>

        <Stack.Screen name="Signin"  options={{title:'Sign in'}}>
          
          { (props) => <Signin {...props} auth = {auth} error={signinError} handler = { SigninHandler}/>}
        </Stack.Screen>
        
        <Stack.Screen name="Home" options = {{
          headderTitle: "Home",
          headerRight: (props) => <Signout {...props} handler = {SignoutHandler}/>
         }}> 
          { (props) => 
          <Home {...props} auth= {auth} />}
          </Stack.Screen>
          
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
