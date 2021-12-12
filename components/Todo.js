
import React, {useState} from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Keyboard } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { ThemeColours } from './ThemeColours';
import Task from './Item';

export function Todo  (props){
    const [task,setTask] = useState();
    const [taskItems, setTaskItems] = useState([])

    const addTaskHandler = () =>{
        Keyboard.dismiss();
        setTaskItems([...taskItems,task])
        setTask(null);
    }

    const completeTask = (index) =>{
        let itemsCopy = [...taskItems];
        itemsCopy.splice(index,1);
        setTaskItems(itemsCopy)
    }

    return(
        <View style={styles.container}>

            <View style ={styles.taskWrapper}>
            <Text style = {styles.sectionTittle}>Today's Tasks</Text>
            
            <View style = {styles.items}>
                {
                    taskItems.map((item,index) =>{
                       return  (
                       <TouchableOpacity key={index} onPress={ ()=>completeTask(index)}>
                           <Task text = {item} />
                       </TouchableOpacity>)
                    })
                }
                
            </View>

        </View>

        <KeyboardAvoidingView
         behavior= {Platform.OS ==="ios" ? "padding" : "height"}
         style={styles.inputTaskWrapper}>
        
        <TextInput style={styles.input} placeholder={'Write a task'} value ={task} onChangeText={text =>setTask(text)}/> 
        <TouchableOpacity onPress= { ()=> addTaskHandler()}>
            <View style={styles.addWrapper}>
                <Text style={styles.addText}>+</Text>
            </View>
        </TouchableOpacity>
        </KeyboardAvoidingView>
    </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: ThemeColours.turquoise,
        
    },

    taskWrapper:{
        paddingTop: 20,
        paddingHorizontal: 20,

    },

    sectionTittle:{
        fontSize:24,
        fontWeight: 'bold'
    },

    items:{
        marginTop:25,
    },

    inputTaskWrapper:{
        position: 'absolute',
        bottom: 60,
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',

    },
    input:{
        paddingVertical: 15,
        width:250,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        borderRadius: 60,
        borderColor: '#C0C0C0',
        borderWidth:1,
        width: 250,
    },
    addWrapper:{
        width: 60,
        height:60,
        backgroundColor: '#FFF',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems:'center',
        borderColor: '#C0C0C0',
        borderWidth:1,
    },
    addText:{},
})