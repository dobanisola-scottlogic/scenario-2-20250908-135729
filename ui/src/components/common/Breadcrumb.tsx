import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { BreadcrumbLevel } from '~/enums/BreadcrumbLevel';
import { Hackathon } from '~/interfaces/Hackathon';

interface BreadcrumbProps {
  breadcrumbLevel: BreadcrumbLevel | undefined;
  gameTitle?: string;
  hackathon: Hackathon | undefined;
}

const Breadcrumb = ({
  breadcrumbLevel,
  gameTitle,
  hackathon,
}: BreadcrumbProps) => {
  const hackathonDetails = hackathon && (
    <span data-testid='hackathonBreadcrumb'>
      <strong>{hackathon?.name}</strong> (<strong>Current Milestone: </strong>
      {`Map: ${hackathon?.currentMilestoneMap} - Bot: ${hackathon?.readableCurrentMilestoneClassName}`}
      )
    </span>
  );

  return (
    <>
      <Grid item xs={12}>
        <Typography
          sx={{
            display: 'inline-flex',
            fontWeight: 'normal',
          }}
        >
          <Link to={import.meta.env.BASE_URL}>Hackathons</Link>
          {hackathon && (
            <>
              <KeyboardArrowRight />
              {breadcrumbLevel === BreadcrumbLevel.HACKATHON ? (
                hackathonDetails
              ) : (
                <>
                  <Link to={`${import.meta.env.BASE_URL}${hackathon.id}`}>
                    {hackathonDetails}
                  </Link>
                  <KeyboardArrowRight />
                  <span data-testid='gameBreadcrumb'>{gameTitle}</span>
                </>
              )}
            </>
          )}
        </Typography>
      </Grid>
    </>
  );
};

export default Breadcrumb;
