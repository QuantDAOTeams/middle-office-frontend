import ApiService from '@/services/api.service';


// action types
export const FETCH_OPEN_ORDERS = 'fetchOpenOrders';
export const FETCH_DONE_ORDERS = 'fetchDoneOrders';
export const FETCH_DONE_ORDERS_TODAY = 'fetchDoneOrdersToday';

export const GET_OPEN_ORDERS = 'getOpenOrders';
export const GET_DONE_ORDERS = 'getDoneOrders';
export const GET_DONE_ORDERS_TODAY = 'getDoneOrdersToday';

// mutation types
export const SET_OPEN_ORDERS = 'setOpenOrders';
export const SET_DONE_ORDERS = 'setDoneOrders';
export const SET_DONE_ORDERS_TODAY = 'setDoneOrdersToday';
export const SET_ERROR = 'setError';


const state = {
    openOrders: [],
    doneOrders: [],
    doneOrdersToday: []
};

const getters = {
    [GET_OPEN_ORDERS](state) {
        return state.openOrders;
    },
    [GET_DONE_ORDERS](state) {
        return state.doneOrders;
    },
    [GET_DONE_ORDERS_TODAY](state) {
        return state.doneOrdersToday;
    },
};

const actions = {
    [FETCH_OPEN_ORDERS](context, params) {
        return new Promise((resolve) => {
            ApiService.post('/api/v1/orders/portfolio/open', params)
                .then(({ data }) => {
                    console.log('[ FETCH_OPEN_ORDERS ] data:::', data);
                    context.commit(SET_OPEN_ORDERS, data.data);
                    resolve();
                });
        });
    },

    [FETCH_DONE_ORDERS](context, params) {
        return new Promise((resolve) => {
            ApiService.post('/api/v1/orders/portfolio/done', params)
                .then(({ data }) => {
                    console.log('[ FETCH_DONE_ORDERS ] data:::', data);
                    context.commit(SET_DONE_ORDERS, data.data);
                    resolve();
                });
        });
    },


    [FETCH_DONE_ORDERS_TODAY](context, params) {
        return new Promise((resolve) => {
            ApiService.post('/api/v1/orders/portfolio/done/today', params)
                .then(({ data }) => {
                    console.log('[ FETCH_DONE_ORDERS_TODAY ] data:::', data);
                    context.commit(SET_DONE_ORDERS_TODAY, data.data);
                    resolve();
                });
        });
    },
};

const mutations = {
    [SET_OPEN_ORDERS](state, orders) {
        state.openOrders = [];
        orders.results.forEach((order) => {
            state.openOrders.push({
                quotation: order.quotation.name,
                openTime: order.time.created,
                totalVolume: Number(order.volume.total),
                executedVolume: Number(order.volume.executed),
                orderPrice: "$ " + Number(order.price).toFixed(2),
                ...order
            })

        })
    },
    [SET_DONE_ORDERS](state, orders) {
        state.doneOrders = [];
        orders.results.forEach((order) => {
            state.doneOrders.push({
                quotationName: order.quotation.name,
                orderState: order.state,
                openTime: order.time.updated,
                totalVolume: Number(order.volume.total),
                executedVolume: Number(order.volume.executed),
                orderPrice: "$" + Number(order.price).toFixed(2),
                totalCost:  "$" + Number(order.cost).toFixed(2),
                ...order
            })

        })
        state.doneOrders.sort((a, b) => {
            return Number(b.openTime) - Number(a.openTime);
        });
    },
    [SET_DONE_ORDERS_TODAY](state, orders) {
        state.doneOrdersToday = [];
        orders.results.forEach((order) => {
            state.doneOrdersToday.push({
                openTime: order.time.updated,
                totalVolume: Number(order.volume.total),
                executedVolume: Number(order.volume.executed),
                orderPrice: "$ " + Number(order.price).toFixed(2),
                ...order
            })

        })
    },

};

export default {
    state,
    actions,
    mutations,
    getters,
};
