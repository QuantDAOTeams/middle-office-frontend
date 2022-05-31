import ApiService,{API_KEYWORD} from '@/services/api.service';
import JwtService from '@/services/jwt.service';

const bcrypt = require('bcryptjs');
const md5 = require('md5');

const salt = bcrypt.genSaltSync(12);

// action types
export const VERIFY_AUTH = 'verifyAuth';
export const LOGIN = 'login';
export const LOGOUT = 'logout';
export const REGISTER = 'register';
export const UPDATE_PASSWORD = 'updateUser';
export const ACTIVATE_PASSWORD = 'activatePassword';
export const FETCH_AUTH_INFO = 'fetchAuthInfo';
export const CURRENT_USER = 'currentUser';
export const IS_ACTIVATE = 'isActivate';

// mutation types
export const PURGE_AUTH = 'logOut';
export const SET_AUTH = 'setUser';
export const SET_USER = 'setAuthUser';
export const SET_PASSWORD = 'setPassword';
export const SET_ERROR = 'setError';

const state = {
  errors: null,
  user: {},
  isAuthenticated: !!JwtService.getToken(),
};

const getters = {
  [CURRENT_USER](state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
};

const actions = {
  [IS_ACTIVATE](context) {
    return new Promise((resolve) => {
      const data = { token: JwtService.getToken() };
      ApiService.post('/api/v1/users/findAuth', data)
        .then((results) => {
          // console.log('Here what post returns', results.data);
          // console.log('results.data.data.isActivate :', results.data.data.isActivate);
          if (results.data.data.isActivate === true) {
            resolve(results.data.data.isActivate);
          }
        })
        .catch(({ response }) => {
          console.log('Here what post returns', response);
          context.commit(SET_ERROR, response.errors);
          resolve(false);
        });
    });
  },

  [FETCH_AUTH_INFO](context) {
    return new Promise((resolve) => {
      const data = { token: JwtService.getToken() };
      ApiService.post('/api/v1/users/findAuth', data)
        .then((results) => {
          console.log('Here what post returns', results.data);
          context.commit(SET_USER, results.data.data);
          resolve(results.data.data);
        })
        .catch(({ response }) => {
          console.log('Here what post returns', response);
          context.commit(SET_ERROR, response.data.errors);
        });
    });
  },

  [ACTIVATE_PASSWORD](context, data) {
    return new Promise((resolve) => {
      data.password = md5(data.password);
      data.token = JwtService.getToken();
      ApiService.post('/api/v1/users/activate', data)
        .then((results) => {
          console.log('Here what post returns', results.data);
          resolve(results.data);
        })
        .catch(({ response }) => {
          console.log('Here what post returns', response);
          context.commit(SET_ERROR, response.data.errors);
        });
    });
  },

  [LOGIN](context, credentials) {
      console.log("enter into login module")
    credentials.password = bcrypt.hashSync(md5(`${API_KEYWORD}${credentials.password}`), salt);
    return new Promise((resolve, reject) => {
      ApiService.post('/api/v1/users/login', credentials)
        .then(({ data }) => {
          // console.log('[ LOGIN ] SET_AUTH data :', data.data);
          context.commit(SET_AUTH, data.data);
          resolve();
        })
        .catch((error) => {
          // console.error('ApiService Error: ', JSON.stringify(error.data.message));
          reject(error.data);
        });
    });
  },
  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },
  [REGISTER](context, credentials) {
    return new Promise((resolve) => {
      ApiService.post('login', credentials)
        .then(({ data }) => {
          context.commit(SET_AUTH, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.errors);
        });
    });
  },
  [VERIFY_AUTH](context) {
    // console.log(JwtService.getToken());
    if (JwtService.getToken()) {
      ApiService.get('/api/v1/users/login')
        .then(({ data }) => {
          // console.log('[ VERIFY_AUTH ] SET_AUTH data :', data);
          context.commit(SET_AUTH, data);
        })
        .catch(({ response }) => {
          if (response === undefined) {
            // window.location.reload();
          } else {
            context.commit(SET_ERROR, response.data.errors);
          }
        });
    } else {
      context.commit(PURGE_AUTH);
    }
  },
  [UPDATE_PASSWORD](context, payload) {
    const password = payload;

    return ApiService.put('password', password).then(({ data }) => {
      context.commit(SET_PASSWORD, data);
      return data;
    });
  },
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_USER](state, user) {
    state.user = user;
  },
  [SET_AUTH](state, data) {
    state.isAuthenticated = true;
    // console.log("isAuthenticated", state.isAuthenticated)
    // state.user = user;
    state.errors = {};
    // const {token} = state.token;
    JwtService.saveToken(data.token);
  },
  [SET_PASSWORD](state, password) {
    state.user.password = password;
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    // state.user = {};
    state.errors = {};
    JwtService.destroyToken();
    console.log("logout module done");
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
