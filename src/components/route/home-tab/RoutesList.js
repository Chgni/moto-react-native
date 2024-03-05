import RouteCard from "../RouteCard";
import {ScrollView} from "react-native";
import React, {useEffect, useState} from "react";
import RouteService, {getTripsOwned} from "../../../services/RouteService";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {useUser} from "../../../guards/WithAuthGuard";

const RoutesList = ({loadData}) => {
    const isFocused = useIsFocused();
    const navigation = useNavigation()
    const [loadingTrips, setLoadingTrips] = useState(true);
    const [routes, setRoutes] = useState([]);

    const loadRoute = () => {
        setLoadingTrips(true);
        loadData().then((routes) => {
            setRoutes(routes)
            setLoadingTrips(false);

        }).catch((e) => {
            //TODO handle error
        })
    }

    const goToTripPage = (id) => {
        navigation.navigate('Route', {
            routeId: id
        });
    }
    useEffect(() => {
        if(isFocused == true) {
            loadRoute();
        }
    }, [isFocused]);
    return (
        <ScrollView style={{ padding: 10}}>
            {routes && !loadingTrips && !loadingTrips && routes.map(route => (
                <RouteCard key={route.id} route={route} onPress={() => goToTripPage(route.id)} />
            ))}
        </ScrollView>
    )
}
export default RoutesList