import axios from "axios";
import configuration from "../config/services";

export const getDog = (product) => {
    return axios.get(configuration.api.dog_api + '/api/breed/hound/' + product + '/images');
};
