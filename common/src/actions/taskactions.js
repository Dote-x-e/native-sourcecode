import {
    FETCH_TASKS,
    FETCH_TASKS_SUCCESS,
    FETCH_TASKS_FAILED,
    ACCEPT_TASK,
    CANCEL_TASK,
} from "../store/types";
import store from '../store/store';
import { updateProfile } from "./authactions";
import { RequestPushMsg } from '../other/NotificationFunctions';

export const fetchTasks = () => (dispatch) => (firebase) => {

    const {
        auth,
        tasksRef
    } = firebase;
  
    let uid = auth.currentUser.uid;
    dispatch({
        type: FETCH_TASKS,
        payload: null,
    });
    tasksRef().on("value", (snapshot) => {
        if (snapshot.val()) {
            let data = snapshot.val();
            const arr = Object.keys(data)
            .filter(i => data[i].requestedDrivers && data[i].requestedDrivers[uid])
            .map(i => {
                data[i].id = i;
                return data[i];
            });
            dispatch({
                type: FETCH_TASKS_SUCCESS,
                payload: arr,
            });
        } else {
            dispatch({
                type: FETCH_TASKS_FAILED,
                payload: store.getState().languagedata.defaultLanguage.no_tasks,
            });
        }
    });
};


export const acceptTask = (userAuthData,task) => (dispatch) => (firebase) => {

    const {
        trackingRef,
        singleUserRef,
        singleBookingRef,
        requestedDriversRef
    } = firebase;
  
    let uid = userAuthData.uid;

    singleUserRef(uid).once('value', snapshot => {
        let profile = snapshot.val();

        task.driver = uid;
        task.driver_image = profile.profile_image ? profile.profile_image : "";
        task.driver_name = profile.firstName + ' ' + profile.lastName;
        task.driver_contact = profile.mobile;
        task.driver_token = profile.pushToken;
        task.vehicle_number = profile.vehicleNumber;
        task.driverRating = profile.ratings ? profile.ratings.userrating : "0";
        task.fleetadmin = profile.fleetadmin?profile.fleetadmin:'';
        task.status = "ACCEPTED";

        userAuthData.profile = profile;

        singleBookingRef(task.id).update(task).then(()=>{
            requestedDriversRef(task.id).remove();
            updateProfile(userAuthData,{queue:true})(dispatch)(firebase);
            RequestPushMsg(task.customer_token, store.getState().languagedata.defaultLanguage.notification_title, task.driver_name + store.getState().languagedata.defaultLanguage.accept_booking_request)(firebase)
        });

        trackingRef(task.id).push({
            at: new Date().getTime(),
            status: 'ACCEPTED',
            lat: profile.location.lat,
            lng: profile.location.lng
        });
    
    }) 


    dispatch({
        type: ACCEPT_TASK,
        payload: { task: task },
    });
};

export const cancelTask = (bookingId) => (dispatch) => (firebase) => {

    const {
        auth,
        singleTaskRef, 
    } = firebase;
  
    let uid = auth.currentUser.uid;
    dispatch({
        type: CANCEL_TASK,
        payload: { uid: uid, bookingId: bookingId },
    });
    singleTaskRef(uid, bookingId).remove();
};