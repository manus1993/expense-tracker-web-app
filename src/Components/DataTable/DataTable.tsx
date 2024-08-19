import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import PaymentIcon from '@mui/icons-material/Payment';
import axios from 'axios';

interface Row {
  id: number;
  transaction_id: number;
  user: string;
  name: string;
  amount: number;
}

export default function DataGridDemo({
  rows,
  actions = false,
  setTableChange,
}: {
  rows: Row[];
  actions: boolean;
  setTableChange: React.Dispatch<React.SetStateAction<number>>;
}) {
  const marksAsPaid = React.useCallback(
    (row: Row) => {
      // Example row.name: APORTACION 5 2024
      // Example row.user = DEPTO 51
      // Url to mark as paid: user_id=DEPTO%2051&month=5&year=2024
      const url = `http://52.0.141.128:8000/v1/transactions/mark-receipt-as-paid?group_id=CANARIO%203&user_id=${
        row.user
      }&month=${row.name.split(' ')[1]}&year=${row.name.split(' ')[2]}`;
      // eslint-disable-next-line no-console
      console.log(url);
      axios.post(url);
      setTableChange((prev) => prev + 1);
    },
    [setTableChange],
  );

  const columns: GridColDef[] = [
    { field: 'transaction_id', headerName: '# Recibo', width: 90 },
    {
      field: 'user',
      headerName: 'Departamento',
      width: 150,
      editable: false,
    },
    {
      field: 'name',
      headerName: 'Descripción',
      width: 180,
      editable: false,
    },
    {
      field: 'amount',
      headerName: 'Monto',
      type: 'number',
      width: 110,
      editable: false,
    },
    {
      field: 'comments',
      headerName: 'Comentarios',
      width: 500,
      editable: false,
    },
  ];

  if (actions) {
    columns.push({
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          key={`action-${params.row.id}`} // Add a unique key prop
          label="Pagado"
          icon={<PaymentIcon />}
          onClick={() => marksAsPaid(params.row)}
        />,
      ],
    });
  }

  return (
    <Box sx={{ height: 380, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
