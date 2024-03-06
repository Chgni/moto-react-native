import {Button, Icon} from "@rneui/themed";
import React from "react";
import {FAB, Portal} from "react-native-paper";


const FloatingButton = ({onPress = () => {}, icon, disabled = false, text = null}) => {
    return (
        <Portal>
            <FAB
                disabled={disabled}
                onPress={onPress}
                icon={icon}
                label={text}
            />
        </Portal>
    )
}
export default FloatingButton