import ApiService from '@/services/api.service';
import Vue from 'vue';

// action types
export const FETCH_PORTFOLIOS = 'fetchPortfolios';
export const FETCH_MARKET_DATA = 'fetchMarketData';
export const FETCH_OHLC_DATA = 'fetchOHLCData';
export const FETCH_ASSETS_DATA = 'fetchAssetsData';
export const FETCH_PORTFOLIO_POSITIONS_TABLE = 'fetchPortfolioPositionsTable';
export const FETCH_PORTFOLIO_POSITIONS_TOTAL = 'fetchPortfolioPositionsTotal';
export const FETCH_PORTFOLIO_POSITIONS_INFO = 'fetchPortfolioPositionsInfo';
export const UPDATE_PORTFOLIO_POSITIONS_TABLE = 'updatePortfolioPositionsTable';
export const FETCH_PORTFOLIO_POSITIONS_SETTING = 'fetchPortfolioPositionSetting';
export const UPDATE_PORTFOLIO_POSIIONS_SETTING = 'updatePortfolioPositionsSetting';
export const UPDATE_INTERNAL_PNL = 'updateInternalPnL';

export const GET_PORTFOLIOS = 'getPortfolios';
export const GET_PORTFOLIO_POSITIONS_TABLE = 'getPortfolioPositionsTable';
export const GET_PORTFOLIO_POSITIONS_TOTAL = 'getPortfolioPositionsTotal';
export const GET_PORTFOLIO_POSITIONS_INFO = 'getPortfolioPositionsInfo';
export const GET_PORTFOLIO_QUOTATIONS = 'getPortfolioQuotations';
export const GET_PORTFOLIO_POSITIONS_SETTING = 'getPortfolioPositionsSetting';

// mutation types
export const UPDATE_UNREALIZED_PNL = 'updateUnrealizedPnL';
export const UPDATE_PNL_CONTRIBUTION = 'updatePnLContribution';
export const UPDATE_PORTFOLIO_POSITIONS_TOTAL = 'updatePortfolioPositionsTotal';
export const ADD_PORTFOLIOS = 'addPortfolios';
export const INIT_PORTFOLIOS = 'initPortfolios';
export const SET_PORTFOLIO_POSITIONS_TABLE = 'setPortfolioPositionsTable';
export const SET_PORTFOLIO_POSITIONS_TOTAL = 'setPortfolioPositionsTotal';
export const SET_PORTFOLIO_POSITIONS_INFO = 'setPortfolioPositionsInfo';
export const SET_PORTFOLIO_POSITIONS_SETTING = 'setPortfolioPositionsSetting';
export const SET_PORTFOLIO_POSITIONS_TARGET_WEIGHTS = 'setPortfolioPositionsTargetWeights';
export const SET_MARKET_DATA = 'setMarketData';
export const SET_OHLC_DATA = 'setOHLCData';
export const SET_ASSETS_DATA = 'setAssetsData';
export const SET_ERROR = 'setError';


const state = {
  portfolios: [],
  positions: [],
  positionSettings: [],
  positionsTable: [],
  positionsTotal: {},
  assetsData: [],
};

const getters = {
  [GET_PORTFOLIOS](state) {
    return state.portfolios;
  },
  [GET_PORTFOLIO_POSITIONS_INFO](state) {
    return state.positions;
  },
  [GET_PORTFOLIO_POSITIONS_TABLE](state) {
    return state.positionsTable;
  },
  [GET_PORTFOLIO_POSITIONS_TOTAL](state) {
    return state.positionsTotal;
  },
  [GET_PORTFOLIO_QUOTATIONS](state) {
    const quotations = [];
    console.log('state.positions:::', JSON.stringify(state.positions));
    state.positions.forEach((position) => {
      quotations.push(position.quotation);
    })
    return quotations;
  },
  [GET_PORTFOLIO_POSITIONS_SETTING](state) {
    const settings = [];
    state.positionSettings.sort((a, b) => (a.weight.current > b.weight.current) ? -1 : ((a.weight.current < b.weight.current) ? 1 : 0))
    state.positionSettings.forEach((setting) => {
      settings.push({
        name: setting.quotation.name,
        data: {
          currentWeight: 0,
          weightDelta: Number(setting.weight.targeted) * 100,
          deltaSize: 0,
          markPrice: 0,
          markTime: 0,
          positionValue: 0,
          targetedWeight: setting.weight.targeted,
        },
        targetedWeight: setting.weight.targeted,
        //currentWeight: `${Number(Number(setting.weight.current) * 100).toFixed(2)} %`,
        //weightDelta: `${Number((Number(setting.weight.targeted) - Number(setting.weight.current)) * 100).toFixed(2)} %`,
        //markPrice: `$ ${Number(setting.weight.markPrice)}`,
        //positionValue: `$ ${Number(setting.weight.size).toFixed(2)}`
        currentWeight: '0 %',
        weightDelta: `${Number(Number(setting.weight.targeted) * 100).toFixed(2)} %`,
        deltaSize: `-`,
        markPrice: '-',
        markTime: '-',
        positionValue: '$ 0.00'
      });
    });
    return settings;
  },
};

