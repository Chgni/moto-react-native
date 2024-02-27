import RouteCard from "../RouteCard";
import {ScrollView} from "react-native";
import React, {useEffect, useState} from "react";
import RouteService, {getTripsOwned} from "../../../services/RouteService";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {useUser} from "../../../guards/WithAuthGuard";

const RoutesOwned = () => {
    const isFocused = useIsFocused();
    const navigation = useNavigation()
    const [loadingTrips, setLoadingTrips] = useState(true);
    const routeService = new RouteService()
    const [routes, setRoutes] = useState([]);

    const getTripsOwned = () => {
        setLoadingTrips(true);
        routeService.getRoutes(true, false).then(owned_routes => {
            setRoutes(owned_routes)
            setLoadingTrips(false);
        })
    }

    const goToTripPage = (id) => {
        navigation.navigate('Route', {
            tripId: id
        });
    }
    useEffect(() => {
        if(isFocused == true) {
            getTripsOwned();
        }
    }, [isFocused]);
    return (
        <ScrollView style={{ padding: 10}}>
            {!loadingTrips && !loadingTrips && routes.map(route => (
                <RouteCard key={route.id} route={route} onPress={() => goToTripPage(route.id)} />
            ))}
        </ScrollView>
    )
}
export default RoutesOwned