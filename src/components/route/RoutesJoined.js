import RouteCard from "../RouteCard";
import {ScrollView} from "react-native";
import React, {useEffect, useState} from "react";
import RouteService, {getTripsOwned} from "../../services/RouteService";
import {useIsFocused, useNavigation} from "@react-navigation/native";

const RoutesJoined = () => {
    const isFocused = useIsFocused();
    const navigation = useNavigation()
    const [loadingRoutes, setLoadingRoutes] = useState(true);
    const routeService = new RouteService()
    const [routes, setRoutes] = useState([]);

    const getTripsJoined = () => {
        setLoadingRoutes(true);
        routeService.getRoutes(false, true).then(joined_routes => {
            setRoutes(joined_routes);
            setLoadingRoutes(false);
        })
    }

    const goToTripPage = (id) => {
        navigation.navigate('UpdateTrip', {
            tripId: id
        });
    }
    useEffect(() => {
        if(isFocused) {
            getTripsJoined();
        }
    }, [isFocused]);
    return (
        <ScrollView style={{ padding: 10}}>
            {!loadingRoutes && !loadingRoutes && routes.map(route => (
                <RouteCard key={route.id} route={route} onPress={() => goToTripPage(route.id)} />
            ))}
        </ScrollView>
    )
}
export default RoutesJoined