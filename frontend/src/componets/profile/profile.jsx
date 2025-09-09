import React, { useEffect, useState } from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Button } from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import UploadPost from '../post/UploadPost';
import ProfileModel from './profileModel';
import { useDispatch, useSelector} from "react-redux";
import { findUserById, followUserAction } from '../../Store/Auth/Action';

const Profile = () => {
    const [tabValue,setTabValue] = useState("1");
    const navigate = useNavigate();
    const handleBack = () => navigate(-1);
    const [openProfileModal,setOpenProfileModal] = useState(false);
    const handleOpenProfile = () => setOpenProfileModal(true);
    const handleClose = () => setOpenProfileModal(false);
    const {auth} = useSelector(store=>store);
    const dispatch = useDispatch();
    const {id} = useParams();

    const handleflollowUser = () => {
        dispatch(followUserAction(id))
        console.log("follow user")
    }
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    useEffect(()=>{
        dispatch(findUserById(id))
    },[dispatch, id])
    
    return (
        <div className='min-h-screen dark:bg-gray-900'>
            <section className='sticky top-0 z-50 bg-white dark:bg-gray-900 bg-opacity-95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800'>
                <div className='flex items-center px-4 py-3 space-x-4'>
                    <KeyboardBackspaceIcon className='cursor-pointer dark:text-white' onClick={handleBack}/>
                    <div>
                        <h1 className='text-xl font-bold dark:text-white'>{auth.findUser?.fullName}</h1>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>Posts</p>
                    </div>
                </div>
            </section>

            <section>
                <div className='h-[200px] relative bg-gray-100 dark:bg-gray-800'>
                    <img 
                        className='w-full h-full object-cover'
                        src={auth.findUser?.backgroundImage}
                        alt=""
                    />
                </div>
            </section>

            <section className='px-6'>
                <div className='flex justify-between items-start relative'>
                    <Avatar 
                        className='transform -translate-y-1/2 border-4 border-white dark:border-gray-800'
                        alt='Test name' 
                        src={auth.findUser?.profilepic}
                        sx={{width:"120px", height:"120px"}}
                    />
                    <div className=''>
                    {auth.findUser?.req_user ? (
                        <Button 
                            variant='contained' 
                            sx={{
                                borderRadius: "20px",
                                marginTop: 2,
                                bgcolor: "#1e88e5",
                                '&:hover': {
                                    bgcolor: "#1976d2"
                                }
                            }}
                            onClick={handleOpenProfile}
                        >
                            Edit profile
                        </Button>
                    ) : (
                        <Button 
                            variant='contained' 
                            sx={{
                                borderRadius: "20px",
                                marginTop: 2,
                                bgcolor: "#1e88e5",
                                '&:hover': {
                                    bgcolor: "#1976d2"
                                }
                            }}
                            onClick={handleflollowUser}
                        >
                            {auth.findUser?.followed? "Unfollow" : "Follow"}
                        </Button>
                    )}
                    </div>
                </div>
                <div>
                    <div className='flex ietms-center mt-[-40px]'>
                        <h1 className='font-bold text-xl dark:text-white'>{auth.findUser?.fullName}</h1>
                    </div>
                    <h2 className='text-gray-500 dark:text-gray-400 text-left'>{auth.findUser?.fullName.split(" ").join("_").toLowerCase()}</h2>
                </div>
                <div className='mt-4 space-y-4'>
                    <p className="text-left dark:text-white">{auth.findUser?.bio}</p>

                    <div className='flex space-x-6'>
                        <div className='flex items-center text-gray-500 dark:text-gray-400 space-x-1'>
                            <CakeIcon fontSize="small"/>
                            <span>{auth.findUser?.birthday}</span>
                        </div>
                        <div className='flex items-center text-gray-500 dark:text-gray-400 space-x-1'>
                            <LocationOnIcon fontSize="small"/>
                            <span>{auth.findUser?.location}</span>
                        </div>
                    </div>

                    <div className='flex space-x-6'>
                        <div className='flex items-center space-x-1'>
                            <span className='font-semibold dark:text-white'>{auth.findUser?.followings?.length}</span>
                            <span className='text-gray-500 dark:text-gray-400'>Following</span>
                        </div>
                        <div className='flex items-center space-x-1'>
                            <span className='font-semibold dark:text-white'>{auth.findUser?.followers?.length}</span>
                            <span className='text-gray-500 dark:text-gray-400'>Followers</span>
                        </div>
                    </div>
                </div>
            </section>
      
            <section className='mt-4 border-b border-gray-100 dark:border-gray-800'>
                <Box sx={{ width: '100%' }}>
                    <TabContext value={tabValue}>
                        <Box>
                            <TabList 
                                onChange={handleTabChange} 
                                aria-label="profile tabs"
                                variant="fullWidth"
                                sx={{
                                    '& .MuiTab-root': {
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        color: 'rgb(83, 100, 113)',
                                        '&.Mui-selected': {
                                            color: 'rgb(15, 20, 25)',
                                        },
                                        '@media (prefers-color-scheme: dark)': {
                                            color: 'rgb(156, 163, 175)',
                                            '&.Mui-selected': {
                                                color: 'rgb(255, 255, 255)',
                                            }
                                        }
                                    },
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: 'rgb(29, 155, 240)',
                                        height: '4px',
                                        borderRadius: '2px'
                                    }
                                }}
                            >
                                <Tab label="Posts" value="1" />
                            </TabList>
                        </Box>
                        <TabPanel value="1" sx={{ px: 3 }}>
                            <UploadPost/>
                        </TabPanel>
                    </TabContext>
                </Box>
            </section>

            <ProfileModel handleClose={handleClose} open={openProfileModal}/>
        </div>
    )
}

export default Profile