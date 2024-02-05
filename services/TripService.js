import axios from "axios";

const getTrips = async (user, token) => {
    try {
        console.log('Get Trips');
        const response = await axios.get(`http://10.0.2.2:8000/api/v1/routes?owned=true&joined=true`,{
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

const getTripsById = async (user, token) => {
    try {
        console.log('Get Trips');
        const response = await axios.get(`http://10.0.2.2:8000/api/v1/routes?owned=true&joined=true`,{
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


const createTrip = async (name, description, token) => {
        try {
            const response = await axios.post('http://10.0.2.2:8000/api/v1/routes/', {
                name: name,
                description: description,
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
                //OK, create snack bar ?
            }
        } catch (error) {
            if( error.response ){
                console.log(error.response.data); // => the response payload
            }
        }

};

export {createTrip, getTrips};
