import { ScrollView, View, Text, StyleSheet } from 'react-native';
import {Button, Divider, IconButton, Surface, TextInput} from 'react-native-paper';
import {useEffect, useState} from "react";
import Geocoder from 'react-native-geocoding';

const StepsComponent = ({ steps, deleteStep, allowDelete}) => {
    Geocoder.init("AIzaSyA8GbERy29dn5hEZKj3G1FG8SQoPC9Ocqs");

    useEffect(() => {

        steps.forEach((step, index) => {
            // Check if the address is not already set
            if (step.latitude && step.longitude && !step.address) {
                getReverseGeocoding(step.latitude, step.longitude, index);
            }
        });

    }, [steps]);

    const getReverseGeocoding = (latitude, longitude, stepIndex) => { //commented for less google api calls
 /*       Geocoder.from(latitude, longitude)
            .then(json => {
                const address = json.results[0].formatted_address;
                steps[stepIndex].address = address;
            })
            .catch(error => console.warn(error));*/
    };

    return (
            <Surface style={styles.surface} elevation={4}>
                <ScrollView style={styles.menu}>
                    {steps.map((step, index) => (
                        <View key={index} style={styles.menuItem}>
                            <View style={styles.menuItemWrapper} >
                                <View style={{alignContent: "center", borderColor:'grey', borderWidth:1, borderRadius: 50, width: 20, height: 20, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{textAlign: 'center', textAlignVertical: 'center'}}>{step.order}</Text>
                                </View>
                                <Text disabled style={styles.menuItemText}> {step.latitude}, {step.longitude}</Text>
                                <IconButton icon={"close"} style={styles.removeStep} onPress={() => deleteStep(step.order)}/>
                            </View>
                            <Divider style={{marginStart:25, marginEnd: 35}} />
                        </View>
                    ))}
                    {steps.length === 0 && <View style={styles.menuItemWrapper}>
                        <Text>1</Text>
                        <TextInput disabled style={styles.menuItemText}></TextInput>
                    </View>}
                </ScrollView>
            </Surface>

    );
};

const styles = StyleSheet.create({
    menu: {

        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,

    },
    menuItemWrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: 250,
    },
    menuItem: {
        marginEnd: 10,
        padding: 10,
        borderRadius: 5,
        width: '100%'
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
        maxHeight: 150,
        zIndex: 10,
    },


});

export default StepsComponent;