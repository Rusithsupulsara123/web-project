import axios from "axios";
import { api, API_BASE_URL } from "../../config/api";
import { FIND_USER_BY_ID_FAILURE, FIND_USER_BY_ID_SUCCESS, FOLLOW_USER_FAILURE, FOLLOW_USER_SUCCESS, GET_USER_PROFILE_FAILURE, GET_USER_PROFILE_SUCCESS, LOGIN_USER_FAILURE, LOGIN_USER_SUCCESS, LOGOUT, REGISTER_USER_FAILURE, REGISTER_USER_SUCCESS, UPDATE_USER_FAILURE, UPDATE_USER_SUCCESS,
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE,
  GET_ALL_POSTS_REQUEST,
  GET_ALL_POSTS_SUCCESS,
  GET_ALL_POSTS_FAILURE,
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE, } from "./ActionType";


export const loginUser = (loginData) => async (dispatch) => {
    try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/signin`, loginData);
        console.log("Login response:", data);

        if (data.jwt) {
            localStorage.setItem("jwt", data.jwt);
            dispatch({ type: LOGIN_USER_SUCCESS, payload: data.jwt });
            // Get user profile after successful login
            await dispatch(getUserProfile(data.jwt));
            return { success: true, payload: data.jwt };
        }
        return { success: false, payload: null };
    } catch (error) {
        console.error("Login error:", error);
        dispatch({ type: LOGIN_USER_FAILURE, payload: error.message });
        return { success: false, error: error.message };
    }
}

export const registerUser=(registerData)=>async(dispatch)=>{
    try {
        const {data} = await axios.post(`${API_BASE_URL}/auth/signup`, registerData);
        console.log("Sign up user",data)

        if(data.jwt) {
            localStorage.setItem("jwt", data.jwt)
        }
        dispatch({type: REGISTER_USER_SUCCESS, payload: data})

    } catch(error) {
        console.log("error", error)
        dispatch({type: REGISTER_USER_FAILURE, payload: error.message})
    }
}

export const getUserProfile=(jwt)=>async(dispatch)=>{
    try {
        const {data} = await axios.get(`${API_BASE_URL}/api/users/profile`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        });

        dispatch({type: GET_USER_PROFILE_SUCCESS, payload: data})

    } catch(error) {
        console.log("error", error)
        dispatch({type: GET_USER_PROFILE_FAILURE, payload: error.message})
    }
}

export const findUserById =(userId)=>async(dispatch)=>{
    try {
        const {data} = await api.get(`/api/users/${userId}`)
        dispatch({type: FIND_USER_BY_ID_SUCCESS, payload: data})

    } catch(error) {
        console.log("error", error)
        dispatch({type: FIND_USER_BY_ID_FAILURE, payload: error.message})
    }
}

export const updateUserProfile =(reqData)=>async(dispatch)=>{
    try {
        const {data} = await api.put(`/api/users/update`,reqData)
        console.log("update user",data)
        dispatch({type: UPDATE_USER_SUCCESS, payload: data})

    } catch(error) {
        console.log("error", error)
        dispatch({type: UPDATE_USER_FAILURE, payload: error.message})
    }
}


export const followUserAction =(userId)=>async(dispatch)=>{
    try {
        const {data} = await api.put(`/api/users/${userId}/follow`)
        console.log("followed user",data)
        dispatch({type: FOLLOW_USER_SUCCESS, payload: data})

    } catch(error) {
        console.log("error", error)
        dispatch({type: FOLLOW_USER_FAILURE, payload: error.message})
    }
}

export const createPost = (postData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_POST_REQUEST });
    const { data } = await api.post(`/api/posts`, postData);
    dispatch({ type: CREATE_POST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CREATE_POST_FAILURE, payload: error.message });
  }
};

export const getAllPosts = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_POSTS_REQUEST });
    const { data } = await api.get(`/api/posts`);
    dispatch({ type: GET_ALL_POSTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_ALL_POSTS_FAILURE, payload: error.message });
  }
};

export const updatePost = (postId, postData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_POST_REQUEST });
    const { data } = await api.put(`/api/posts/${postId}`, postData);
    dispatch({ type: UPDATE_POST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_POST_FAILURE, payload: error.message });
  }
};

export const deletePost = (postId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_POST_REQUEST });
    await api.delete(`/api/posts/${postId}`);
    dispatch({ type: DELETE_POST_SUCCESS, payload: postId });
  } catch (error) {
    dispatch({ type: DELETE_POST_FAILURE, payload: error.message });
  }
};


export const logOut=()=>async(dispatch)=>{
        localStorage.removeItem("jwt")

        dispatch({type: LOGOUT, payload: null })
    
}

