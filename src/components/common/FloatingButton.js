import {Button, Icon} from "@rneui/themed";
import React from "react";

const FloatingButton = ({onPress, icon, color='#fff'}) => {
    return (
        <Button onPress={onPress} buttonStyle={{borderRadius: 50, width: 75, height: 75}}>
            <Icon
                name={icon}
                type='ionicon'
                color={color}
                size={60}
            />
        </Button>
    )
}
export default FloatingButton