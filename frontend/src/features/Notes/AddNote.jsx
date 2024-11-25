import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { ADD_NOTES_FORM_FIELDS, STATUS_OPTIONS } from './constants';
import { useDispatch } from 'react-redux';
import { AddRounded, CheckCircleRounded } from '@mui/icons-material';
import { notesActions } from './notesSlice';
import ColorPicker from '../../utils/ColorPicker';
import RetrieveUserLocation from '../../common/Location/RetrieveUserLocation';
import LocationPicker from '../../common/Location/LocationPicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import dayjs from 'dayjs';

const AddNote = ({ setEditMode, setSelectedNoteID, noteID, notes }) => {
  const dispatch = useDispatch();

  const [planColor, setPlanColor] = useState('#f7f7f7');
  const [location, setLocation] = useState({ lat: 0, long: 0 });
  const [completionDate, setCompletionDate] = useState(dayjs());
  const [formFields, setFormFields] = useState(ADD_NOTES_FORM_FIELDS);
  const [status, setStatus] = useState(STATUS_OPTIONS[0].label);

  const handleColorChange = (newValue) => {
    setPlanColor(newValue);
  };

  const handleStatus = (e) => {
    setStatus(e.target.value);
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    const updatedFormFields = Object.assign({}, formFields, {
      [name]: {
        ...formFields[name],
        value: value,
        errorMsg: '',
      },
    });
    for (const validator of updatedFormFields[name].validators) {
      if (validator.validate(value)) {
        updatedFormFields[name].errorMsg = validator.message;
        break;
      }
    }
    setFormFields(updatedFormFields);
  };

  const submit = () => {
    const containsErr = Object.values(formFields).some((el) => el.errorMsg);
    const userID = localStorage.getItem('userID');
    const requiredFormFields = Object.values(formFields).filter((v) => v.required);
    const isRequiredFieldsEmpty = requiredFormFields.some((el) => el.value.trim() === '');

    if (containsErr || isRequiredFieldsEmpty) {
      enqueueSnackbar('Cannot add new item.', {
        variant: 'error',
      });
      return;
    }

    const formattedNotes = Object.values(formFields).reduce((acc, el) => {
      if (el.value) {
        acc['noteID'] = noteID;
        acc[el.name] = el.value;
      }
      return acc;
    }, {});

    const formattedDraftNotes = {
      ...formattedNotes,
      color: planColor,
      status: status,
      location: location,
      completionDate: completionDate.toISOString(),
      updated_by: userID,
    };

    if (noteID) {
      dispatch(notesActions.updateNote(formattedDraftNotes));
    } else {
      dispatch(notesActions.createNote(formattedDraftNotes));
    }

    setEditMode(false);
    setSelectedNoteID(null);
    setPlanColor('#f7f7f7');
    setStatus(STATUS_OPTIONS[0].label);
    setFormFields(ADD_NOTES_FORM_FIELDS);
    enqueueSnackbar(noteID ? 'Successfully updated existing item.' : 'Successfully added new item.', {
      variant: 'success',
    });
  };

  useEffect(() => {
    if (noteID !== null) {
      const selectedNote = notes.filter((v) => v.noteID === noteID);
      const draftNote = selectedNote[0];
      const updatedFormFields = Object.assign({}, formFields, {
        title: {
          ...formFields.title,
          value: draftNote?.title || '',
        },
        description: {
          ...formFields.description,
          value: draftNote?.description || '',
        },
      });

      if (draftNote?.completionDate) {
        setCompletionDate(dayjs(draftNote.completionDate));
      }

      setPlanColor(draftNote.color);
      setStatus(draftNote.status_name);
      setLocation(draftNote.location);
      setFormFields(updatedFormFields);
    } else {
      setFormFields(ADD_NOTES_FORM_FIELDS);
      setStatus(STATUS_OPTIONS[0].label);
      setPlanColor('#f7f7f7');
    }
  }, [noteID]);

  return (
    <Stack spacing="1rem">
      <Stack direction="row" spacing="1rem" alignItems="center" flexGrow="1">
        {Object.values(formFields)
          .slice(0, 1)
          .map((v, index) => (
            <TextField
              key={index}
              id={v.name}
              name={v.name}
              label={v.label}
              value={v.value}
              placeholder={v.placeholder}
              onChange={handleInput}
              required={v.required}
              fullWidth={v.fullWidth}
              error={!!v.errorMsg}
              helperText={v.errorMsg}
              variant={v.variant}
              minRows={v.rows || 4}
              multiline={v.multiline || false}
            />
          ))}
        <RetrieveUserLocation setLocation={setLocation} />
      </Stack>
      <Stack
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {Object.values(formFields)
          .slice(1)
          .map((v, index) => (
            <TextField
              key={index}
              id={v.name}
              name={v.name}
              label={v.label}
              value={v.value}
              placeholder={v.placeholder}
              onChange={handleInput}
              required={v.required}
              fullWidth={v.fullWidth}
              error={!!v.errorMsg}
              helperText={v.errorMsg}
              variant={v.variant}
              minRows={v.rows || 4}
              multiline={v.multiline || false}
            />
          ))}
      </Stack>
      <FormControl fullWidth>
        <InputLabel id="status-selector-label">Selected status</InputLabel>
        <Select
          labelId="status-selector-labelId"
          id="status-selector"
          value={status}
          name={'status'}
          onChange={handleStatus}
          variant="standard"
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.id} value={option.label}>
              {option.display}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <ColorPicker value={planColor} handleChange={handleColorChange} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={'Estimated completion date'}
          disablePast
          value={completionDate}
          onChange={setCompletionDate}
        />
      </LocalizationProvider>
      {location.lat ? (
        <LocationPicker subtitle="Select location" location={location} onLocationChange={setLocation} editMode={true} />
      ) : null}
      <Button
        onClick={submit}
        startIcon={noteID ? <CheckCircleRounded /> : <AddRounded />}
        sx={{ alignSelf: 'flex-start' }}
      >
        {noteID ? 'Save' : 'Add'}
      </Button>
    </Stack>
  );
};

export default AddNote;
