import axios from 'axios';
const client = axios.create({
        baseURL: '/api/routes' ,
        headers: { Accept: 'application/json' }});

export function compareRoutes(params) {
    return client.get('compare', {
        params: {
            startLat: params.startLat,
            startLon: params.startLon,
            endLat: params.endLat,
            endLon: params.endLon,
            profile: params.profile
        }
    }).then(res => res.data);
}
export function singleRoute(params) {
    return client.get('', {
        params: {
            startLat: params.startLat,
            startLon: params.startLon,
            endLat: params.endLat,
            endLon: params.endLon,
            profile: params.profile,
            algorithm: params.algorithm
        }
    }).then(res => res.data);
}