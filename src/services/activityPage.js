import request from '../utils/request';

/* 获取登录id */
export function sendWXCode(body) {
    return request.post('/vote-api-web/user/getAccessToken', body);
}

/* 获取ticketticket */
export function getShareSign(body) {
    return request.post('/vote-api-web/wechat/getSign', body);
}

/* 获取活动详情 */
export function getCurInfo(body) {
    return request.post('/vote-api-web/activity/detail', body);
}

/* 获取参赛总信息 */
export function getTotalInfos(body) {
    return request.post('/vote-api-web/activity/getTotalData', body);
}

/* 获取参赛成员列表 */
export function getMemberLists(body) {
    return request.post('/vote-api-web/activity/members', body);
}

/* 获取参赛成员单个 */
export function getMember(body) {
    return request.post('/vote-api-web/activity/member', body);
}

/* 获取奖项列表 */
export function getPrize(body) {
    return request.post('/vote-api-web/activity/prize', body);
}

/* 获取礼物列表 */
export function getGift(body) {
    return request.post('/vote-api-web/gift/get', body);
}

/* 投票 */
export function votePay(body) {
    return request.post('/vote-api-web/order/unified', body);
}

export function voteFree(body) {
    return request.post('/vote-api-web/activity/vote', body);
}

/* 投票 */
export function searchMember(body) {
    return request.post('/vote-api-web/activity/searchMember', body);
}

/* 获取直播信息 */
export function getLiveDetail(body) {
    return request.post('https://dxapi.youxiangtv.com/m_web/liveRoom/view', body);
}

/* 获取预热视频 */
export function getWarmUp(body) {
    return request.post('https://dxapi.youxiangtv.com/m_web/liveRoom/warmUpVideoList', body);
}

/* 获取心跳 */
export function getLiveHeart(body) {
    return request.post('https://dxapi.youxiangtv.com/m_web/liveRoom/getRecordByLiveRoomId', body);
}

/* 获取关注信息 */
export function getAttention(body) {
    return request.post('/vote-api-web/activity/getAttention', body);
}
