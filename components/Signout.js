import React from 'react'
import {StyleSheet, TouchableOpacity, Text} from 'react-native'
export function Signout( props){
    return(
        <TouchableOpacity>
            <Text style={styles.signoutText}>Sign out</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    signoutText:{
        color: "black",
    }
})