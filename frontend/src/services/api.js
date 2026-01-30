import axios from 'axios';

const ApiFormData = axios.create({
    baseURL : import.meta.env.VITE_API_BASE_URL,
    withCredentials : true,
    headers : {
        "Content-Type" : "multipart/form-data",
    },
});

const Api = axios.create({
    baseURL : import.meta.env.VITE_API_BASE_URL,
    withCredentials : true,
    headers : {
        "Content-Type" : "application/json"
    }
});

const config = {
    headers : {
        'authorization' : `Bearer ${localStorage.getItem("token")}`
    }
}

export const login = (data) => Api.post('/api/user/login',data);

export const register = (data) => Api.post('/api/user/register',data);

export const sendResetLink = (data) => Api.post('/api/user/forgetPassword',data);

export const changePassword = (data) => Api.put(`/api/user/resetpassword?token=${data.token}&email=${data.email}`,data);

export const getMyProfile = () => Api.get('/api/user/me',config);

export const getRooms = () => Api.get('/api/rooms/getAllRooms',config);

export const createRoom = (data) => Api.post('/api/rooms/createRooms',data,config);

export const updateRoom = (id,data) => Api.put(`/api/rooms/updateRoom/${id}`,data,config);

export const deleteRoom = (id) => Api.delete(`/api/rooms/delete/${id}`,config);

export const getAvailableRooms = (params) => Api.get('/api/rooms/available', { params, ...config });

export const getRoomTypes = () => Api.get('/api/room-types/getAllRoomTypes',config);

export const createRoomType = (data) => Api.post('/api/room-types/createRoomType',data,config);

export const updateRoomType = (id,data) => Api.put(`/api/room-types/updateRoomType/${id}`,data,config);

export const deleteRoomType = (id) => Api.delete(`/api/room-types/delete/${id}`,config);

export const getAmenities = () => Api.get('/api/room-amenities/getAllAmenities',config);

export const createAmenity = (data) => Api.post('/api/room-amenities/createAmenity',data,config);

export const updateAmenity = (id,data) => Api.put(`/api/room-amenities/updateAmenity/${id}`,data,config);

export const deleteAmenity = (id) => Api.delete(`/api/room-amenities/delete/${id}`,config);

export const getReservations = () => Api.get('/api/reservations/getAllReservations',config);

export const createReservation = (data) => Api.post('/api/reservations/createReservation',data,config);

export const updateReservation = (id,data) => Api.put(`/api/reservations/updateReservation/${id}`,data,config);

export const deleteReservation = (id) => Api.delete(`/api/reservations/delete/${id}`,config);

export const getMyReservations = () => Api.get('/api/reservations/reservations/me',config);

export const getReservationById = (id) => Api.get(`/api/reservations/reservations/${id}`,config);

export const cancelMyReservation = (id) => Api.patch(`/api/reservations/reservations/me/${id}/cancel`,{},config);

export const updateMyReservation = (id,data) => Api.put(`/api/reservations/reservations/me/${id}`,data,config);

export const getReservationsByRoom = (roomId) => Api.get(`/api/reservations/admin/reservations/room/${roomId}`,config);

export const getUsers = () => Api.get('/api/admin/getAllUsers',config);

export const getUserById = (id) => Api.get(`/api/admin/getUserById/${id}`,config);

export const createUser = (data) => Api.post('/api/admin/createUser',data,config);

export const updateUser = (id,data) => Api.put(`/api/admin/updateUserById/${id}`,data,config);

export const deleteUser = (id) => Api.delete(`/api/admin/deleteUser/${id}`,config);

export const verifyPayments = (sessionId) => Api.get(`/api/payments/stripe/verify-payment?session_id=${sessionId}`,config);

export const createStripeCheckout = (data) => Api.post('/api/payments/stripe/create-checkout',data,config);