import {StyleSheet, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faLocationDot} from "@fortawesome/free-solid-svg-icons/faLocationDot";
import {Marker} from "react-native-maps";
import React from "react";
import {Icon, MD3Colors, Avatar, Text, Tooltip} from 'react-native-paper';
import {useUser} from "../../guards/WithAuthGuard";
const UserWaypoint = ({marker, index, onMarkerDragEnd}) => {
    marker.user = {username: "Richard", id: "04e51c5a-dcc8-49b5-95a1-be002eef10a1"} //TODO a supprimer quand l'API sera modifiée

    const { user} = useUser();
    let draggable = false;
    if (user.id = marker.user.id) {
        draggable = true
    }
    return (
            <Marker
                title={marker.user.username}
                draggable={draggable}
                onDragEnd={(e) => onMarkerDragEnd(e, index)}
                tracksViewChanges={false}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            >

                <View>
                    <FontAwesomeIcon icon={faLocationDot} size={35} color={"#ff8700"}/>
                    <View style={styles.customMarker}>

                        <Text style={{color: "white"}}>{marker.user.username[0]}</Text>

                    </View>
                </View>

            </Marker>


    )
}
const styles = StyleSheet.create({
    customMarker: {
        position: "absolute",
        top: 0,
        left: 5,
        backgroundColor: "#ff8700",
        padding: 2,
        width: 25,
        borderRadius: 20,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#ff8700",
        display: "flex",
        alignItems: "center"
    },
    markerText: {
        color: '#fff',
        fontWeight: 'bold',
    }
})

export default UserWaypoint