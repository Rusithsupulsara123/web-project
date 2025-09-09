import React, { useState } from 'react'
import Brightness6Icon from '@mui/icons-material/Brightness6';
import { Button, Modal, Box, Typography, IconButton, Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import { useTheme } from '../../config/ThemeContext';

const RightTemp = () => {
    const [openVerificationModal, setOpenVerificationModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const { darkMode, toggleDarkMode } = useTheme();

    const handleOpenVerificationModal = () => setOpenVerificationModal(true);
    const handleCloseVerificationModal = () => setOpenVerificationModal(false);
    const handleVerificationRequest = () => {
        setShowSuccessMessage(true);
        handleCloseVerificationModal();
    };

    const trendingTopics = [
        { topic: "Web Development", posts: "2.5k", category: "Technology" },
        { topic: "Data Science", posts: "1.8k", category: "Technology" },
        { topic: "UI/UX Design", posts: "1.2k", category: "Design" },
    ];

    const verificationBenefits = [
        {
            icon: <VerifiedIcon sx={{ color: "#1e88e5", fontSize: 40 }} />,
            title: "Verified Badge",
            description: "Get a verified badge on your profile to stand out"
        },
        {
            icon: <PeopleIcon sx={{ color: "#1e88e5", fontSize: 40 }} />,
            title: "Increased Visibility",
            description: "Your content will be prioritized in search results"
        },
        {
            icon: <StarIcon sx={{ color: "#1e88e5", fontSize: 40 }} />,
            title: "Premium Features",
            description: "Access to advanced analytics and content tools"
        }
    ];

    return (
        <div className='sticky top-0'>
        <div className='py-5 dark:bg-gray-900'>
            <div className='bg-white dark:bg-gray-900 sticky top-0 z-10 py-2'>
                <div className='flex justify-end'>
                    <IconButton onClick={toggleDarkMode} className='text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'>
                        <Brightness6Icon />
                    </IconButton>
                </div>
            </div>

            <section className='my-5 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mt-0'>
                <h1 className='text-xl font-bold text-center dark:text-white'>Get Verified</h1>
                <h1 className='font-bold my-2 text-gray-600 dark:text-gray-300 text-center'>Stand out in the community</h1>
                
                <div className='flex justify-center'>
                    <Button 
                        variant='contained' 
                        onClick={handleOpenVerificationModal}
                        sx={{
                            padding: "6px",
                            paddingX: "16px",
                            borderRadius: "20px",
                            bgcolor: "#1e88e5",
                            textTransform: "none",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            '&:hover': {
                                bgcolor: "#1976d2"
                            }
                        }}
                    >
                        GET VERIFIED
                    </Button>
                </div>
            </section>

            <section className='mt-7 space-y-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-4'>
                <h1 className='font-bold text-xl dark:text-white'>Trending Topics</h1>
                <div className='space-y-4'>
                    {trendingTopics.map((topic, index) => (
                        <div key={index} className='hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg cursor-pointer transition-colors duration-200'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <h3 className='font-semibold text-gray-900 dark:text-white'>{topic.topic}</h3>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>{topic.category}</p>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <TrendingUpIcon className='text-green-500' />
                                    <span className='text-sm text-gray-600 dark:text-gray-300'>{topic.posts} posts</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            
            <Modal
                open={openVerificationModal}
                onClose={handleCloseVerificationModal}
                aria-labelledby="verification-modal"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: darkMode ? 'rgb(17, 24, 39)' : 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    color: darkMode ? 'white' : 'inherit',
                }}>
                    <div className='flex justify-between items-center mb-4'>
                        <Typography variant="h6" component="h2" className='font-bold dark:text-white'>
                            Get Verified
                        </Typography>
                        <IconButton onClick={handleCloseVerificationModal} className='dark:text-white'>
                            <CloseIcon />
                        </IconButton>
                    </div>

                    <div className='space-y-6'>
                        {verificationBenefits.map((benefit, index) => (
                            <div key={index} className='flex items-start space-x-4'>
                                <div className='mt-1'>{benefit.icon}</div>
                                <div>
                                    <Typography variant="subtitle1" className='font-semibold dark:text-white'>
                                        {benefit.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" className='dark:text-gray-300'>
                                        {benefit.description}
                                    </Typography>
                                </div>
                            </div>
                        ))}

                        <Button
                            variant='contained'
                            fullWidth
                            onClick={handleVerificationRequest}
                            sx={{
                                mt: 2,
                                py: 1.5,
                                borderRadius: '25px',
                                bgcolor: '#1e88e5',
                                '&:hover': {
                                    bgcolor: '#1976d2'
                                }
                            }}
                        >
                            Apply for Verification
                        </Button>
                    </div>
                </Box>
            </Modal>
            <Snackbar 
                open={showSuccessMessage} 
                autoHideDuration={6000} 
                onClose={() => setShowSuccessMessage(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setShowSuccessMessage(false)} 
                    severity="success" 
                    sx={{
                        bgcolor: darkMode ? 'rgb(17, 24, 39)' : 'white',
                        color: darkMode ? 'white' : 'inherit',
                        '& .MuiAlert-icon': {
                            color: darkMode ? 'white' : 'inherit'
                        }
                    }}
                >
                    Your verification request has been sent to administrators for review and approval.
                </Alert>
            </Snackbar>
        </div>
        </div>
    )
}

export default RightTemp
