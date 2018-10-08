const ua = navigator.userAgent;

function isIE() {
    return window.ActiveXObject || 'ActiveXObject' in window;
}

function ieVersion() {
    let rv = -1;
    const reIE = new RegExp('MSIE ([0-9]{1,}[\.0-0]{0,})');
    if (reIE.exec(ua)) {
        rv = parseFloat(RegExp.$1);
    }
    return rv;
}

export default {
    ie8: isIE() && ieVersion() <= 8,
    ie9: isIE() && ieVersion() <= 9,
    ie10: isIE() && ieVersion() <= 10,
    // ie10: ua.indexOf('Mozilla/5.0') > -1,
    ie11: isIE() && navigator.appVersion.indexOf('Trident/') > 0,
    weibo: (/WeiBo/i).test(ua),
    qq: (/QQBrowser/i).test(ua),
    wechat: (/MicroMessenger/i).test(ua),
    mobile: Boolean(ua.match(/AppleWebKit.*Mobile.*/)),
    ios: Boolean(ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)),
    iPhone: ua.indexOf('iPhone') > -1,
    android: ua.indexOf('Android') > -1,
    mac: ua.indexOf('Mac') > -1
};
