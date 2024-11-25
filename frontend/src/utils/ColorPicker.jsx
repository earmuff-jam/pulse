import { MuiColorInput } from 'mui-color-input';

const ColorPicker = ({ value, handleChange }) => {
  return <MuiColorInput fullWidth format="hex" value={value} onChange={handleChange} label="Assign Color" />;
};

export default ColorPicker;
