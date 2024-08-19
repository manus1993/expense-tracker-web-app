import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import SearchAppBar from './Components/TopBar/TopBar';
import DataGridDemo from './Components/DataTable/DataTable';
import BasicModal from './Components/CreateModal/CreateModal';
import './App.css';

interface ItemDetail {
  user: string;
  name: string;
  transaction_id: string;
  amount: number;
  comments: string;
}

interface DebtItems {
  debt_detail: ItemDetail[];
}
interface IncomeItems {
  income_source: ItemDetail[];
}

function App() {
  const [user, setUser] = useState('');
  const [income, setIncome] = useState([]);
  const [debt, setDebt] = useState([]);
  const [tableChange, setTableChange] = useState(0);

  useEffect(() => {
    const url = `http://52.0.141.128:8000/v1/transactions/parsed-data?group_id=CANARIO%203${
      user ? `&user_id=${user}` : ''
    }`;
    axios
      .get(url)
      .then((response) => {
        setDebt(
          response.data.parsed_data.debt.flatMap((item: DebtItems) =>
            item.debt_detail.map((detail: ItemDetail) => ({
              id: `${detail.user}-${detail.name}`, // or some other unique identifier
              transaction_id: detail.transaction_id,
              name: detail.name,
              amount: detail.amount,
              user: detail.user,
              comments: detail.comments,
            })),
          ),
        );
        setIncome(
          response.data.parsed_data.income.flatMap((item: IncomeItems) =>
            item.income_source.map((detail: ItemDetail, index: number) => ({
              id: `${index}-${detail.user}-${detail.name}`,
              transaction_id: detail.transaction_id, // or some other unique identifier
              name: detail.name,
              amount: detail.amount,
              user: detail.user,
              comments: detail.comments,
            })),
          ),
        );
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('There was an error!', error);
      });
  }, [user, tableChange]);

  return (
    <>
      <header className="App-header">
        <SearchAppBar setUser={setUser} />
      </header>
      <div className="App-body">
        <Container>
          <h3>Aportaciones</h3>
          <BasicModal setTableChange={setTableChange} />
          <DataGridDemo rows={income} actions={false} setTableChange={setTableChange} />
        </Container>
        <Container>
          <h3>Por pagar</h3>
          <Button variant="contained" color="success" sx={{ marginBottom: '10px' }}>
            Crear Nuevo Batch
          </Button>
          <DataGridDemo rows={debt} actions setTableChange={setTableChange} />
        </Container>
      </div>
    </>
  );
}

export default App;
