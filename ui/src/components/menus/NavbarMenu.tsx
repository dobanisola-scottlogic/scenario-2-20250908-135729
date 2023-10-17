import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Logout from '@mui/icons-material/Logout';
import { Button, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout, selectTeamName } from '../../slices/authSlice';

function NavbarMenu() {
  const dispatch = useAppDispatch();
  const teamName = useAppSelector(selectTeamName);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id='menu-button'
        aria-controls={open ? 'dropdown-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {teamName}
      </Button>
      <Menu
        elevation={1}
        id='dropdown-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // align bottom right of anchor element with top right of menu
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        MenuListProps={{
          'aria-labelledby': 'menu-button',
        }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default NavbarMenu;
