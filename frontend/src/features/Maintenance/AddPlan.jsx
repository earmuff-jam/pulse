import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { BLANK_MAINTENANCE_PLAN, ITEM_TYPE_MAPPER } from './constants';
import ColorPicker from '../../utils/ColorPicker';
import { enqueueSnackbar } from 'notistack';
import dayjs from 'dayjs';
import { maintenancePlanActions } from './maintenanceSlice';
import { useDispatch, useSelector } from 'react-redux';
import RetrieveUserLocation from '../../common/Location/RetrieveUserLocation';
import LocationPicker from '../../common/Location/LocationPicker';
import { produce } from 'immer';

const AddPlan = ({
  handleCloseAddNewPlan,
  maintenancePlan,
  selectedMaintenancePlanID,
  setSelectedMaintenancePlanID,
}) => {
  const dispatch = useDispatch();
  const { statusOptions, loading } = useSelector((state) => state.maintenance);

  const [selectedStatusOption, setSelectedStatusOption] = useState('');
  const [planColor, setPlanColor] = useState('#f7f7f7');
  const [location, setLocation] = useState();
  const [planType, setPlanType] = useState(ITEM_TYPE_MAPPER['daily'].value);
  const [formData, setFormData] = useState({
    ...BLANK_MAINTENANCE_PLAN,
  });

  const handleColorChange = (newValue) => {
    setPlanColor(newValue);
  };

  const handleInputChange = (ev) => {
    const { id, value } = ev.target;
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

  const resetData = () => {
    setFormData({ ...BLANK_MAINTENANCE_PLAN });
    setPlanType(ITEM_TYPE_MAPPER['daily'].value); // annual
    setPlanColor('#f7f7f7');
    handleCloseAddNewPlan();
    setSelectedStatusOption({});
    setSelectedMaintenancePlanID('');
  };

  const handlePlanChange = (ev) => {
    setPlanType(ev.target.value);
  };

  const handleSubmit = () => {
    const containsErr = Object.values(formData).reduce((acc, el) => {
      if (el.errorMsg) {
        return true;
      }
      return acc;
    }, false);

    const requiredFormFields = Object.values(formData).filter((v) => v.required);
    const isRequiredFieldsEmpty = requiredFormFields.some((el) => {
      if (['min_items_limit', 'max_items_limit'].includes(el.name)) {
        return el.value < 0;
      }
      return el.value.trim() === '';
    });

    if (containsErr || isRequiredFieldsEmpty || selectedStatusOption == null) {
      enqueueSnackbar('Cannot add new maintenance plan.', {
        variant: 'error',
      });
      return;
    }

    const formattedData = Object.values(formData).reduce((acc, el) => {
      if (['min_items_limit', 'max_items_limit'].includes(el.name)) {
        acc[el.name] = parseFloat(el.value);
      } else if (el.value) {
        acc[el.name] = el.value;
      }
      return acc;
    }, {});

    // seperated to prevent updating sharable groups
    if (selectedMaintenancePlanID) {
      const currentMaintenancePlan = maintenancePlan.find((v) => v.id === selectedMaintenancePlanID);
      const draftRequest = {
        id: selectedMaintenancePlanID,
        ...currentMaintenancePlan,
        ...formattedData,
        type: planType,
        color: planColor,
        location: location,
        plan_type: ITEM_TYPE_MAPPER[planType].value,
        plan_due: ITEM_TYPE_MAPPER[planType].since,
        maintenance_status: selectedStatusOption?.name,
        updated_on: dayjs().toISOString(),
      };
      dispatch(maintenancePlanActions.updatePlan(draftRequest));
    } else {
      const draftRequest = {
        ...formattedData,
        type: planType,
        color: planColor,
        plan_type: planType,
        plan_due: ITEM_TYPE_MAPPER[planType].since,
        location: location,
        maintenance_status: selectedStatusOption?.name,
        created_on: dayjs().toISOString(),
      };
      dispatch(maintenancePlanActions.createPlan(draftRequest));
    }
    resetData();
  };

  const isDisabled = () => {
    const containsErr = Object.values(formData).reduce((acc, el) => {
      if (el.errorMsg) {
        return true;
      }
      return acc;
    }, false);

    const requiredFormFields = Object.values(formData).filter((v) => v.required);
    const isRequiredFieldsEmpty = requiredFormFields.some((el) => {
      if (['min_items_limit', 'max_items_limit'].includes(el.name)) {
        return el.value < 0;
      }
      return el.value.trim() === '';
    });

    return containsErr || isRequiredFieldsEmpty;
  };

  useEffect(() => {
    if (!loading && selectedMaintenancePlanID !== null) {
      const draftMaintenancePlan = maintenancePlan.filter((v) => v.id === selectedMaintenancePlanID).find(() => true);
      setFormData(
        produce(formData, (draft) => {
          draft.name.value = draftMaintenancePlan?.name || '';
          draft.description.value = draftMaintenancePlan?.description || '';
          draft.max_items_limit.value = draftMaintenancePlan?.max_items_limit || '';
          draft.min_items_limit.value = draftMaintenancePlan?.min_items_limit || '';
        })
      );
      setSelectedStatusOption({
        id: draftMaintenancePlan?.maintenance_status,
        name: draftMaintenancePlan?.maintenance_status_name,
        description: draftMaintenancePlan?.maintenance_status_description,
      });

      const currentPlanType = Object.values(ITEM_TYPE_MAPPER).find((v) => v.value === draftMaintenancePlan?.plan_type);
      setPlanType(currentPlanType?.value || '');
      setLocation(draftMaintenancePlan?.location);
      setPlanColor(draftMaintenancePlan?.color);
    } else {
      resetData();
    }
  }, [selectedMaintenancePlanID]);

  return (
    <Stack>
      <Stack paddingBottom="2rem">
        <Typography> Fill in the necessary details</Typography>
        <Typography variant="caption">
          Take steps to periodically check on your inventory items to ensure they are upto date.
        </Typography>
      </Stack>
      <Stack alignItems="center">
        <Box component="form" sx={{ maxWidth: 600, width: '100%' }}>
          <Stack spacing={2} useFlexGap>
            <Stack direction="row">
              <TextField
                id="name"
                label="Plan Title"
                value={formData.name.value}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                size="small"
                error={Boolean(formData.name['errorMsg'].length)}
                helperText={formData.name['errorMsg']}
              />
              <RetrieveUserLocation setLocation={setLocation} />
            </Stack>
            <Stack direction="row" spacing="1rem">
              <TextField
                id="description"
                label="Plan description"
                placeholder="Description of plan in less than 500 words"
                value={formData.description.value}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                size="small"
                multiline
                maxRows={4}
                rows={4}
                error={Boolean(formData.description['errorMsg'].length)}
                helperText={formData.description['errorMsg']}
              />
            </Stack>
            <Stack direction="row" spacing="1rem">
              {Object.values(formData)
                .slice(2, 4)
                .map((v, index) => (
                  <TextField
                    key={index}
                    id={v.name}
                    name={v.name}
                    label={v.label}
                    value={v.value}
                    placeholder={v.placeholder}
                    onChange={handleInputChange}
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
            <Autocomplete
              id="status-options"
              isOptionEqualToValue={(option, value) => option.name === value.name}
              getOptionLabel={(option) => option.name || ''}
              options={statusOptions}
              loading={loading}
              value={selectedStatusOption}
              onOpen={() => dispatch(maintenancePlanActions.getStatusOptions())}
              onChange={(_, newValue) => setSelectedStatusOption(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Overall item status"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            <ColorPicker value={planColor} handleChange={handleColorChange} />
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="simple-select-label">Maintenance plan *</InputLabel>
                <Select
                  labelId="simple-select-label"
                  id="simple-select"
                  variant="standard"
                  value={planType}
                  label="Plan type"
                  onChange={handlePlanChange}
                >
                  {Object.values(ITEM_TYPE_MAPPER).map((v, index) => (
                    <MenuItem key={index} value={v.value}>
                      {v.display}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>
          {location?.lat ? (
            <LocationPicker
              subtitle="Assigned Location"
              location={location}
              onLocationChange={setLocation}
              editMode={true}
            />
          ) : null}
          <Button onClick={handleSubmit} variant="outlined" sx={{ mt: 1 }} disabled={isDisabled()}>
            {selectedMaintenancePlanID ? 'Update' : 'Add'}
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default AddPlan;
