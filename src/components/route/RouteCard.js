import {StyleSheet, TouchableOpacity, View} from "react-native";
import React from "react";
import {Avatar, Divider, Text} from "react-native-paper";

const RouteCard = ({route, onPress}) => {
    return (
        <View  >
            <Divider />

            <TouchableOpacity onPress={onPress} style={styles.tripCard}>
                <Text variant="titleLarge" h4>{route.name}</Text>
                <View style={{flexDirection:"row"}}>
                    <Avatar.Text style={{alignSelf:"center", marginEnd:5}} label={route.owner.username[0]} size={16} />
                    <Text h4 style={{fontSize:13}}>{route.owner.username}</Text>

                </View>
            </TouchableOpacity>
            <Divider />

        </View>
    )

}

const styles = StyleSheet.create({
    tripCard: {
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        borderRadius: 15,
        height: 60,
        paddingEnd: 10,
        paddingStart: 10,
        marginTop: 5,
        marginBottom: 5
    }
});
export default RouteCard