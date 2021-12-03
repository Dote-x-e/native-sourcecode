import React,{ useState,useEffect } from 'react';
import MaterialTable from 'material-table';
import { useSelector } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { useTranslation } from "react-i18next";
export default function DriverEarning() {
  const { t } = useTranslation();
    const columns =  [
        { title: t('year'),field: 'year'},
        { title: t('months'), field: 'monthsName' },
        { title: t('driver_name'), field: 'driverName'},
        { title: t('vehicle_reg_no'), field: 'driverVehicleNo' },
        { title: t('earning_amount'), field: 'driverShare' },
        
    ];

  const [data, setData] = useState([]);
  const driverearningdata = useSelector(state => state.driverearningdata);

  useEffect(()=>{
        if(driverearningdata.driverearnings){
            setData(driverearningdata.driverearnings);
        }
  },[driverearningdata.driverearnings]);

  return (
    driverearningdata.loading? <CircularLoading/>:
    <MaterialTable
      title={t('driver_earning')}
      columns={columns}
      data={data}
      
      options={{
        exportButton: true,
        grouping: true,
      }}
      
    />
  );
}
