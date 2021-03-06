import {
  SET_APP_LOADING,
  SET_SESSION,
  SEND_APP_NOTIFICATION,
} from "./constants";

const initialState = {
  appLoading: 0,
  appNotification: null,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_APP_LOADING:
      return {
        ...state,
        appLoading: action.payload
          ? state.appLoading + 1
          : state.appLoading - 1,
      };
    case SET_SESSION:
      return {
        ...state,
        session: action.payload,
      };
    case SEND_APP_NOTIFICATION:
      return {
        ...state,
        appNotification: action.payload,
      };
    default:
      return state;
  }
};

export default appReducer;
