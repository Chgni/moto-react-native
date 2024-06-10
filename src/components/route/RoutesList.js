import RouteCard from "./RouteCard";
import {ScrollView} from "react-native";
import React, {useEffect, useState} from "react";
import {useIsFocused, useNavigation} from "@react-navigation/native";

const RoutesList = ({loadData}) => {
    const isFocused = useIsFocused();
    const navigation = useNavigation()
    const [routes, setRoutes] = useState([]);

    const loadRoute = () => {
        loadData().then((new_routes) => {
                setRoutes(new_routes)
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
        <ScrollView >
            {routes && routes.map(route => (
                <RouteCard key={route.id} route={route} onPress={() => goToTripPage(route.id)} />
            ))}
        </ScrollView>
    )
}
export default RoutesList