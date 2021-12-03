import React,{ useState, useEffect, useContext } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { FirebaseContext } from 'common';
import { useTranslation } from "react-i18next";

export default function Notifications() {
  const { api } = useContext(FirebaseContext);
  const { t } = useTranslation();
  const {
    sendNotification,
    editNotifications
  } = api;
  const settings = useSelector(state => state.settingsdata.settings);
  const columns =  [
      {
        title: t('device_type'),
        field: 'devicetype',
        lookup: { All: 'All', ANDROID: 'Android', IOS: 'iOS' },
      },
      {
        title: t('user_type'),
        field: 'usertype',
        lookup: { rider: t('rider'), driver: t('driver') },
      },
      { title: t('title'),field: 'title'},
      { title: t('body'), field: 'body' },
  ];

  const [data, setData] = useState([]);
  const notificationdata = useSelector(state => state.notificationdata);
  const dispatch = useDispatch();

  useEffect(()=>{
        if(notificationdata.notifications){
            setData(notificationdata.notifications);
        }else{
            setData([]);
        }
  },[notificationdata.notifications]);

  return (
    notificationdata.loading? <CircularLoading/>:
    <MaterialTable
      title={t('push_notification_title')}
      columns={columns}
      data={data}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const tblData = data;
              tblData.push(newData);
              settings.AllowCriticalEditsAdmin?
                dispatch(sendNotification(newData))
                :
                alert(t('demo_mode'));
              dispatch(editNotifications(newData,"Add"));
            }, 600);
          }),

          onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              dispatch(editNotifications(newData,"Update"));
            }, 600);
          }),
        onRowDelete: oldData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              dispatch(editNotifications(oldData,"Delete"));
            }, 600);
          }),
      }}
    />
  );
}
