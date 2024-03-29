import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//components

import { Signup } from './components/Signup';
import { Signin} from './components/Signin';
import { Home } from './components/Home';
import {Signout} from './components/Signout'
import {Detail} from './components/Detail'
import {Todo} from './components/Todo'

//firebase
import { firebaseConfig } from './Config';
import {initializeApp} from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword,signOut } from "firebase/auth";
import { initializeFirestore, 
  getFirestore, 
  setDoc, 
  doc, 
  addDoc, 
  getDoc,
  collection,
  query, where, onSnapshot 
} from 'firebase/firestore'


const FBapp = initializeApp( firebaseConfig)
const FSdb = initializeFirestore(FBapp, {useFetchStreams: false})
const FBauth = getAuth()


const Stack = createNativeStackNavigator();

export default function App() {
  const[ auth, setAuth] =useState()
  const[ user, setUser] = useState()
  const [signupError,setSignupError] = useState()
  const [signinError,setSigninError] = useState()
  const [data, setData] = useState()

  

  useEffect( ()=> {
    onAuthStateChanged(FBauth, (user) => {
      if(user) {
        setAuth(true)
        setUser(user)
        if(!data) {getData()}
      }
      else{
        setAuth(false)
        setUser(null)
      }
    })
  })

  // useEffect( ()=> {
  //   if(!data && user){
  //     getData()
  //   }
  // },[data,auth, user] )

  const SignupHandler = (email,password) =>{
    setSignupError(null)
    createUserWithEmailAndPassword(FBauth, email, password)
    .then( (userCredential )=>{
      addDoc( collection (firestore,'users'), {id:userCredential.user.uid, email: userCredential.user.email})

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
      console.log(userCredential.user.uid)
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

  const addData = async (FScolletction, data) =>{
    //const ref = await addDoc( collection(FSdb, FScolletction), data)
    const ref = await setDoc( doc(FSdb, `users/${user.uid}/documents/${new Date().getTime()} `), data )}

  const getData = () =>{
    //console.log('...getting data')
    const FSquery = query( collection(FSdb,`users/${user.uid}/documents`) )
    const unsubscribe = onSnapshot( FSquery, (querySnapshot)=> {
      let FSdata = []
      querySnapshot.forEach( (doc) =>{
        let item ={}
        item = doc.data()
        item.id = doc.id
        FSdata.push( doc.data() )
    })
    setData(FSdata)
    
    })
    
  }

  const getDetail = async (id) =>{
    const docRef = doc( FSdb, `users/${user.uid}/documents`, id)
    const docData = await getDoc(docRef)
    return new Promise( (resolve,reject) => {
      if(docData.exists()) {
        let document = docData.data()
        document.id = id
        resolve(document)
      }
      else{
        reject('no such document')
      }
    })
    
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
          headerRight: (props) => <Signout {...props} handler = {SignoutHandler} user={user}/>
         }}> 
          { (props) => 
          <Home {...props} auth= {auth} add={addData} data={ data }/>}
          </Stack.Screen>
          <Stack.Screen name="Detail" options={{
            headerTitle: "Item detail"
          }}>
            { (props) => <Detail {...props} get ={getDetail}/>}

          </Stack.Screen>

          <Stack.Screen name="Todo" component={Todo}/>
        
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
