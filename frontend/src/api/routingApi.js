import axios from 'axios';
import qs from 'qs';

const client = axios.create({
    baseURL: '/api/routes',
    headers: { Accept: 'application/json' },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
});

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

export function getMultiRoute(params) {
    const query = {
        startLat: params.startLat,
        startLon: params.startLon,
        endLat: params.endLat,
        endLon: params.endLon,
        profile: params.profile,
        algorithm: params.algorithm,
    };

    if (params.waypoints && params.waypoints.length > 0) {
        query.viaLat = params.waypoints.map(wp => wp[0]);
        query.viaLon = params.waypoints.map(wp => wp[1]);
    }

    return client.get('multi', { params: query })
        .then(res => res.data);
}

export function compareMultiRoutes(params) {
    const query = {
        startLat: params.startLat,
        startLon: params.startLon,
        endLat: params.endLat,
        endLon: params.endLon,
        profile: params.profile,
    };

    if (params.waypoints && params.waypoints.length > 0) {
        query.viaLat = params.waypoints.map(wp => wp[0]);
        query.viaLon = params.waypoints.map(wp => wp[1]);
    }

    return client.get('multi/compare', { params: query })
        .then(res => res.data);
}

export function getStats(params) {
    return client.get('stats', {
        params: {
            startLat: params.startLat,
            startLon: params.startLon,
            endLat: params.endLat,
            endLon: params.endLon,
            vehicles: params.vehicles,
            profiles: params.profiles,
            algorithms: params.algorithms,
        }
    }).then(res => res.data);
}

