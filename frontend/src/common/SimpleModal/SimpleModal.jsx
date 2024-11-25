import { Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { CloseRounded, DownloadRounded } from '@mui/icons-material';

const SimpleModal = (props) => {
  const { title, subtitle, handleClose, maxSize, showExport = false, handleExport = () => {}, children } = props;

  return (
    <Dialog open={true} onClose={handleClose} maxWidth={maxSize ?? 'xl'} fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack>
            {title}
            {subtitle ? <Typography variant="caption">{subtitle}</Typography> : null}
          </Stack>
          <Stack direction="row" alignItems="center">
            {showExport && (
              <Button endIcon={<DownloadRounded />} onClick={handleExport}>
                Export
              </Button>
            )}
            <IconButton aria-label="close" onClick={handleClose} color="error">
              <CloseRounded />
            </IconButton>
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent dividers sx={{ maxHeight: '40rem', overflow: 'auto' }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default SimpleModal;
