import { ScrollView, View, Text, StyleSheet } from 'react-native';
import {Button, Input} from '@rneui/themed';
import {useEffect, useState} from "react";
import Geocoder from 'react-native-geocoding';

const StepsComponent = ({ steps, deleteStep }) => {
    Geocoder.init("AIzaSyA8GbERy29dn5hEZKj3G1FG8SQoPC9Ocqs");

    useEffect(() => {
        console.log(steps);

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
                console.log(address);
                steps[stepIndex].address = address;
            })
            .catch(error => console.warn(error));*/
    };

    const removeStep = (index) => {
        console.log('remove step');
        this.props.deleteStep(index);
    }

    return (
        <ScrollView style={styles.menu}>
            <ScrollView style={styles.menuItem}>
                {steps.map((step, index) => (
                    <View style={styles.menuItemWrapper} key={index}>
                        <Text>{step.order}</Text>
                        <Input disabled style={styles.menuItemText}> {step.latitude}, {step.longitude}</Input>
                        <Button style={styles.removeStep} onPress={() => deleteStep(step.order)}>X</Button>
                    </View>
                ))}
                {steps.length === 0 && <View style={styles.menuItemWrapper}>
                    <Text>1</Text>
                    <Input disabled style={styles.menuItemText}></Input>
                </View>}
            </ScrollView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    menu: {
        position: 'absolute',
        top: 30,
        left: 30,
        right: 30,
        backgroundColor: 'white',
        maxHeight: 220,
        padding: 10,
        borderRadius: 5,
        zIndex: 10,
    },
    menuItemWrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: 250,
    },
    menuItem: {
        display: "flex",
        flexDirection: "column",
        marginRight: 10,
        padding: 10,
        borderRadius: 5,
        width: 350
    },
    menuItemText: {
        fontWeight: 'bold',
        width: 50
    },
    removeStep: {
        borderRadius: 50,
    },

});

export default StepsComponent;