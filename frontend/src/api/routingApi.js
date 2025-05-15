import axios from 'axios';
const client = axios.create({ baseURL: '/api/routes' });
//use axios for automatic json parsin, req resp handling and simplified error handling
export function findRoute(params) {
    return client.get('', { params }).then(res => res.data);
}
export function compareRoutes(params) {
    return client.get('compare', { params }).then(res => res.data);
}
export function bestRoute(params) {
    return client.get('best', { params }).then(res => res.data);
}