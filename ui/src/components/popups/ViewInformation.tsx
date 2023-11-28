import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import CopyTextField from '~/components/common/CopyTextField';
import { commonStyles, popupStyles } from '~/components/commonStyles';
import { PopupProps } from '~/interfaces/PopupProps';

const ViewInformation = ({ isOpen, setIsOpen }: PopupProps) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Dialog
        aria-labelledby='access-information'
        onClose={handleClose}
        open={isOpen}
      >
        <DialogContent sx={popupStyles.dialogContentStyle}>
          <Typography id='access-information' sx={commonStyles.spacingStyle}>
            Access information
          </Typography>
          <Typography sx={commonStyles.spacingStyleNormal}>
            Use these details to access your development environment:
          </Typography>
          <CopyTextField label='Account ID' value='033692923448' />
          <CopyTextField label='IAM user name' value='hackathon-contestant' />
          <CopyTextField label='Password' value='Password!1' />
          <Typography sx={commonStyles.spacingStyleNormal}>
            <Link
              to={'#'}
              aria-label='This link is a placeholder and does not navigate to a functional page'
            >
              Access your development environment
            </Link>
          </Typography>
          <Box sx={popupStyles.popupBoxStyle}>
            <Button onClick={handleClose}>Close</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewInformation;
