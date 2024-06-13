import { ScrollView, View, Text, StyleSheet } from 'react-native';
import {Divider, IconButton, Surface} from 'react-native-paper';
import {useEffect, useState} from "react";
import Geocoder from 'react-native-geocoding';

const WaypointsList = ({ steps, deleteStep, allowDelete}) => {

    if (steps.length == 0) {
        return null
    }
    return (
            <Surface style={styles.surface} elevation={4}>
                <ScrollView style={styles.menu}>
                    {steps.map((step, index) => (
                        <View key={index} style={styles.menuItem}>
                            <View style={styles.menuItemWrapper} >
                                <View style={{alignContent: "center", borderColor:'grey', borderWidth:1, borderRadius: 50, width: 20, height: 20, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{ marginTop: -1}}>{step.order}</Text>
                                </View>
                                <Text disabled style={styles.menuItemText}> {step.latitude.toFixed(5)}, {step.longitude.toFixed(5)}</Text>
                                {allowDelete && deleteStep && <IconButton  icon={"close"} style={styles.removeStep} onPress={() => deleteStep(step.order)}/>}
                            </View>
                            <Divider style={{marginStart:25, marginEnd: 35}} />
                        </View>
                    ))}
                </ScrollView>
            </Surface>

    );
};

const styles = StyleSheet.create({
    menu: {

        backgroundColor: 'white',
        borderRadius: 5,

    },
    menuItemWrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: 275,
        height: 50
    },
    menuItem: {
        width: '100%',
        paddingStart: 10,
        paddingEnd: 10,
    },
    menuItemText: {
        width: '100%'
    },
    removeStep: {
        borderRadius: 50,
    },
    surface: {
        position: 'absolute',
        top: 30,
        left: 30,
        right: 30,
        maxHeight: 157,
        zIndex: 10,
    },


});

export default WaypointsList;