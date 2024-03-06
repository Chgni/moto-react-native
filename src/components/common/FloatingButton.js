import {Button, Icon} from "@rneui/themed";
import React from "react";
import {FAB, Portal} from "react-native-paper";

// il faut mettre un <PaperProvider> la ou on veut que le button apparaisse !!
const FloatingButton = ({onPress = () => {}, icon, disabled = false, text = null}) => {
    return (
            <FAB
                disabled={disabled}
                onPress={onPress}
                icon={icon}
                label={text}
            />
    )
}
export default FloatingButton