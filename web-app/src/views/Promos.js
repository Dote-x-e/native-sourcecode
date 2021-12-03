import React, { useState, useEffect, useContext } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { FirebaseContext } from 'common';
import { useTranslation } from "react-i18next";
import moment from 'moment/min/moment-with-locales';

export default function Promos() {
  const { api } = useContext(FirebaseContext);
  const { t } = useTranslation();
  const {
    editPromo
  } = api;
  const settings = useSelector(state => state.settingsdata.settings);

  const columns = [
    { title: t('promo_name'), field: 'promo_name' },
    { title: t('description'), field: 'promo_description' },
    {
      title: t('title'),
      field: 'promo_discount_type',
      lookup: { flat: t('flat'), percentage: t('percentage') },
    },
    { title: t('promo_discount_value'), field: 'promo_discount_value', type: 'numeric' },
    { title: t('max_limit'), field: 'max_promo_discount_value', type: 'numeric' },
    { title: t('min_limit'), field: 'min_order', type: 'numeric' },
    { title: t('end_date'), field: 'promo_validity', render: rowData => rowData.promo_validity ? moment(rowData.promo_validity).format('lll') : null },
    { title: t('promo_usage'), field: 'promo_usage_limit', type: 'numeric' },
    { title: t('promo_used_by'), field: 'user_avail', editable: 'never' }
  ];

  const [data, setData] = useState([]);
  const promodata = useSelector(state => state.promodata);
  const dispatch = useDispatch();

  useEffect(() => {
    if (promodata.promos) {
      setData(promodata.promos);
    } else {
      setData([]);
    }
  }, [promodata.promos]);

  return (
    promodata.loading ? <CircularLoading /> :
      <MaterialTable
        title={t('promo_offer')}
        columns={columns}
        data={data}
        editable={{
          onRowAdd: newData =>
            new Promise(resolve => {
              setTimeout(() => {
                  newData['createdAt'] = new Date().toISOString();
                  dispatch(editPromo(newData,"Add"));
                  resolve();
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            settings.AllowCriticalEditsAdmin?
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                dispatch(editPromo(newData,"Update"));
              }, 600);
            })
            :
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                alert(t('demo_mode'));
              }, 600);
            }),
          onRowDelete: oldData =>
            settings.AllowCriticalEditsAdmin?
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                dispatch(editPromo(oldData,"Delete"));
              }, 600);
            })
            :
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                alert(t('demo_mode'));
              }, 600);
            })
        }}
      />
  );
}
