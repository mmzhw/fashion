import { votePay, voteFree, getCurInfo, getMemberLists, getPrize, getGift, sendWXCode, searchMember, getShareSign, getLiveDetail, getLiveHeart, getWarmUp, getAttention, getMember, getTotalInfos } from '../services/activityPage';
import { STORAGE, TYPE_APPEAR, PAGE } from '../utils/constant';
import { sortArr, getWXUrl } from '../utils/commfun.js';
import { Toast, Modal } from 'antd-mobile';
import storage from '../utils/storage';
import wxFunction from '../utils/wxFunction';
/* global location:true */

export default {
    namespace: 'activityPage',
    state: {
        isVoted: false,
        detail: { },
        prizeData: [], // 奖项数据
        giftDatas: [], // 奖项数据
        totalMember: 0, // 全部参赛人数
        totalVoteNumber: 0, // 总人气值
        allMembers: [],
        voteMembers: [],
        activityId: '',
        page: 1, // 页码,
        wxCode: '',
        attention: '',
        shareSign: {},
        searchValue: '',
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                let wxCode;
                let activityId;
                if (location.pathname.indexOf('/activity/') !== -1) {
                    activityId = location.pathname.replace('/activity/', '').replace('/activity', '').replace('/', '');
                }
                if (location.search.indexOf('?code=') !== -1) {
                    wxCode = location.search.replace('?code=', '').replace('&state=', '');
                }
                dispatch({ type: 'save', payload: { activityId, wxCode }});
            });
        },
    },
    effects: {
        * sendWXCode({ payload }, { call, put, select }) {
            const state = yield select(({ activityPage }) => activityPage);
            if (state.wxCode) {
                const res = yield call(sendWXCode, {
                    code: state.wxCode,
                });
                if (res && res.code === 1) {
                    storage.set(STORAGE.TOKEN, res.data.token);
                    console.log('获取信息成功');
                } else {
                    Modal.alert('登录超时', '点击确定重新登录', [
                        { text: '确定', onPress: () => (window.location.href = getWXUrl()) },
                        { text: '取消', onPress: () => console.log('获取信息失败', res) },
                    ]);
                }
            } else if (!storage.get(STORAGE.TOKEN)) {
                window.location.href = getWXUrl();
            }
        },
        * getShareSign({ payload }, { call, put, select }) {
            const state = yield select(({ activityPage }) => activityPage);
            const res = yield call(getShareSign, { url: window.location.href, activityId: state.activityId });
            if (res && res.code === 1) {
                wxFunction.init({ ...res.data });
            }
        },
        * getTotalInfos({ payload }, { call, put, select }) {
            const state = yield select(({ activityPage }) => activityPage);
            const res = yield call(getTotalInfos, {
                activityId: state.activityId,
            });
            if (res && res.code === 1) {
                yield put({
                    type: 'save', payload: {
                        totalMember: res.data.totalMember,
                        totalVoteNumber: res.data.totalVoteNumber,
                    }
                });
            }
        },
        * getCurInfo({ payload }, { call, put, select }) {
            const state = yield select(({ activityPage }) => activityPage);

            if (!state.activityId) {
                return false;
            }
            const res = yield call(getCurInfo, {
                activityId: state.activityId,
            });
            if (res && res.code === 1) {
                window.document.title = res.data.name;
                yield put({ type: 'save', payload: { detail: res.data }});
                yield put({ type: 'getLiveDetail' });
            }
        },
        * getAttention({ payload }, { call, put, select }) {
            const res = yield call(getAttention, {});
            if (res && res.code === 1) {
                yield put({
                    type: 'save', payload: { attention: res.data.attention }
                });
            }
        },
        * getLiveDetail({ payload }, { call, put, select }) {
            const state = yield select(({ activityPage }) => activityPage);
            if (state.detail.liveRoomId) {
                let res = yield call(getLiveDetail, { liveRoomId: state.detail.liveRoomId });
                if (res && res.code === 0) {
                    yield put({
                        type: 'save', payload: {
                            liveDetail: {
                                liveStatus: res.data.liveStatus,
                                playbackUrl: res.data.playbackUrl,
                                hlsPlayUrl: res.data.hlsPlayUrl,
                            },
                        }
                    });
                }
            }
        },
        * getLiveHeart({ payload }, { call, put, select }) {
            const state = yield select(({ activityPage }) => activityPage);
            if (state.detail.liveRoomId) {
                let res = yield call(getLiveHeart, { liveRoomId: state.detail.liveRoomId });
                if (res && res.code === 0) {
                    yield put({
                        type: 'save', payload: {
                            liveDetail: {
                                ...state.liveDetail,
                                liveStatus: res.data.liveStatus,
                            },
                        }
                    });
                }
            }
        },
        * getWarmUp({ payload }, { call, put, select }) {
            const state = yield select(({ activityPage }) => activityPage);
            if (state.detail.liveRoomId) {
                let resWarmUp = yield call(getWarmUp, { liveRoomId: state.detail.liveRoomId });
                if (resWarmUp && resWarmUp.code === 0) {
                    yield put({
                        type: 'save', payload: {
                            warmUp: resWarmUp.data,
                        }
                    });
                }
            }
        },
        * searchMember({ payload }, { call, put, select }) {
            const state = yield select(({ activityPage }) => activityPage);
            const { value, refresh } = payload || {};
            if (!value) {
                return false;
            }
            let page = state.page;
            if (refresh) {
                page = page + 1;
            } else {
                page = 1;
            }

            const res = yield call(searchMember, {
                pager: { page, rows: state.rows },
                activityId: state.activityId,
                nameOrNumber: value,
            });
            if (res && res.code === 1) {
                yield put({
                    type: 'save', payload: {
                        page,
                        allMembers: refresh ? state.allMembers.concat(res.data.rows) : res.data.rows,
                        searchValue: value,
                    }
                });
            }
        },
        * intervalGetMembers({ payload }, { call, put, select }) {
            const state = yield select(({ activityPage }) => activityPage);
            if (!state.activityId) {
                return false;
            }
            if (!state.searchValue) {
                const res = yield call(getMemberLists, {
                    pager: { page: 1, rows: state.allMembers.length },
                    activityId: state.activityId,
                    sort: TYPE_APPEAR.ALL
                });
                if (res && res.code === 1) {
                    let newDatas = state.allMembers.concat();
                    newDatas = newDatas.map((item) => {
                        return res.data.rows.filter((member) => {
                            if (item.pkId === member.pkId) {
                                return member;
                            } else {
                                return false;
                            }
                        })[0];
                    });
                    yield put({
                        type: 'save', payload: {
                            allMembers: newDatas
                        }
                    });
                }
            }
        },
        * getAllMembers({ payload }, { call, put, select }) {
            const state = yield select(({ activityPage }) => activityPage);
            const { refresh } = payload || {};
            if (!state.activityId) {
                return false;
            }
            let page = state.page;
            if (refresh) {
                page = page + 1;
                if (state.searchValue) {
                    yield put({ type: 'searchMember', payload: { refresh: true, value: state.searchValue }});
                    return false;
                }
            } else {
                page = 1;
                yield put({ type: 'save', payload: { searchValue: '' }});
            }

            const res = yield call(getMemberLists, {
                pager: { page: page, rows: PAGE.DEFAULT },
                activityId: state.activityId,
                sort: TYPE_APPEAR.ALL
            });
            if (res && res.code === 1) {
                yield put({
                    type: 'save', payload: {
                        page,
                        allMembers: refresh ? state.allMembers.concat(res.data.rows) : res.data.rows
                    }
                });
            }
        },
        * getMember({ payload }, { call, put, select }) {
            const state = yield select(({ activityPage }) => activityPage);
            const { memberId } = payload || {};
            if (!state.activityId) {
                return false;
            }

            const res = yield call(getMember, { activityId: state.activityId, memberId });
            if (res && res.code === 1) {
                let newDatas = state.allMembers.concat();
                newDatas = newDatas.map((item) => {
                    if (item.pkId === res.data.pkId) {
                        return res.data;
                    } else {
                        return item;
                    }
                });
                yield put({
                    type: 'save', payload: {
                        allMembers: newDatas
                    }
                });
            }
        },
        * getVoteMembers({ payload }, { call, put, select }) {
            const state = yield select(({ activityPage }) => activityPage);
            const { page = 1 } = payload || {};
            if (!state.activityId) {
                return false;
            }

            const res = yield call(getMemberLists, {
                pager: { page, rows: PAGE.VOTE_DEFALUT },
                activityId: state.activityId,
                sort: TYPE_APPEAR.VOTE
            });
            if (res && res.code === 1) {
                let rows = res.data.rows;
                rows = sortArr(rows, 'voteNumber');
                rows.forEach((row, index) => {
                    row.ranking = (page - 1) * PAGE.VOTE_DEFALUT + (index + 1);
                });
                yield put({
                    type: 'save', payload: {
                        voteMembers: rows, // 参赛数据
                    }
                });
            }
        },
        * getPrize({ payload }, { call, put, select }) {
            const state = yield select(({ activityPage }) => activityPage);

            const res = yield call(getPrize, {
                activityId: state.activityId,
            });
            if (res && res.code === 1) {
                yield put({
                    type: 'save', payload: {
                        prizeData: sortArr(res.data, 'sortd'),
                    }
                });
            }
        },
        * getGift({ payload }, { call, put, select }) {
            const state = yield select(({ activityPage }) => activityPage);

            const res = yield call(getGift, {
                activityId: state.activityId,
            });
            if (res && res.code === 1) {
                yield put({
                    type: 'save', payload: {
                        giftDatas: sortArr(res.data, 'sortd'),
                    }
                });
            }
        },
        * decideVote({ payload }, { call, put, select }) {
            const { gift, memberId, voteSuccessBack } = payload || {};
            let data = {
                activityId: gift.activityId,
                memberId: memberId,
                giftId: gift.pkId,
                giftNumber: 1,
            };
            let requestFun = votePay;
            if (gift.price <= 0) {
                requestFun = voteFree;
                delete data.giftId;
                delete data.giftNumber;
            }
            const res = yield call(requestFun, data);
            if (res && res.code === 1) {
                if (res.data.sign) {
                    wxFunction.pay(res.data)
                        .then((wxResult) => {
                            Toast.success(wxResult.msg);
                            voteSuccessBack();
                        })
                        .catch((wxResult) => {
                            Toast.fail(wxResult.msg);
                        });
                } else {
                    Toast.success('投票成功');
                    voteSuccessBack();
                }
            } else {
                Toast.fail(res ? res.msg : '投票失败');
            }
        },
    },
    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },

};
