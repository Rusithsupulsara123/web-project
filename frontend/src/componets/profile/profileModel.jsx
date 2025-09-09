import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useFormik } from 'formik';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, TextField, Avatar } from '@mui/material';
import { updateUserProfile } from '../../Store/Auth/Action';
import { useDispatch } from 'react-redux';
import { useSelector} from "react-redux";
import { uplodToCloudnary } from '../Utills/uplodToCloudnary';
import { useTheme } from '../../config/ThemeContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  border: 'none',
  boxShadow: 24,
  p: 4,
  outline:"none",
  borderRadius:4
};

export default function ProfileModel({open,handleClose}) {
  //const [open, setOpen] = React.useState(false);
  const [uploding,setUploding] = React.useState(false);
  const dispatch = useDispatch();
  const [backgroundImage, setBackgroundImage] = React.useState("");
  const [profileImage, setProfileImage] = React.useState("");
  const {auth} = useSelector(store=>store)
  const { darkMode } = useTheme();


  const handleSubmit=(values)=>{
    dispatch(updateUserProfile(values))
    console.log("submited",values);
    backgroundImage("")
    profileImage("")
  }
  const formik = useFormik({
    initialValues:{
      fullName:"",
      location:"",
      birthday:"",
      bio:"",
      backgroundImage:"",
      profilepic:""
    },
    onSubmit:handleSubmit
  })

  const handleImageChnage = async (event) => {
    setUploding(true);
    const { name } = event.target;
    const file = await uplodToCloudnary(event.target.files[0]);
    formik.setFieldValue(name, file);
  
    if (name === "backgroundImage") {
      setBackgroundImage(file);
    } else if (name === "profilepic") {
      setProfileImage(file);
    }
  
    setUploding(false);
  };
  

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          ...style,
          bgcolor: darkMode ? 'rgb(17, 24, 39)' : 'background.paper',
          color: darkMode ? 'white' : 'text.primary',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: darkMode ? 'rgb(75, 85, 99)' : 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: darkMode ? 'rgb(107, 114, 128)' : 'rgba(0, 0, 0, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
          '& .MuiInputLabel-root': {
            color: darkMode ? 'rgb(156, 163, 175)' : 'rgba(0, 0, 0, 0.6)',
          },
          '& .MuiInputBase-input': {
            color: darkMode ? 'white' : 'text.primary',
            backgroundColor: darkMode ? 'rgb(31, 41, 55)' : 'transparent',
          },
          '& .MuiIconButton-root': {
            color: darkMode ? 'rgb(156, 163, 175)' : 'text.primary',
          },
          '& .MuiButton-root': {
            color: 'primary.main',
          },
          '& .MuiFormHelperText-root': {
            color: darkMode ? 'rgb(156, 163, 175)' : 'rgba(0, 0, 0, 0.6)',
          }
        }}>
         <form onSubmit={formik.handleSubmit}>
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                    <IconButton onClick={handleClose} aria-label='delete'>
                      <CloseIcon/>
                    </IconButton>
                    <p className='text-sm'>Edit profile</p>
                </div>
                <Button type='submit'>Save</Button>
            </div>
            <div className='overflow-y-scroll overflow-x-hidden h-[80vh]'>
                <React.Fragment>
                  <div className='w-full'>
                    <div className='relative'>
                        <img className="w-full h-[12rem] objecr-cover object-center" src={backgroundImage || auth.user?.backgroundImage}/>

                        <input
                        type="file"
                        className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                        name='backgroundImage'
                        onChange={handleImageChnage}
                        />
                    </div>
                  </div>

                  <div className='w-full transform -translate-y-14 ml-4 h-[6rem]'>
                    <div className='relative'>
                        <Avatar sx={{width:"7rem",height:"7rem", border:"4px solid white"}} src={profileImage || auth.user?.profilepic}/>

                        <input 
                        type="file"
                        className='absolute top-0 left-0 w-[10rem] h-full opacity-0 cursor-pointer' 
                        onChange={handleImageChnage}
                        name='profilepic'
                        />
                    </div>
                  </div>
                </React.Fragment>

                <div className='space-y-3'>
                    <TextField
                    fullWidth
                    id="fullName"
                    name="fullName"
                    label="FullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                    helperText={formik.touched.fullName && formik.errors.fullName}/>

                    <TextField
                    fullWidth
                    id="location"
                    name="location"
                    label="Location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    error={formik.touched.location && Boolean(formik.errors.location)}
                    helperText={formik.touched.location && formik.errors.location}/>

                    <TextField
                    fullWidth
                    multiline
                    rows={4}
                    id="bio"
                    name="bio"
                    label="Bio"
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                    error={formik.touched.bio && Boolean(formik.errors.bio)}
                    helperText={formik.touched.bio && formik.errors.bio}/>

                    <TextField
                    fullWidth
                    id="birthday"
                    name="birthday"
                    label="Birthday"
                    type="date"
                    value={formik.values.birthday}
                    onChange={formik.handleChange}
                    error={formik.touched.birthday && Boolean(formik.errors.birthday)}
                    helperText={formik.touched.birthday && formik.errors.birthday}
                    InputLabelProps={{
                      shrink: true,
                    }}/>
                </div>
            </div>
         </form>
        </Box>
      </Modal>
    </div>
  );
}