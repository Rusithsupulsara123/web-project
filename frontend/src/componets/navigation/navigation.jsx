import React from "react";
import logo from "./Logo.png";
import { navigationMenue } from "./navigationMenu";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../Store/Auth/Action";

const Navigation = () => {
  const {auth} = useSelector(store=>store)
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("logout")
    handleClose()
    dispatch(logOut())
  }

  return (
    <div className="h-full sticky top-0 h-screen">
      <div>
        <div className="py-5">
          <img
            src={logo}
            alt="Description"
            style={{ width: "90px", height: "90px" }}
          />
        </div>

        <div className="space-y-6">
          {navigationMenue.map((item) => (
            <div
              key={item.tittle}
              className="cursor-pointer flex space-x-3 items-center dark:text-white "
              onClick={() => {
                console.log("Clicked on:", item.tittle);
                const userId = auth.user?.id;
                const route = item.dynamicPath ? item.dynamicPath(userId) : item.path;
                console.log("Navigating to:", route);
                if (route) navigate(route);
              }}
            >
              {React.cloneElement(item.icon, { className: 'dark:text-white' })}
              <p className="text-base dark:text-white">{item.tittle}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center space-x-3">
            <Avatar
              alt="username"
              src={auth.user?.profilepic}
            />
            <div>
              <p className="dark:text-white">{auth.user?.fullName}</p>
              <span className="opacity-70 dark:text-gray-300">@{auth.user?.fullName.split(" ").join("_").toLowerCase()}</span>
            </div>

            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              className="dark:text-white"
            >
              <MoreHorizIcon />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              PaperProps={{
                className: 'dark:bg-gray-800'
              }}
            >
              <MenuItem onClick={handleLogout} className="dark:text-white">Logout</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
