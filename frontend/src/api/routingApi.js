import axios from 'axios';
const client = axios.create({
        baseURL: '/api/routes' ,
        headers: { Accept: 'application/json' }});

//use axios for automatic json parsing, req resp handling and simplified error handling
export function findRoute(params) {
    return client.get('', { params }).then(res => res.data);
}
export function compareRoutes(params) {
    return client.get('compare', {
        params: {
            startLat: params.startLat,
            startLon: params.startLon,
            endLat: params.endLat,
            endLon: params.endLon,
        }
    }).then(res => res.data);
}
export function bestRoute(params) {
    return client.get('best', { params }).then(res => res.data);
}