const actions = {

  [FETCH_ASSETS_DATA](context, params) {
    return new Promise((resolve) => {
      ApiService.post('/api/v1/market/assets/latest', params)
        .then(({ data }) => {
          console.log('[ FETCH_ASSETS_DATA ] data:::', data);
          context.commit(SET_ASSETS_DATA, data.data);
          resolve(data.data);
        });
    });
  },


  [FETCH_PORTFOLIO_POSITIONS_TABLE](context, params) {
    return new Promise((resolve) => {
      ApiService.post('/api/v1/positionsTable/latest', params)
        .then(({ data }) => {
          console.log('[ FETCH_PORTFOLIO_POSITIONS_TABLE ] data:::', data);
          context.commit(SET_PORTFOLIO_POSITIONS_TABLE, data.data);
          resolve(data.data);
        });
    });
  },

  [UPDATE_PORTFOLIO_POSITIONS_TABLE](){
    return new Promise((resolve) => {
      console.log('[ UPDATE_PORTFOLIO_POSITIONS_TABLE ] positionsTable:::', state.positionsTable);
      let pArray = [];
      state.positionsTable.forEach((pos) => {
        const { _id, ...p} = pos;
        console.log(_id);
        pArray.push(p);
      });
      ApiService.post('/api/v1/positionsTable/update', {positionsTable: pArray})
        .then(({ data }) => {
          resolve(data.data);
        });
    });
  },

  [FETCH_MARKET_DATA](context, params) {
    return new Promise((resolve) => {
      ApiService.post('/api/v1/market/portfolio/position', params)
        .then(({ data }) => {
          console.log('[ FETCH_MARKET_DATA ] data:::', data);
          context.commit(SET_MARKET_DATA, data.data);
          resolve(data.data);
        });
    });
  },

  [FETCH_OHLC_DATA](context, params) {
    return new Promise((resolve) => {
      ApiService.post('/api/v1/market/ohlc', params)
        .then(({ data }) => {
          console.log('[ FETCH_OHLC_DATA ] data:::', data);
          context.commit(SET_OHLC_DATA, data.data);
          resolve(data.data);
        });
    });
  },

  [FETCH_PORTFOLIO_POSITIONS_TOTAL](context, params) {
    return new Promise((resolve) => {
      ApiService.post('/api/v1/portfolios/getPositionsTotal', params)
        .then(({ data }) => {
          console.log('[ FETCH_PORTFOLIO_POSITIONS_TOTAL ] data:::', data);
          context.commit(SET_PORTFOLIO_POSITIONS_TOTAL, data.data);
          resolve();
        });
    });
  },


  [UPDATE_PORTFOLIO_POSIIONS_SETTING](context, params) {
    return new Promise((resolve) => {
      console.log('UPDATE_PORTFOLIO_POSIIONS_SETTING:: params', params);
      ApiService.post('/api/v1/portfolios/positions/setting/update', params)
        .then(({ data }) => {
          console.log('data:::', data);
          resolve();
        });
    });
  },

  [FETCH_PORTFOLIOS](context, paramsArray) {
    const promises = [];
    paramsArray.forEach((portfolioId) => {
      promises.push(ApiService.post('/api/v1/portfolios/find', { portfolioId }));
    });
    Promise.all(promises).then((results) => {
      context.commit(INIT_PORTFOLIOS);
      results.forEach(({ data }) => {
        context.commit(ADD_PORTFOLIOS, data.data);
      });
    });
  },
  [FETCH_PORTFOLIO_POSITIONS_INFO](context, params) {
    return new Promise((resolve) => {
      ApiService.post('/api/v1/portfolios/positions/info', params)
        .then(({ data }) => {
          context.commit(SET_PORTFOLIO_POSITIONS_INFO, data.data);
          resolve();
        });
    });
  },
  [FETCH_PORTFOLIO_POSITIONS_SETTING](context, params) {
    return new Promise((resolve) => {
      ApiService.post('/api/v1/portfolios/positions/setting', params)
        .then(({ data }) => {
          console.log('FETCH_PORTFOLIO_POSITIONS_SETTING:', data.data);
          context.commit(SET_PORTFOLIO_POSITIONS_SETTING, data.data);
          resolve();
        });
    });
  },

  [UPDATE_INTERNAL_PNL](context){
    context.commit(UPDATE_PNL_CONTRIBUTION);
    context.commit(UPDATE_UNREALIZED_PNL);
    context.commit(UPDATE_PORTFOLIO_POSITIONS_TOTAL);
  }
};

