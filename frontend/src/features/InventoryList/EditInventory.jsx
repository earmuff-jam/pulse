import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  createFilterOptions,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BookmarkAddedRounded,
  CheckRounded,
  CloseRounded,
  NoteAddRounded,
  SwapHorizRounded,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { BLANK_INVENTORY_FORM } from './constants';
import RowHeader from '../../utils/RowHeader';
import { useDispatch, useSelector } from 'react-redux';
import { inventoryActions } from './inventorySlice';
import { enqueueSnackbar } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ImagePicker from '../../common/ImagePicker/ImagePicker';

const filter = createFilterOptions();
dayjs.extend(relativeTime);

const EditInventory = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading: storageLocationsLoading,
    storageLocations: options,
    inventory,
    loading,
  } = useSelector((state) => state.inventory);

  const [openReturnNote, setOpenReturnNotes] = useState(false);
  const [returnDateTime, setReturnDateTime] = useState(null);
  const [storageLocation, setStorageLocation] = useState({});
  const [formData, setFormData] = useState({ ...BLANK_INVENTORY_FORM });

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    const updatedFormData = { ...formData };
    let errorMsg = '';

    for (const validator of updatedFormData[id].validators) {
      if (validator.validate(value)) {
        errorMsg = validator.message;
        break;
      }
    }

    updatedFormData[id] = {
      ...updatedFormData[id],
      value,
      errorMsg,
    };
    setFormData(updatedFormData);
  };

  const handleCheckbox = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: { ...prevFormData[name], value },
    }));
  };

  const isFormDisabled = () => {
    const containsErr = Object.values(formData).reduce((acc, el) => {
      if (el?.errorMsg) {
        return true;
      }
      return acc;
    }, false);

    const requiredFormFields = Object.values(formData).filter((v) => v?.isRequired);
    const isRequiredFieldsEmpty = requiredFormFields
      .filter((el) => el.type === 'text')
      .some((el) => el.value.trim() === '');

    return containsErr || isRequiredFieldsEmpty || storageLocation === null || Object.keys(storageLocation).length <= 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isFormDisabled()) {
      enqueueSnackbar('Unable to update inventory details.', {
        variant: 'error',
      });
      return;
    }

    const formattedData = Object.values(formData).reduce((acc, el) => {
      if (el.value) {
        acc[el.id] = el.value;
      }
      return acc;
    }, {});

    const draftRequest = {
      id: id, // bring id from the params
      ...formattedData,
      return_datetime: returnDateTime !== null ? returnDateTime.toISOString() : null,
      location: storageLocation.location,
    };
    dispatch(inventoryActions.updateInventory(draftRequest));
    navigate('/inventories/list');
  };

  const handleUpload = (id, imgFormData) => {
    console.debug(id, imgFormData);
  };

  useEffect(() => {
    if (id.length > 0) {
      dispatch(inventoryActions.getInvByID(id));
    }
  }, [id]);

  useEffect(() => {
    if (!loading || !storageLocationsLoading) {
      const selectedAsset = { ...BLANK_INVENTORY_FORM };
      selectedAsset.name.value = inventory.name || '';
      selectedAsset.description.value = inventory.description || '';
      selectedAsset.barcode.value = inventory.barcode || '';
      selectedAsset.sku.value = inventory.sku || '';
      selectedAsset.bought_at.value = inventory.bought_at || '';
      selectedAsset.return_location.value = inventory.return_location || '';
      selectedAsset.max_weight.value = inventory.max_weight || '';
      selectedAsset.min_weight.value = inventory.min_weight || '';
      selectedAsset.max_height.value = inventory.max_height || '';
      selectedAsset.min_height.value = inventory.min_height || '';
      selectedAsset.price.value = inventory.price || '';
      selectedAsset.quantity.value = inventory.quantity || '';
      selectedAsset.is_bookmarked.value = inventory.is_bookmarked || false;
      selectedAsset.is_returnable.value = inventory.is_returnable || Boolean(inventory.return_location) || false;
      selectedAsset.created_by.value = inventory.created_by || '';
      selectedAsset.created_at.value = inventory.created_at || '';
      selectedAsset.updated_by.value = inventory.updated_by || '';
      selectedAsset.updated_at.value = inventory.updated_at || '';
      selectedAsset.sharable_groups.value = inventory.sharable_groups || [];
      selectedAsset.creator_name = inventory.creator_name;
      selectedAsset.updator_name = inventory.updater_name;

      if (inventory?.return_datetime) {
        setReturnDateTime(dayjs(inventory.return_datetime));
      }

      if (inventory?.return_notes) {
        setOpenReturnNotes(true);
        selectedAsset.return_notes.value = inventory.return_notes;
      }

      setStorageLocation({ location: inventory.location });
      setFormData(selectedAsset);
    }
  }, [loading, inventory]);

  return (
    <>
      <RowHeader title="Editing inventory" caption={`Editing ${formData.name.value}`} />
      <Stack spacing={2} marginTop={'1rem'}>
        <Stack direction="row" spacing={2}>
          <ImagePicker id={id} handleUpload={handleUpload} />
          <Stack direction="column" spacing={2} flexGrow={1}>
            {Object.values(formData)
              .filter((v, index) => index < 2)
              .map((v) => (
                <TextField
                  key={v.id}
                  id={v.id}
                  label={v.label}
                  value={v.value}
                  required={v.isRequired}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  error={!!v.errorMsg}
                  helperText={v.errorMsg}
                  multiline={v.id === 'description'}
                  rows={v.id === 'description' ? 4 : null}
                />
              ))}
          </Stack>
        </Stack>
        <Stack direction="row" spacing={2}>
          {Object.values(formData)
            .filter((v, index) => index >= 2 && index < 5)
            .map((v) => (
              <TextField
                key={v.id}
                id={v.id}
                label={v.label}
                value={v.value}
                required={v.isRequired}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                size="small"
                error={!!v.errorMsg}
                helperText={v.errorMsg}
              />
            ))}
        </Stack>

        <Stack direction="row" spacing={2}>
          {/* Ignore autocomplete for its own row */}
          {Object.values(formData)
            .filter((v, index) => index >= 5 && index < 7)
            .map((v) => (
              <TextField
                key={v.id}
                id={v.id}
                label={v.label}
                value={v.value}
                required={v.isRequired}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                size="small"
                error={!!v.errorMsg}
                helperText={v.errorMsg}
              />
            ))}
        </Stack>

        <Autocomplete
          fullWidth
          freeSolo
          forcePopupIcon
          value={storageLocation || ''}
          onOpen={() => dispatch(inventoryActions.getStorageLocations())}
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              setStorageLocation({
                location: newValue,
              });
            } else if (newValue && newValue.inputValue) {
              setStorageLocation({
                location: newValue.inputValue,
              });
            } else {
              setStorageLocation(newValue);
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some((option) => inputValue === option.location);
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                location: `Add "${inputValue}"`,
              });
            }

            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="autocomplete-storage-location"
          options={options || []}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.location || '';
          }}
          renderOption={(props, option) => (
            <li {...props} key={option.location}>
              {option.location}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label="Storage Location"
              variant="standard"
              placeholder="Where do you plan to store this item"
            />
          )}
        />
        <Divider>
          <Typography variant="caption">More information</Typography>
        </Divider>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_bookmarked.value}
                onChange={(e) => handleCheckbox('is_bookmarked', e.target.checked)}
                color="primary"
              />
            }
            label={
              <Stack direction="row" alignItems="center">
                <BookmarkAddedRounded color={formData.is_bookmarked.value ? 'primary' : 'secondary'} />
                <Typography variant="caption">Bookmarked</Typography>
              </Stack>
            }
          />
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_returnable.value}
                onChange={(e) => handleCheckbox('is_returnable', e.target.checked)}
                color="primary"
              />
            }
            label={
              <Stack direction="row" alignItems="center">
                <SwapHorizRounded color={formData.is_returnable.value ? 'primary' : 'secondary'} />
                <Typography variant="caption">Returnable</Typography>
              </Stack>
            }
          />
          {formData.is_returnable.value && (
            <Stack
              direction="column"
              spacing={2}
              justifyContent="space-between"
              border={`0.1rem solid black`}
              padding="1rem"
            >
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">Return Information</Typography>
                {!openReturnNote ? (
                  <Tooltip title="Add note">
                    <IconButton size="small" onClick={() => setOpenReturnNotes(!openReturnNote)}>
                      <NoteAddRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Close note">
                    <IconButton size="small" onClick={() => setOpenReturnNotes(!openReturnNote)}>
                      <CloseRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
              {Object.values(formData)
                .filter((v, index) => index === 10)
                .map((v) => (
                  <TextField
                    key={v.id}
                    id={v.id}
                    label={v.label}
                    value={v.value}
                    required={v.isRequired}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    error={!!v.errorMsg}
                    helperText={v.errorMsg}
                  />
                ))}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  id="return_datetime"
                  label="Return datetime"
                  disablePast
                  value={returnDateTime}
                  onChange={setReturnDateTime}
                  slotProps={{
                    textField: {
                      helperText: 'Estimated return date time',
                      size: 'small',
                    },
                  }}
                />
              </LocalizationProvider>
              {openReturnNote && (
                <>
                  {Object.values(formData)
                    .filter((v, index) => index === 15)
                    .map((v) => (
                      <TextField
                        key={v.id}
                        id={v.id}
                        label={v.label}
                        value={v.value}
                        required={v.isRequired}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="small"
                        error={!!v.errorMsg}
                        helperText={v.errorMsg}
                        multiline
                        rows={4}
                      />
                    ))}
                </>
              )}
            </Stack>
          )}
        </Stack>
        <Divider>
          <Typography variant="caption">Weight and Dimension</Typography>
        </Divider>
        <Stack direction="row" spacing={2}>
          {Object.values(formData)
            .filter((v, index) => index >= 11 && index < 13)
            .map((v) => (
              <TextField
                key={v.id}
                id={v.id}
                label={v.label}
                value={v.value}
                required={v.isRequired}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                size="small"
                error={!!v.errorMsg}
                helperText={v.errorMsg}
              />
            ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          {Object.values(formData)
            .filter((v, index) => index >= 13 && index < 15)
            .map((v) => (
              <TextField
                key={v.id}
                id={v.id}
                label={v.label}
                value={v.value}
                required={v.isRequired}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                size="small"
                error={!!v.errorMsg}
                helperText={v.errorMsg}
              />
            ))}
        </Stack>
      </Stack>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button startIcon={<CheckRounded fontSize="small" />} onClick={handleSubmit} disabled={isFormDisabled()}>
          Submit
        </Button>
      </Box>
    </>
  );
};

export default EditInventory;
