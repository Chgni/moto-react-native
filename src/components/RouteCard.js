import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Text} from "@rneui/base";
import React from "react";

const RouteCard = ({route, onPress, key}) => {
    return (
        <View >
            <TouchableOpacity onPress={onPress} style={styles.tripCard}>
                <Text h4>{route.name}</Text>
                <Text h4 style={{color: "#fff", alignSelf: "flex-end"}}>De {route.owner.username}</Text>
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
    tripCard: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: 'lightgray',
        justifyContent: "center",
        width: "100%",
        borderRadius: 15,
        height: 70,
        padding: 10,
        marginTop: 5,
        marginBottom: 5
    }
});
export default RouteCard