const mutations = {

  [UPDATE_PNL_CONTRIBUTION](state){
    let pnlContribTotal = 0;
    state.positionsTable.forEach((position) => {
      pnlContribTotal = pnlContribTotal + Math.abs(Number(position['total-pnl']));
    })
    state.positionsTable.forEach((position, idx) => {
      state.positionsTable[idx]['pnl-contribution'] = Number(position['total-pnl']) / pnlContribTotal;
    })
  },

  [UPDATE_UNREALIZED_PNL](state){
    state.positionsTable.forEach((position, idx) => {
      state.positionsTable[idx]['unrelized-pnl'] = (Number(position['total-qty']) * (Number(position['mark-price']) - Number(position['avg-bought-price']))).toFixed(2);
      state.positionsTable[idx]['total-pnl'] = (Number(position['unrelized-pnl']) + Number(position['relized-pnl'])).toFixed(2);
      state.positionsTable[idx]['incoming-pnl'] = (Number(position['total-qty']) * (Number(position['mark-price']) - Number(position['close1']))).toFixed(2);
    })
  },

  [ADD_PORTFOLIOS](state, portfolio) {
    state.portfolios.push(portfolio);
  },
  [INIT_PORTFOLIOS](state) {
    state.portfolios = [];
  },

  [SET_ASSETS_DATA](state, assetsData) {
    state.assetsData = assetsData;
    assetsData.assets.forEach((asset) => {
      const idx = state.positionsTable.findIndex((a) => a['position'] === asset.asset);
      if (idx >= 0) {
        let el = state.positionsTable[idx];
        el['total-qty'] = Number(asset.free).toString();
        el['qty-time'] = (new Date(assetsData.time).getUTCFullYear()) + "/" +
          (1 + new Date(assetsData.time).getUTCMonth()) +
          "/" +
          new Date(assetsData.time).getUTCDate() +
          " " +
          new Date(assetsData.time)
            .getUTCHours()
            .toString()
            .padStart(2, "0") +
          ":" +
          new Date(assetsData.time)
            .getUTCMinutes()
            .toString()
            .padStart(2, "0") +
          ":" +
          new Date(assetsData.time)
            .getUTCSeconds()
            .toString()
            .padStart(2, "0");
        Vue.set(state.positionsTable, idx, el);
      }
    })
  },

  [SET_OHLC_DATA](state, marketData) {
    const idx = state.positionsTable.findIndex((a) => a['position'] === marketData.symbol.replace('USDT', ''))
    if (idx >= 0) {
      console.log('marketData.CloseTime:::', marketData.CloseTime);
      let el = state.positionsTable[idx];
      el['close1'] = Number(marketData.Close).toFixed(2);
      el['close1-time'] = (new Date(marketData.CloseTime).getUTCFullYear()) + "/" +
        (1 + new Date(marketData.CloseTime).getUTCMonth()) +
        "/" +
        new Date(marketData.CloseTime).getUTCDate() +
        " " +
        new Date(marketData.CloseTime)
          .getUTCHours()
          .toString()
          .padStart(2, "0") +
        ":" +
        new Date(marketData.CloseTime)
          .getUTCMinutes()
          .toString()
          .padStart(2, "0") +
        ":" +
        new Date(marketData.CloseTime)
          .getUTCSeconds()
          .toString()
          .padStart(2, "0");
      Vue.set(state.positionsTable, idx, el);
    }
  },

  [SET_MARKET_DATA](state, marketData) {
    console.log('marketData.symbol:', marketData.symbol);
    console.log('state.positionsTable(0):', state.positionsTable[0]['position']);
    const idx = state.positionsTable.findIndex((a) => a['position'] === marketData.symbol.replace('USDT', ''))
    if (idx >= 0) {
      let el = state.positionsTable[idx];
      el['mark-price'] = (0.5 * (Number(marketData.askPrice) + Number(marketData.bidPrice))).toFixed(2);
      el['']
      el['total-amount'] = (Number(el['mark-price']) * Number(el['total-qty'])).toFixed(2);
      el['mark-time'] = (new Date(marketData.time).getUTCFullYear()) + "/" +
        (1 + new Date(marketData.time).getUTCMonth()) +
        "/" +
        new Date(marketData.time).getUTCDate() +
        " " +
        new Date(marketData.time)
          .getUTCHours()
          .toString()
          .padStart(2, "0") +
        ":" +
        new Date(marketData.time)
          .getUTCMinutes()
          .toString()
          .padStart(2, "0") +
        ":" +
        new Date(marketData.time)
          .getUTCSeconds()
          .toString()
          .padStart(2, "0");
      Vue.set(state.positionsTable, idx, el);
      let portfolioTotal = 0;
      state.positionsTable.forEach((position) => {
        if (position['position'] !== 'USDC') {
          portfolioTotal += Number(position['total-amount']);
        }
      });
      state.positionsTable.forEach((position, idx) => {
        if (portfolioTotal > 0 && state.positionsTable[idx]['position'] !== 'USDC') {
          state.positionsTable[idx]['current-weight'] = (Number(position['total-amount']) / portfolioTotal).toFixed(4);
        }
        else state.positionsTable[idx]['current-weight'] = '0';
      });
      console.log('state.positionsTable[idx].markPrice:', state.positionsTable[idx].markPrice);
    }
  },
  [SET_PORTFOLIO_POSITIONS_TABLE](state, table) {
    state.positionsTable = [];
    table.forEach((element) => {
      state.positionsTable.push({
        'total-amount': Number((element["total-qty"] * element["mark-price"]).toFixed(2)),
        'close1-time': '',
        ...element
      });
    })
  },

  [UPDATE_PORTFOLIO_POSITIONS_TOTAL](state){
    state.positionsTotal[0]['value'] = 0;
    state.positionsTotal[1]['value'] = 0;
    state.positionsTotal[2]['value'] = 0;
    state.positionsTotal[3]['value'] = 0;
    state.positionsTable.forEach((position) => {
      state.positionsTotal[0]['value'] =  (Number(state.positionsTotal[0]['value']) + Number(position['total-pnl'])).toFixed(2);
      state.positionsTotal[1]['value'] =  (Number(state.positionsTotal[1]['value']) + Number(position['relized-pnl'])).toFixed(2);
      state.positionsTotal[2]['value'] =  (Number(state.positionsTotal[2]['value']) + Number(position['unrelized-pnl'])).toFixed(2);
      state.positionsTotal[3]['value'] =  (Number(state.positionsTotal[3]['value']) + Number(position['total-amount'])).toFixed(2);
      console.log('total.pnl:::', state.positionsTotal[0]['value']);
    })
  },

  [SET_PORTFOLIO_POSITIONS_TOTAL](state, total) {
    state.positionsTotal = [
      {
        summary: 'Total P&L',
        value: total['total-pnl'].toFixed(2),
        dailySummary: 'Net P&L',
        dailyValue: total['total-netting-pnl'].toFixed(2),
      },
      {
        summary: 'Realized P&L',
        value: total['total-realized-pnl'].toFixed(2),
        dailySummary: 'Incoming P&L',
        dailyValue: total['total-incoming-pnl'].toFixed(2),
      },
      {
        summary: 'Unrealized P&L',
        value: total['total-unrelized-pnl'].toFixed(2),
        dailySummary: 'Trading P&L',
        dailyValue: total['total-trading-pnl'].toFixed(2),
      },
      {
        summary: 'Total Portfolio Value',
        value: (total['total-asset-value']).toFixed(2),
      },
      {
        summary: 'Total Portfolio Value (exclusive USDT, USDC)',
        value: Number('116520.59').toFixed(2),
      },
    ];
  },


  [SET_PORTFOLIO_POSITIONS_INFO](state, positions) {
    state.positions = positions;
  },
  [SET_PORTFOLIO_POSITIONS_SETTING](state, positionSettings) {
    state.positionSettings = positionSettings;
  },
  [SET_PORTFOLIO_POSITIONS_TARGET_WEIGHTS](state, targetWeights) {
    targetWeights.forEach((weight) => {
      const idx = state.positionsTable.findIndex((a) => a['position'] === weight.Position.replace('USDT', ''));
      if (idx >= 0) {
        let el = state.positionsTable[idx];
        el['target-weight'] = Number(weight.TargetedWeight);
        Vue.set(state.positionsTable, idx, el);
      }
    });
    state.positionsTable.forEach((position, idx) => {
      const widx = targetWeights.findIndex((weight) => position['position'] === weight.Position.replace('USDT', ''));
      if(widx < 0)
      {
        let el = state.positionsTable[idx];
        el['target-weight'] = Number(0.0);
      }
    });
  }
};

export default {
  state,
  actions,
  mutations,
  getters,
};
