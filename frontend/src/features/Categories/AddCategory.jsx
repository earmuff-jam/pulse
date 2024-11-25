import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { ADD_CATEGORY_FORM_FIELDS } from './constants';
import ColorPicker from '../../utils/ColorPicker';
import { useDispatch } from 'react-redux';
import { categoryActions } from './categoriesSlice';
import { AddRounded, CheckCircleRounded, InfoOutlined } from '@mui/icons-material';
import RetrieveUserLocation from '../../common/Location/RetrieveUserLocation';
import LocationPicker from '../../common/Location/LocationPicker';
import { STATUS_OPTIONS } from '../Notes/constants';

const AddCategory = ({ categories, loading, handleCloseAddCategory, selectedCategoryID, setSelectedCategoryID }) => {
  const dispatch = useDispatch();

  const [planColor, setPlanColor] = useState('#f7f7f7');
  const [location, setLocation] = useState();
  const [formFields, setFormFields] = useState(ADD_CATEGORY_FORM_FIELDS);
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
    const isRequiredFieldsEmpty = requiredFormFields.some((el) => {
      if (['min_items_limit', 'max_items_limit'].includes(el.name)) {
        return el.value < 0;
      }
      return el.value.trim() === '';
    });

    if (containsErr || isRequiredFieldsEmpty) {
      enqueueSnackbar('Cannot add new category.', {
        variant: 'error',
      });
      return;
    }

    const formattedData = Object.values(formFields).reduce((acc, el) => {
      if (['min_items_limit', 'max_items_limit'].includes(el.name)) {
        acc[el.name] = parseFloat(el.value);
      } else if (el.value) {
        acc[el.name] = el.value;
      }
      return acc;
    }, {});

    // seperated to prevent updating sharable groups
    if (selectedCategoryID) {
      const selectedCategory = categories.find((v) => v.id === selectedCategoryID);
      const draftCategories = {
        id: selectedCategoryID,
        ...selectedCategory,
        ...formattedData,
        color: planColor,
        status: status,
        location: location,
        updated_by: userID,
      };
      dispatch(categoryActions.updateCategory(draftCategories));
    } else {
      const draftCategories = {
        ...formattedData,
        color: planColor,
        status: status,
        location: location,
        created_by: userID,
        updated_by: userID,
        sharable_groups: [userID],
      };
      dispatch(categoryActions.createCategory(draftCategories));
    }

    setSelectedCategoryID('');
    setFormFields(ADD_CATEGORY_FORM_FIELDS);
    setPlanColor('#f7f7f7');
    handleCloseAddCategory();
    enqueueSnackbar(
      selectedCategoryID ? 'Successfully updated existing category.' : 'Successfully added new category.',
      {
        variant: 'success',
      }
    );
  };

  useEffect(() => {
    if (!loading && selectedCategoryID !== '') {
      const draftCategory = categories.filter((v) => v.id === selectedCategoryID).find(() => true);
      const updatedFormFields = Object.assign({}, formFields, {
        name: {
          ...formFields.name,
          value: draftCategory?.name || '',
        },
        description: {
          ...formFields.description,
          value: draftCategory?.description || '',
        },
        min_items_limit: {
          ...formFields.min_items_limit,
          value: draftCategory?.min_items_limit || 0,
        },
        max_items_limit: {
          ...formFields.max_items_limit,
          value: draftCategory?.max_items_limit || 10,
        },
      });
      setFormFields(updatedFormFields);
      setLocation(draftCategory.location);
      setPlanColor(draftCategory.color);
      setStatus(draftCategory.status_name);
    } else {
      setFormFields(ADD_CATEGORY_FORM_FIELDS);
      setPlanColor('#f7f7f7');
      setStatus(STATUS_OPTIONS[0].label);
    }
  }, [selectedCategoryID]);

  return (
    <>
      <Stack>
        <Typography> Fill in the necessary details</Typography>
        <Typography variant="caption">Add new category. Assigned location are approximate values.</Typography>
      </Stack>
      <Stack alignItems="center" sx={{ mt: '1rem' }}>
        <Stack component="form" spacing="1rem" sx={{ maxWidth: 600, width: '100%' }}>
          <Stack spacing="1rem">
            <Stack direction="row">
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
                .slice(1, 2)
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
              <InputLabel id="status-selector-label">
                <Stack direction="row" spacing="1rem" alignItems="center">
                  <Typography>Overall status of items within container</Typography>
                  <Tooltip title="Overall status of items within container. May contain items with other statuses as well.">
                    <InfoOutlined fontSize="small" />
                  </Tooltip>
                </Stack>
              </InputLabel>

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
            <Stack direction="row" spacing="1rem">
              {Object.values(formFields)
                .slice(2)
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
            <ColorPicker value={planColor} handleChange={handleColorChange} />
          </Stack>
          {location?.lat ? (
            <LocationPicker
              subtitle="Assigned Location"
              location={location}
              editMode={true}
              onLocationChange={setLocation}
            />
          ) : null}
          <Button
            onClick={submit}
            startIcon={selectedCategoryID ? <CheckCircleRounded /> : <AddRounded />}
            sx={{ alignSelf: 'flex-start' }}
          >
            {selectedCategoryID ? 'Edit Category' : 'Add Category'}
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default AddCategory;
