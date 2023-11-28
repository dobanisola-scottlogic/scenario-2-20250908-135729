import { RefreshOutlined } from '@mui/icons-material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import LinkOffOutlinedIcon from '@mui/icons-material/LinkOffOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useState } from 'react';
import {
  useConnectBotMutation,
  useDisconnectBotMutation,
  useGetBotConnectionStatusQuery,
  useGetHackathonForTeamUserQuery,
} from '~/api/api';
import AddButton from '~/components/common/AddButton';
import { CommonContainer } from '~/components/common/CommonContainer';
import { commonStyles } from '~/components/commonStyles';
import ViewInformation from '~/components/popups/ViewInformation';
import { BotConnectionStatus } from '~/enums/BotConnectionStatus';
import { ContainerRole } from '~/enums/ContainerRole';
import { useAppSelector } from '~/hooks';
import { selectTeamName } from '~/slices/authSlice';
import { colours } from '~/theme';

const Team = () => {
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const {
    data: hackathon,
    isLoading: isHackathonLoading,
    isError: isHackathonError,
  } = useGetHackathonForTeamUserQuery();

  const teamName = useAppSelector(selectTeamName);

  const [isViewInformationOpen, setIsViewInformationOpen] = useState(false);
  const handleIsViewInformationOpen = () => setIsViewInformationOpen(true);

  const [connectBot] = useConnectBotMutation();
  const [disconnectBot] = useDisconnectBotMutation();

  const {
    data: botConnectionStatus,
    refetch: refetchBotConnectionStatus,
    isLoading: isBotConnectionStatusLoading,
    isFetching: isBotConnectionStatusFetching,
  } = useGetBotConnectionStatusQuery(teamName ?? skipToken);

  let botConnectionStatusMetadata: BotConnectionStatusMetadata =
    new BotConnectionStatusMetadata(botConnectionStatus);

  const handleRefreshBotStatusClick = () => {
    if (isBotConnectionStatusLoading || isBotConnectionStatusFetching) {
      setFormError('Waiting for response from bot...');
    } else {
      refetchBotConnectionStatus()
        .unwrap()
        .then((status) => {
          botConnectionStatusMetadata = new BotConnectionStatusMetadata(status);
        })
        .catch((error) => {
          setFormError(`Error retrieving bot status: ${error}`);
        });
    }
  };

  const handleConnectBotClick = () => {
    if (
      botConnectionStatusMetadata.botConnectionStatus ===
      BotConnectionStatus.Connected
    ) {
      disconnectBot(teamName!)
        .unwrap()
        .catch((error) => {
          setFormError(`Error disconnecting bot: ${error}`);
        });
    } else {
      connectBot(teamName!)
        .unwrap()
        .then(() => {
          handleRefreshBotStatusClick();
        })
        .catch((error) => {
          setFormError(`Error connecting bot: ${error}`);
        });
    }
    handleRefreshBotStatusClick();
  };

  return (
    <>
      <CommonContainer containerRole={ContainerRole.DASHBOARD}>
        {formError && (
          <Alert severity='error' sx={commonStyles.alertStyle}>
            {formError}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 'normal' }}>
              <strong>Current Milestone: </strong>
              {isHackathonLoading && (
                <CircularProgress size={15} sx={{ ml: 1 }} />
              )}
              {isHackathonError && (
                <span style={{ color: colours.errorRed }}>
                  Failed to fetch current milestone.
                </span>
              )}
              {!isHackathonLoading &&
                !isHackathonError &&
                `Map: ${hackathon?.currentMilestoneMap} - Bot: ${hackathon?.readableCurrentMilestoneClassName}`}
            </Typography>
          </Grid>

          <Grid item xs={9}>
            <Typography sx={{ fontWeight: 'normal' }}>
              To view the information needed to access your development
              environment, click here:
            </Typography>
          </Grid>

          <Grid item xs={3}>
            <Button
              variant='outlined'
              onClick={handleIsViewInformationOpen}
              startIcon={<VisibilityOutlinedIcon />}
              sx={{ ml: 2 }}
              fullWidth
            >
              View information
            </Button>
          </Grid>

          <Grid item xs={9}>
            <Typography sx={{ fontWeight: 'normal' }}>
              The connection status of your bot is:
              <Typography component='span' sx={{ fontWeight: 'normal', ml: 2 }}>
                {!isBotConnectionStatusLoading &&
                  botConnectionStatusMetadata.connectionStatusText}
              </Typography>
            </Typography>
          </Grid>

          <Grid item xs={3}>
            <Button
              variant='outlined'
              onClick={handleRefreshBotStatusClick}
              startIcon={<RefreshOutlined />}
              sx={{ ml: 2 }}
              fullWidth
            >
              Refresh
            </Button>
          </Grid>

          <Grid item xs={9}>
            <Typography sx={{ fontWeight: 'normal' }}>
              To connect your bot, click on the connect button and then start
              your bot:
            </Typography>
          </Grid>

          <Grid item xs={3}>
            <Button
              variant='outlined'
              onClick={handleConnectBotClick}
              startIcon={botConnectionStatusMetadata.icon}
              sx={{ ml: 2 }}
              data-testid='connectButton'
              fullWidth
            >
              {!isBotConnectionStatusLoading &&
                botConnectionStatusMetadata.connectButtonLabel}
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mb: 3, mt: 4 }}>
          <AddButton
            disabled={
              !isBotConnectionStatusLoading &&
              !botConnectionStatusMetadata.isAddNewGameEnabled
            }
            onClick={() => {
              alert('Feature not yet implemented');
            }}
            text='Add a new game'
          />
        </Box>
        <Box
          sx={{
            background: 'white',
            height: '60vh',
            borderRadius: '9px',
          }}
        >
          Placeholder for games table
        </Box>
      </CommonContainer>
      <ViewInformation
        isOpen={isViewInformationOpen}
        setIsOpen={setIsViewInformationOpen}
      />
    </>
  );
};

class BotConnectionStatusMetadata {
  constructor(status: string | undefined) {
    switch (status) {
      case BotConnectionStatus.Connected:
        this.botConnectionStatus = BotConnectionStatus.Connected;
        this.connectButtonLabel = 'Disconnect';
        this.connectionStatusText = 'Connected';
        this.icon = <LinkOffOutlinedIcon />;
        this.isAddNewGameEnabled = true;
        break;

      case BotConnectionStatus.Waiting:
        this.botConnectionStatus = BotConnectionStatus.Waiting;
        this.connectButtonLabel = 'Cancel';
        this.connectionStatusText = 'Waiting for you to start your bot';
        this.icon = <CancelOutlinedIcon />;
        this.isAddNewGameEnabled = false;
        break;

      case BotConnectionStatus.Disconnected:
      default:
        this.botConnectionStatus = BotConnectionStatus.Disconnected;
        this.connectButtonLabel = 'Connect';
        this.connectionStatusText = 'Disconnected';
        this.icon = <LinkOutlinedIcon />;
        this.isAddNewGameEnabled = false;
        break;
    }
  }

  public readonly botConnectionStatus: BotConnectionStatus;
  public readonly connectButtonLabel: string;
  public readonly connectionStatusText: string;
  public readonly icon: JSX.Element;
  public readonly isAddNewGameEnabled: boolean;
}

export default Team;
