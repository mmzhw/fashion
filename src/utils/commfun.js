import { IMAGE_URL, VIDEO_URL, VISIT_URL } from './config';

// 对象，按从大到小重新排列，comKey为比较属性
export const sortArr = (arr, comKey) => {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j][comKey] < arr[j + 1][comKey]) { // 相邻元素两两对比
                let temp = arr[j + 1]; // 元素交换
                arr[j + 1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
};

export const handleIMG = (url) => {
    if (!url) return '';
    if (url.includes('http') || url.includes('https')) {
        return url;
    }

    if (url[0] === '/') {
        return IMAGE_URL + url.replace('/', '');
    } else {
        return IMAGE_URL + url;
    }
};

export const handleVideo = (url) => {
    if (!url) return '';
    if (url.includes('http') || url.includes('https')) {
        return url;
    }

    if (url[0] === '/') {
        return VIDEO_URL + url.replace('/', '');
    } else {
        return VIDEO_URL + url;
    }
};

export const getWXUrl = () => {
    let activityId = window.location.pathname.replace('/activity/', '');
    return 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx66b81ff4b0eedeb6&redirect_uri=' + VISIT_URL + activityId + '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
};

export const beyondObject = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
};
