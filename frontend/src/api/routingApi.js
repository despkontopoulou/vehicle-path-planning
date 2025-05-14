import axios from 'axios';
const client = axios.create({ baseURL: '/api/routes' });

export function findRoute(params) {
    return client.get('', { params }).then(res => res.data);
}
export function compareRoutes(params) {
    return client.get('compare', { params }).then(res => res.data);
}
export function bestRoute(params) {
    return client.get('best', { params }).then(res => res.data);
}