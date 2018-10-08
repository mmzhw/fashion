import axios from 'axios';
import { BASE_URL } from './config.js';
import { STORAGE } from './constant';
import storage from './storage';
import { getWXUrl } from './commfun';
import { Modal } from 'antd-mobile/lib/index';

let request = axios.create({
    method: 'post',
    baseURL: BASE_URL,
    withCredentials: true,
    transformRequest: [(data) => {
        data.token = storage.get(STORAGE.TOKEN) || '';
        return JSON.stringify(data);
    }],
    headers: {
        'Access-Control-Allow-Origin': window.location.host,
        'Content-Type': 'application/json',
    }
});

request.interceptors.response.use((response) => {
    if (response.data.code === 1001) {
        Modal.alert('登录超时', '点击确定重新登录', [
            { text: '确定', onPress: () => (window.location.href = getWXUrl()) },
            { text: '取消', onPress: () => console.log('获取信息失败', response.data) },
        ]);
    } else {
        return response.data;
    }
}, (error) => {
    console.log(error);
    return { msg: error.message };
});

export default request;
