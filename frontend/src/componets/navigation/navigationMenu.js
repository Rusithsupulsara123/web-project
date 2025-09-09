import HomeIcon from "@mui/icons-material/Home"
import ExploreIcon from "@mui/icons-material/Explore"
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AssessmentIcon from '@mui/icons-material/Assessment';

export const navigationMenue=[
    {
        tittle:"Home",
        icon:<HomeIcon/>,
        path:"/home"
    },
    {
        tittle:"Explore",
        dynamicPath: (id) => `/explore`,
        icon:<ExploreIcon/>,
    },
    {
        tittle:"Notification",
        icon:<NotificationsIcon/>,
        
    },
    {
        tittle:"Message",
        icon:<MessageIcon/>,
        
    },
    {
        tittle:"Q&A",
        dynamicPath: (id) => `/questions/${id}`,
        icon:<QuestionAnswerIcon/>,
    },
    {
        tittle:"Progress",
        dynamicPath: (id) => `/progress/${id}`,
        icon:<AssessmentIcon/>,
        
    },
    {
        tittle:"Profile",
        icon:<AccountCircleIcon />,
        dynamicPath: (id) => `/profile/${id}`,
        
    }
]