import { FIND_USER_BY_ID_SUCCESS, FOLLOW_USER_SUCCESS, GET_USER_PROFILE_FAILURE, GET_USER_PROFILE_REQUEST, GET_USER_PROFILE_SUCCESS, LOGIN_USER_FAILURE, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGOUT, REGISTER_USER_FAILURE, REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, UPDATE_USER_SUCCESS,CREATE_POST_REQUEST,
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

const initialState={
    user:null,
    loading:false,
    error:null,
    jwt:null,
}
export const authReducer=(state=initialState, action)=>{

    switch (action.type) {
        case LOGIN_USER_REQUEST:
        case REGISTER_USER_REQUEST:
        case GET_USER_PROFILE_REQUEST:
            return{...state,loading:true, error:null}
        
        case LOGIN_USER_SUCCESS:
        case REGISTER_USER_SUCCESS:
            return{...state,loading:false, error:null, jwt:action.payload}
        
        case GET_USER_PROFILE_SUCCESS:
            return{...state,loading:false, error:null, user:action.payload}

       // case UPDATE_USER_SUCCESS:
            //return{...state,loading:false, error:null, user:action.payload, updateUser: true}

        case FIND_USER_BY_ID_SUCCESS:
        case UPDATE_USER_SUCCESS:
            return{...state,loading:false, error:null, findUser:action.payload}
        
        case FOLLOW_USER_SUCCESS:
            return{...state,loading:false, error:null, findUser:action.payload}

        case LOGOUT:
            return initialState;
        
        case LOGIN_USER_FAILURE:
        case REGISTER_USER_FAILURE:
        case GET_USER_PROFILE_FAILURE:
            return{...state,loading:false, error:action.payload}

             case CREATE_POST_REQUEST:
        case GET_ALL_POSTS_REQUEST:
        case UPDATE_POST_REQUEST:
        case DELETE_POST_REQUEST:
            return { ...state, postLoading: true, postError: null };

        case CREATE_POST_SUCCESS:
            return {
                ...state,
                postLoading: false,
                posts: [action.payload, ...state.posts],
            };

        case GET_ALL_POSTS_SUCCESS:
            return {
                ...state,
                postLoading: false,
                posts: action.payload,
            };

        case UPDATE_POST_SUCCESS:
            return {
                ...state,
                postLoading: false,
                posts: state.posts.map((post) =>
                    post.id === action.payload.id ? action.payload : post
                ),
            };

        case DELETE_POST_SUCCESS:
            return {
                ...state,
                postLoading: false,
                posts: state.posts.filter((post) => post.id !== action.payload),
            };

        case CREATE_POST_FAILURE:
        case GET_ALL_POSTS_FAILURE:
        case UPDATE_POST_FAILURE:
        case DELETE_POST_FAILURE:
            return { ...state, postLoading: false, postError: action.payload };
        default:
            return state;
    }
}