export const TYPE_APPEAR = {
    ALL: 3,
    NEW: 1,
    VOTE: 2,
    SIGN: 4,
    ERROR: 5,
    PRIZE: 6,
};

export const PAGE = {
    DEFAULT: 20,
    VOTE_DEFALUT: 10
};

export const STORAGE = {
    TOKEN: 'FSEFESRGSEGSEG'
};

export const DESCRIPTION_NAME = {
    MEMBERS: 'Members',
    DESCRIPTION: 'Description',
    RULES: 'Rules',
    ATTENTION: 'Attention',
};

export const ALL_TABS = [
    { title: '人气评选', name: 'Members' },
    { title: '活动介绍', name: 'Description' },
    { title: '评选规则', name: 'Rules' },
    { title: '关注', name: 'Attention' },
];

export const VOTE_BUTTON = [
    { type: TYPE_APPEAR.ALL, name: '全部参赛' },
    { type: TYPE_APPEAR.VOTE, name: '人气排行' },
    { type: TYPE_APPEAR.PRIZE, name: '奖项设置' },
    { type: TYPE_APPEAR.SIGN, name: '我要报名' },
];

export const PLAY_STATE = {
    STATR: 1,
    PAUSE: 0,
};
