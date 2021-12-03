import React,{ useState, useEffect, useContext } from 'react';
import MaterialTable from 'material-table';
import CircularLoading from "../components/CircularLoading";
import { useSelector, useDispatch } from "react-redux";
import { FirebaseContext } from 'common';
import { useTranslation } from "react-i18next";

const Withdraws = () => {
  const { api } = useContext(FirebaseContext);
  const { t } = useTranslation();
  const {
    completeWithdraw
  } = api;
  const dispatch = useDispatch();
  const columns =  [
      { title: 'ID', field: 'id',editable: 'never' },
      { title: t('requestDate'), field: 'date',editable: 'never' },
      { title: t('driver_name'),field: 'name',editable: 'never'},
      { title: t('amount'), field: 'amount',editable: 'never' },
      { title: t('processed'), field: 'processed', type: 'boolean',editable: 'never'},  
      { title: t('processDate'), field: 'procesDate',editable: 'never'}, 
      { title: t('bankName'), field: 'bankName',editable: 'never' },
      { title: t('bankCode'), field: 'bankCode' ,editable: 'never'},
      { title: t('bankAccount'), field: 'bankAccount',editable: 'never' }, 
  ];
  const [data, setData] = useState([]);
  const withdrawdata = useSelector(state => state.withdrawdata);

  useEffect(()=>{
        if(withdrawdata.withdraws){
            setData(withdrawdata.withdraws);
        }else{
          setData([]);
        }
  },[withdrawdata.withdraws]);
  
  return (
    withdrawdata.loading? <CircularLoading/>:
    <MaterialTable
      title={t('booking_title')}
      columns={columns}
      data={data}
      options={{
        exportButton: true
      }}
      actions={[
        rowData => ({
          icon: 'check',
          tooltip: t('process_withdraw'),
          disabled: rowData.processed,
          onClick: (event, rowData) => {
            dispatch(completeWithdraw(rowData));
          }         
        }),
      ]}
    />
  );
}

export default Withdraws;
