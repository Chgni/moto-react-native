import React, {useState} from 'react';
import {Text, StyleSheet} from 'react-native';
import {Icon} from "@rneui/base";

const SettingHeader = ({ friend, type, onUpdate }) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibleSideMenu = () => {
        setIsVisible(!isVisible);
        console.log(isVisible);
    }

    return (
        <Icon name={"settings"} color={"#fff"} onPress={toggleVisibleSideMenu}/>
    );
};


const styles = StyleSheet.create({
});

export default SettingHeader;