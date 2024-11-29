import { useDispatch } from 'react-redux';

import { Button, Checkbox, FormControlLabel, MenuItem, Select, Stack, Typography } from '@mui/material';

import { FILTER_OPTIONS } from '../constants';
import { reportActions } from '../reportSlice';
import { inventoryActions } from '../../InventoryList/inventorySlice';

export default function FilterMenu({ handleClose, sinceValue, setSinceValue, includeOverdue, setIncludeOverdue }) {
  const dispatch = useDispatch();

  const handleSinceValue = (e) => {
    setSinceValue(e.target.value);
  };

  const submit = () => {
    dispatch(reportActions.getReports({ since: sinceValue, includeOverdue: includeOverdue }));
    dispatch(inventoryActions.getAllInventoriesForUser({ since: sinceValue }));
    handleClose();
  };

  return (
    <Stack>
      <Typography variant="caption">Display reports for</Typography>
      <Select
        labelId="status-selector-labelId"
        id="status-selector"
        value={sinceValue}
        name={'Selected date time'}
        onChange={handleSinceValue}
        variant="standard"
      >
        {FILTER_OPTIONS.map((option) => (
          <MenuItem key={option.id} value={option.value}>
            {option.display}
          </MenuItem>
        ))}
      </Select>
      <FormControlLabel
        sx={{ paddingTop: '1rem' }}
        control={
          <Checkbox checked={includeOverdue} onChange={() => setIncludeOverdue(!includeOverdue)} color="primary" />
        }
        label={<Typography variant="caption">Include overdue items</Typography>}
      />
      <Button disabled={sinceValue.length <= 0} onClick={submit}>
        Submit
      </Button>
    </Stack>
  );
}