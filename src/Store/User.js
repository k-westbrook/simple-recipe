import axios from 'axios';
import history from '../history'
import Cookies from 'universal-cookie';

//Cookies
const cookies = new Cookies();



/**
 * ACTION TYPES
 */
const ADD_USER = 'ADD_USER';
const GET_USER = 'GET_USER';
const LOGOUT_USER = 'LOGOUT_USER';

/**
 * INITIAL STATE
 */
const userObject = {};


/**
 * ACTION CREATORS
 */

const addUser = (user) => ({ type: ADD_USER, user })
const getUser = user => ({ type: GET_USER, user })
const logout = () => ({ type: LOGOUT_USER })


/**
 * THUNK CREATORS
 */
export const registerUserThunk = (email, password) => async dispatch => {

  try {
    let response = await axios.post("https://pgqrxh9ys4.execute-api.us-west-1.amazonaws.com/Prod/", { email, password });
    let { data } = response;

    let userObject;

    if (data.statusCode === 200) {
      userObject =
        {
          user: data.body.user,
          registered: true,
          keepRegistered: true
        };

      dispatch(addUser(userObject));
      cookies.set('authentication', true, { path: '/' });
      cookies.set('email', email, { path: '/' });
      cookies.set('password', password, { path: '/' });
      history.push('/mydash')
    }
    else {
      userObject =
        {

          registered: false
        }
      dispatch(addUser(userObject));
    }
  } catch (error) {
    console.log(error);
  }

}

export const loginUserThunk = (email, password) => async dispatch => {

  try {
    let response = await axios.post("https://isloxxdzw9.execute-api.us-west-1.amazonaws.com/Prod", { email, password });
    let { data } = response;

    let userObject;

    if (data.statusCode === 200) {
      userObject =
        {
          user: data.body.user,
          registered: true,
          keepRegistered: true
        };
      dispatch(getUser(userObject));
      cookies.set('authentication', true, { path: '/' });
      cookies.set('email', email, { path: '/' });
      cookies.set('password', password, { path: '/' });

    }
    else {
      userObject =
        {

          registered: false
        }
      dispatch(getUser(userObject));
    }
  } catch (error) {
    console.log(error);
  }

}

export const logoutUser = () => dispatch => {
  try {
    cookies.set('authentication', false, { path: '/' });
    cookies.remove('email');
    cookies.remove('password');
    dispatch(logout())
    history.push('/homepage')
  } catch (err) {
    console.log(err);
  }
}



/**
 * REDUCER
 */
export default function (state = userObject, action) {
  switch (action.type) {
    case ADD_USER:
      return action.user
    case GET_USER:
      return action.user;
    case LOGOUT_USER:
      return userObject
    default:
      return state
  }
}
