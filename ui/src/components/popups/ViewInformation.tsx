import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetTeamInformationQuery } from '~/api/api';
import CopyTextField from '~/components/common/CopyTextField';
import { commonStyles, popupStyles } from '~/components/commonStyles';
import { PopupProps } from '~/interfaces/PopupProps';

const ViewInformation = ({ isOpen, setIsOpen }: PopupProps) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  const [teamDevEnvironmentUrl, setTeamDevEnvironmentUrl] =
    useState<string>('#');
  const [teamAccountId, setTeamAccountId] = useState<string>('');
  const [teamIamUserName, setTeamIamUserName] = useState<string>('');
  const [teamPassword, setTeamPassword] = useState<string>('');

  const {
    data: teamInformation,
    isLoading: isFetching,
    error: fetchError,
  } = useGetTeamInformationQuery();

  const isLoading = isFetching;

  useEffect(() => {
    if (isOpen) {
      setTeamDevEnvironmentUrl(teamInformation?.devEnvironment ?? '#');
      setTeamAccountId(teamInformation?.accountId ?? '');
      setTeamIamUserName(teamInformation?.userName ?? '');
      setTeamPassword(teamInformation?.password ?? '');
    }
  }, [isOpen, teamInformation]);

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
          <CopyTextField label='Account ID' value={teamAccountId} />
          <CopyTextField label='IAM user name' value={teamIamUserName} />
          <CopyTextField label='Password' value={teamPassword} />
          <Typography sx={commonStyles.spacingStyleNormal}>
            <Link to={teamDevEnvironmentUrl} aria-label={teamDevEnvironmentUrl}>
              Access your development environment
            </Link>
          </Typography>
          <Box sx={popupStyles.popupBoxStyle}>
            <Button onClick={handleClose}>Close</Button>
          </Box>

          {!isFetching && fetchError && (
            <Alert severity='error' sx={commonStyles.alertStyle}>
              Error fetching team information
            </Alert>
          )}

          {isLoading && <LinearProgress />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewInformation;
