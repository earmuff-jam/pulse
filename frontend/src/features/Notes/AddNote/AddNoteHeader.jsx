import { InputAdornment, TextField } from '@mui/material';
import RetrieveUserLocation from '../../../common/Location/RetrieveUserLocation';
import TextFieldWithLabel from '../../../common/TextFieldWithLabel/TextFieldWithLabel';

export default function AddNoteHeader({ formFields, handleInput, setLocation }) {
  return (
    <>
      <TextField
        id={formFields.title.name}
        name={formFields.title.name}
        label={formFields.title.label}
        value={formFields.title.value}
        size={formFields.title.size}
        placeholder={formFields.title.placeholder}
        onChange={handleInput}
        required={formFields.title.required}
        error={Boolean(formFields.title['errorMsg'].length)}
        helperText={formFields.title['errorMsg']}
        variant={formFields.title.variant}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <RetrieveUserLocation setLocation={setLocation} />
            </InputAdornment>
          ),
        }}
      />
      <TextFieldWithLabel
        id={formFields.description.name}
        name={formFields.description.name}
        label={formFields.description.label}
        value={formFields.description.value}
        size={formFields.title.size}
        placeholder={formFields.description.placeholder}
        onChange={handleInput}
        required={formFields.description.required}
        fullWidth={formFields.description.fullWidth}
        error={Boolean(formFields.description.errorMsg)}
        helperText={formFields.description.errorMsg}
        variant={formFields.description.variant}
        rows={formFields.description.rows || 4}
        multiline={formFields.description.multiline || false}
      />
    </>
  );
}
