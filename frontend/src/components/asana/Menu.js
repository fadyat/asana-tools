import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {Link} from "react-router-dom";

const options = [
    <Link to="/"
          style={{textDecoration: 'none', color: 'black'}}
    >Home</Link>,
    <Link to="/mass_tasks"
          style={{textDecoration: 'none', color: 'black'}}
    >Mass tasks</Link>,
    <Link to="/contractor"
          style={{textDecoration: 'none', color: 'black'}}
    >Contractor report</Link>
];

const ITEM_HEIGHT = 48;

export default function AsanaMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon style={{color: 'white'}}/>
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{'aria-labelledby': 'long-button'}}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option.key}
                        onClick={handleClose}
                    >
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

