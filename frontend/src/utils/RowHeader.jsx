import { Box, Button, Link, Stack, Typography } from '@mui/material';

const RowHeader = ({
  title,
  titleVariant = 'h4',
  caption,
  showRedirectLink,
  redirectTo,
  primaryButtonTextLabel,
  primaryButtonDisabled,
  primaryStartIcon,
  secondaryButtonTextLabel,
  secondaryStartIcon,
  handleClickPrimaryButton,
  handleClickSecondaryButton,
  children,
}) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Stack>
        <Typography variant={titleVariant} component="h2">
          {title}
        </Typography>
        {caption ? (
          showRedirectLink ? (
            <Link href={redirectTo}>
              <Typography variant="caption">{caption}</Typography>
            </Link>
          ) : (
            <Typography variant="caption">{caption}</Typography>
          )
        ) : null}
      </Stack>
      <Stack direction="row" spacing={2} useFlexGap>
        {primaryButtonTextLabel ? (
          <Button
            color="primary"
            variant="outlined"
            disabled={primaryButtonDisabled}
            onClick={handleClickPrimaryButton}
            startIcon={primaryStartIcon}
          >
            {primaryButtonTextLabel}
          </Button>
        ) : null}
        {secondaryButtonTextLabel ? (
          <Button
            color="primary"
            variant="outlined"
            onClick={handleClickSecondaryButton}
            startIcon={secondaryStartIcon}
          >
            {secondaryButtonTextLabel}
          </Button>
        ) : null}
        {children}
      </Stack>
    </Box>
  );
};

export default RowHeader;
