import React,{ useState,useEffect } from 'react';
import MaterialTable from 'material-table';
import { useSelector} from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { useTranslation } from "react-i18next";

export default function Earningreports() {
  const { t } = useTranslation();

    const columns =  [
        { title: t('year'),field: 'year'},
        { title: t('months'), field: 'monthsName' },
        { title: t('Gross_trip_cost'), field: 'tripCost' },
        { title: t('trip_cost_driver_share'), field: 'rideCost' },
        { title: t('convenience_fee'), field: 'convenienceFee' },
        
        { title: t('Discounts'), field: 'discountAmount' },
        { title: t('Profit'),  render: rowData => (parseFloat(rowData.convenienceFee) - parseFloat(rowData.discountAmount)).toFixed(2) , editable:'never'},
        
    ];

  const [data, setData] = useState([]);
  const earningreportsdata = useSelector(state => state.earningreportsdata);

  useEffect(()=>{
        if(earningreportsdata.Earningreportss){
            setData(earningreportsdata.Earningreportss);
        }
  },[earningreportsdata.Earningreportss]);

  return (
    earningreportsdata.loading? <CircularLoading/>:
    <MaterialTable
      title={t('earning_reports')}
      columns={columns}
      data={data}
      options={{
        exportButton: true,
      }}
      
    />
  );
}
