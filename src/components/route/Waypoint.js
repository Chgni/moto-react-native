import {StyleSheet, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faLocationDot} from "@fortawesome/free-solid-svg-icons/faLocationDot";
import {Text} from "react-native-paper";
import {Marker} from "react-native-maps";
import React from "react";

const Waypoint = ({marker, index, onMarkerDragEnd}) => {
    return (
        <Marker
            draggable={true}
            onDragEnd={(e) => onMarkerDragEnd(e, index)}
            key={index}
            tracksViewChanges={false}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
        >
            <View>
                <FontAwesomeIcon icon={faLocationDot} size={35} color={"red"}/>
                <View style={styles.customMarker}>
                    <Text style={styles.markerText}>{marker.order}</Text>
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
        backgroundColor: "red",
        padding: 2,
        width: 25,
        borderColor: "red",
        borderRadius: 20,
        borderStyle: "solid",
        borderWidth: 1,
        display: "flex",
        alignItems: "center"
    },
    markerText: {
        color: '#fff',
        fontWeight: 'bold',
    }
})

export default Waypoint