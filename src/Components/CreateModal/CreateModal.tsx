import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const userRegex = /DEPTO [0-7][1-6]/;
const yearRegex = /20[2-9][0-9]/;

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

export default function BasicModal({
  setTableChange,
}: {
  setTableChange: React.Dispatch<React.SetStateAction<number>>;
}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [currentMonth, setCurrentMonth] = React.useState<string[]>([]);
  const [currentYear, setCurrentYear] = React.useState<string>('');
  const [currentUser, setCurrentUser] = React.useState<string>('');

  const handleMonthChange = (event: SelectChangeEvent<typeof months>) => {
    const {
      target: { value },
    } = event;
    setCurrentMonth(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line no-console
    console.log(event.target.value);
    setCurrentYear(event.target.value);
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line no-console
    console.log(event.target.value);
    setCurrentUser(event.target.value);
  };

  const handleCreateChange = () => {
    if (currentMonth.length === 0 || currentYear === '' || currentUser === '') {
      // eslint-disable-next-line no-alert
      alert('Favor de llenar todos los campos');
      return;
    }
    if (!userRegex.test(currentUser)) {
      // eslint-disable-next-line no-alert
      alert('DEPTO no válido');
      return;
    }
    if (!yearRegex.test(currentYear)) {
      // eslint-disable-next-line no-alert
      alert('Año no válido');
      return;
    }

    // http://0.0.0.0:8000/v1/transactions/create-new-transaction?group_id=CANARIO%204&user_id=DEPTO%20100&month=5&year=2025

    axios.post(
      `http://52.0.141.128:8000/v1/transactions/create-new-transaction?group_id=CANARIO%203&user_id=${currentUser}&month=${currentMonth[0]}&year=${currentYear}`,
    );

    setCurrentMonth([]);
    setCurrentYear('');
    setCurrentUser('');
    setOpen(false);
    setTableChange((prev) => prev + 1);
  };

  return (
    <div>
      <Button variant="contained" color="success" sx={{ marginBottom: '10px' }} onClick={handleOpen}>
        Crear nuevo
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormControl sx={{ m: 1, width: 300, marginBottom: '10px' }}>
            <InputLabel id="demo-multiple-name-label">Mes</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={currentMonth}
              onChange={handleMonthChange}
              input={<OutlinedInput label="Month" />}
              MenuProps={MenuProps}
              sx={{ marginBottom: '10px' }}
            >
              {months.map((month) => (
                <MenuItem key={month} value={month} style={getStyles(month, currentMonth, theme)}>
                  {month}
                </MenuItem>
              ))}
            </Select>
            <TextField
              required
              id="outlined-required"
              label="Año"
              defaultValue="...."
              onChange={handleYearChange}
              sx={{ marginBottom: '10px' }}
            />
            <TextField
              required
              id="outlined-required"
              label="DEPTO"
              defaultValue="DEPTO .."
              onChange={handleUserChange}
              sx={{ marginBottom: '10px' }}
            />
            <Button onClick={handleCreateChange} variant="contained" color="success" sx={{ marginBottom: '10px' }}>
              Crear
            </Button>
          </FormControl>
        </Box>
      </Modal>
    </div>
  );
}
