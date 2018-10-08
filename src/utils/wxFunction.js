import { handleIMG } from './commfun';
/* global wx:true */
let wxFunction = {
    init: ({ timestamp, nonceStr, signature, shareTitle, shareContent, shareImg }) => {
        wx.config({
            // debug: true,
            appId: 'wx9bd96b4b7a025431',
            timestamp: timestamp,
            nonceStr: nonceStr,
            signature: signature,
            jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'chooseWXPay', 'onMenuShareTimeline', 'onMenuShareAppMessage']
        });
        wx.ready(() => {
            wx.updateAppMessageShareData({
                title: shareTitle,
                desc: shareContent.substring(0, 30),
                imgUrl: handleIMG(shareImg),
                link: window.location.href,
            });
            wx.updateTimelineShareData({
                title: shareTitle,
                desc: shareContent.substring(0, 30),
                imgUrl: handleIMG(shareImg),
                link: window.location.href,
            });
            wx.onMenuShareTimeline({
                title: shareTitle,
                desc: shareContent.substring(0, 30),
                imgUrl: handleIMG(shareImg),
                link: window.location.href,
            });
            wx.onMenuShareAppMessage({
                title: shareTitle,
                desc: shareContent.substring(0, 30),
                imgUrl: handleIMG(shareImg),
                link: window.location.href,
            });
        });
        wx.error((res) => {
            console.log(res);
        });
    },

    pay: (data) => {
        return new Promise((resolve, reject) => {
            wx.chooseWXPay({
                'timestamp': String(data.timeStamp), // 时间戳，自1970年以来的秒数
                'nonceStr': data.nonceStr, // 随机串
                'package': 'prepay_id=' + data.outTradeNo,
                'signType': 'MD5', // 微信签名方式
                'paySign': data.sign, // 微信签名
                'success': (res) => {
                    resolve({ msg: '投票成功' });
                },
                'fail': (res) => {
                    reject({ msg: '投票失败' });
                },
                'cancel': (res) => {
                    reject({ msg: '投票已取消' });
                },
            });
        });
    }
};

export default wxFunction;
