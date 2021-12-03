import React,{ useState, useEffect, useContext } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { FirebaseContext } from 'common';
import { useTranslation } from "react-i18next";
import moment from 'moment/min/moment-with-locales';

export default function Users() {
  const { api } = useContext(FirebaseContext);
  const { t } = useTranslation();
  const {
    addUser,
    editUser, 
    deleteUser,
    checkUserExists
  } = api;
  const [data, setData] = useState([]);
  const [cars, setCars] = useState({});
  const usersdata = useSelector(state => state.usersdata);
  const cartypes = useSelector(state => state.cartypes);
  const auth = useSelector(state => state.auth);
  const settings = useSelector(state => state.settingsdata.settings);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(usersdata.users){
        setData(usersdata.users.filter(user => user.usertype ==='driver' && ((user.fleetadmin === auth.info.uid && auth.info.profile.usertype === 'fleetadmin')|| auth.info.profile.usertype === 'admin')));
    }else{
      setData([]);
    }
  },[usersdata.users,auth.info.profile.usertype,auth.info.uid]);

  useEffect(()=>{
    if(cartypes.cars){
        let obj =  {};
        cartypes.cars.map((car)=> obj[car.name]=car.name)
        setCars(obj);
    }
  },[cartypes.cars]);

  const columns = [
      { title: t('createdAt'), field: 'createdAt', editable:'never', defaultSort:'desc',render: rowData => rowData.createdAt? moment(rowData.createdAt).format('lll'):null},
      { title: t('first_name'), field: 'firstName', initialEditValue: '' },
      { title: t('last_name'), field: 'lastName', initialEditValue: '' },
      { title: t('email'), field: 'email', editable:'onAdd',render: rowData => settings.AllowCriticalEditsAdmin ? rowData.email : "Hidden for Demo"},
      { title: t('mobile'), field: 'mobile', editable:'onAdd',render: rowData => settings.AllowCriticalEditsAdmin ? rowData.mobile : "Hidden for Demo"},
      { title: t('profile_image'),  field: 'profile_image', render: rowData => rowData.profile_image?<img alt='Profile' src={rowData.profile_image} style={{width: 50,borderRadius:'50%'}}/>:null, editable:'never'},
      { title: t('vehicle_model_name'), field: 'vehicleMake', initialEditValue: '' },
      { title: t('vehicle_model_no'), field: 'vehicleModel', initialEditValue: '' },
      { title: t('vehicle_reg_no'), field: 'vehicleNumber', initialEditValue: '' },
      { title: t('other_info'), field: 'other_info', initialEditValue: '' },
      { title: t('car_type'), field: 'carType',lookup: cars},
      { title: t('account_approve'),  field: 'approved', type:'boolean', initialEditValue: true },
      { title: t('driver_active'),  field: 'driverActiveStatus', type:'boolean', initialEditValue: true},
      { title: t('lisence_image'),  field: 'licenseImage',render: rowData => rowData.licenseImage?<img alt='License' src={rowData.licenseImage} style={{width: 100}}/>:null, editable:'never'},
      { title: t('wallet_balance'),  field: 'walletBalance', type:'numeric' , editable:'never', initialEditValue: 0},
      { title: t('you_rated_text'), render: rowData => <span>{rowData.ratings?rowData.ratings.userrating: "0"}</span> },
      { title: t('signup_via_referral'), field: 'signupViaReferral', editable:'never' },
      { title: t('referralId'),  field: 'referralId', editable:'never', initialEditValue: '' },
      { title: t('bankName'),  field: 'bankName', initialEditValue: '' },
      { title: t('bankCode'),  field: 'bankCode', initialEditValue: '' },
      { title: t('bankAccount'),  field: 'bankAccount', initialEditValue: '' },
      { title: t('queue'),  field: 'queue', type:'boolean', initialEditValue: false },
  ];

  return (
    usersdata.loading? <CircularLoading/>:
    <MaterialTable
      title={t('drivers')}
      columns={columns}
      data={data}
      options={{
        exportButton: settings.AllowCriticalEditsAdmin,
        sorting: true,
      }}
      editable={{
        onRowAdd: newData =>
        new Promise((resolve,reject) => {
          setTimeout(() => {
            checkUserExists(newData).then((res) => {
              if (res.users && res.users.length > 0) {
                alert(t('user_exists'));
                reject();
              }
              else if(res.error){
                alert(t('email_or_mobile_issue'));
                reject();
              }
              else{
                newData['createdByAdmin'] = true;
                newData['usertype'] = 'driver';
                newData['createdAt'] = new Date().toISOString();
                newData['referralId'] = newData.firstName.toLowerCase() + Math.floor(1000 + Math.random() * 9000).toString();
                let role = auth.info.profile.usertype;
                if(role === 'fleetadmin'){
                  newData['fleetadmin'] = auth.info.uid; 
                }
                dispatch(addUser(newData));
                resolve();
              }
            });
          }, 600);
        }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              dispatch(editUser(oldData.id,newData));
            }, 600);
          }),
        onRowDelete: oldData =>
          settings.AllowCriticalEditsAdmin?
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              dispatch(deleteUser(oldData.id));
            }, 600);
          })
          :
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              alert(t('demo_mode'));
            }, 600);
          })
          , 
      }}
    />
  );
}
