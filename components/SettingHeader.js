import React, {useState} from 'react';
import {Text, StyleSheet} from 'react-native';
import {Icon} from "@rneui/base";

const SettingHeader = ({ friend, type, onUpdate }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <Icon name={"settings"} color={"#fff"}/>
    );
};


const styles = StyleSheet.create({
});

export default SettingHeader;