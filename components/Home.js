import React, {useEffect,useState} from "react";
import { View,Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";


export function Home (props){

    const navigation = useNavigation()
    if(!props.auth){
        navigation.reset({ index: 0, routes: [ {name: 'Home'} ] })
    }
    useEffect( ()=> {
       
    }, [props.auth])
    return(
        <View>
            <Text>Home</Text>
            
        </View>
    )
}