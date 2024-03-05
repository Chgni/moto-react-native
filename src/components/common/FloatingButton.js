import {Button, Icon} from "@rneui/themed";
import React from "react";
import {FAB} from "react-native-paper";


const FloatingButton = ({onPress = () => {}, icon, color='#fff', disabled = false, text = null}) => {
    return (
        <FAB
            disabled={disabled}
            onPress={onPress} buttonStyle={{borderRadius: 50, width: 75, height: 75}}
            icon={icon}
            label={text}
        />
    )
}
export default FloatingButton