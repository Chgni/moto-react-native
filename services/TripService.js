import axios from "axios";

const getTripsOwned = async (user, token) => {
    try {
        console.log('Get Trips');
        const response = await axios.get(`http://82.65.153.125:8888/api/v0.1/routes?owned=true&joined=false`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if( error.response ){
            // console.log(error.response.data); // => the response payload
            console.log(error.response.data);
        }
    }
};
const getTripsJoined = async (user, token) => {
    try {
        const response = await axios.get(`http://82.65.153.125:8888/api/v0.1/routes?owned=false&joined=true`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if( error.response ){
            // console.log(error.response.data); // => the response payload
        }
    }
};

const getTripById = async (id, user, token) => {
    try {
        console.log("GET TRIP ID ERROR");
        console.log(id);
        console.log(token);
        const response = await axios.get(`http://82.65.153.125:8888/api/v0.1/routes/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if( error.response ){
            // console.log(error.response.data); // => the response payload
            console.log('Cant get trips');
        }
    }
};


const createTrip = async (name, description, token, steps) => {
    const filteredSteps = [];
    for (let step of steps) {
        const filtered = {latitude: parseFloat(step.latitude.toFixed(5)),
            longitude: parseFloat(step.longitude.toFixed(5)), order: step.order, name: "step"};
        filteredSteps.push(filtered);
    }
        try {
            const response = await axios.post('http://82.65.153.125:8888/api/v0.1/routes/', {
                name: name,
                description: description,
                waypoints: filteredSteps
            }, {headers: {
                    Authorization: `Bearer ${token}`
                }});

            if (response.status === 422) {
                alert('Erreur de champs');
            }

            if (response.status === 500) {
                alert('Erreur de base de données');
            }

            if (response.status === 201) {
                return response.data;
                //OK, create snack bar ?
            }
        } catch (error) {
            if( error.response ){
                console.log(error.response.data); // => the response payload
            }
        }

};

const updateTrip = async (route_id, steps, token) => {
    const filteredSteps = [];
    for (let step of steps) {
        const filtered = {latitude: parseFloat(step.latitude.toFixed(5)),
            longitude: parseFloat(step.longitude.toFixed(5)), order: step.order, name: "step"};
        filteredSteps.push(filtered);
    }
    try {
        //console.log("filter");
        console.log(route_id);
        console.log(filteredSteps);
        const response = await axios.put(`http://82.65.153.125:8888/api/v0.1/routes/${route_id}/waypoints/`,
            filteredSteps
        , {headers: {
                Authorization: `Bearer ${token}`
            }});

        if (response.status === 404) {
            alert('Impossible de faire la mise a jour.');
        }

        if (response.status === 500) {
            alert('Erreur de base de données');
        }

        if (response.status === 200) {
            return response;
        }
    } catch (error) {
        if( error.response ){
            console.log(error); // => the response payload
        }
    }

};

export {createTrip, getTripsOwned, getTripById, updateTrip, getTripsJoined};
