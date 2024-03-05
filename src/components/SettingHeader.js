import React, {useState} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Icon} from "@rneui/base";
import { Menu, MenuItem } from 'react-native-material-menu';

import { useNavigation } from '@react-navigation/native';

const SettingHeader = () => {
    const [isVisible, setIsVisible] = useState(false);

    const navigation = useNavigation();

    const toggleVisibleSideMenu = () => {
        setIsVisible(!isVisible);
    }

    const disconnect = () => {
        navigation.navigate('Deconnexion');
    }

    return (
        <View>
            <Menu
                visible={isVisible}
                anchor={<Icon name={"settings"} color={"#fff"} onPress={toggleVisibleSideMenu}/>}
                onRequestClose={toggleVisibleSideMenu}>
                <MenuItem onPress={disconnect}>Déconnexion</MenuItem>
            </Menu>
        </View>
    );
};


const styles = StyleSheet.create({
});

export default SettingHeader;