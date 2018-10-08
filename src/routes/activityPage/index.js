import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Tabs, Button } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import VoteList from '../../components/voteList';
import PopularityList from '../../components/popularityList';
import Header from '../../components/header';
import { TYPE_APPEAR, VOTE_BUTTON, ALL_TABS, DESCRIPTION_NAME } from '../../utils/constant';
import VoteChange from '../../components/voteChose';
import moment from 'moment';

class Index extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            modal: false,
            tabPage: 0,
            voteItem: {},
            appearState: TYPE_APPEAR.ALL, // 1最新 2 人气 3全部
        };
        this.dispatch = this.props.dispatch;
    }

    componentDidMount() {
        let self = this;
        self.dispatch({ type: 'activityPage/getShareSign' });
        self.dispatch({ type: 'activityPage/sendWXCode' });
        self.dispatch({ type: 'activityPage/getCurInfo' });
        self.dispatch({ type: 'activityPage/getTotalInfos' });
        self.dispatch({ type: 'activityPage/getGift' });
        self.dispatch({ type: 'activityPage/getAllMembers' }); // 1最新 2 人气 3全部

        // todo 正式要开启
        this.intervalMember = setInterval(() => {
            // self.dispatch({ type: 'activityPage/intervalGetMembers' });
            self.dispatch({ type: 'activityPage/getLiveHeart' });
        }, 2000);
        this.intervalInfos = setInterval(() => {
            self.dispatch({ type: 'activityPage/getTotalInfos' });
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalMember);
        clearInterval(this.intervalInfos);
        this.intervalMember = null;
        this.intervalInfos = null;
    }

    changeState(state) {
        this.setState({
            appearState: state
        });
        if (state === TYPE_APPEAR.ALL) {
            this.dispatch({ type: 'activityPage/intervalGetMembers' });
        } else if (state === TYPE_APPEAR.VOTE) {
            this.dispatch({ type: 'activityPage/getVoteMembers' });
        } else if (state === TYPE_APPEAR.PRIZE) {
            this.dispatch({ type: 'activityPage/getPrize' });
        }
    }

    changeTabPage(tab, index) {
        this.setState({ tabPage: index });
        if (tab.name === DESCRIPTION_NAME.ATTENTION) { // 关注页面是全局的，可以点到的时候再请求
            this.dispatch({ type: 'activityPage/getAttention' });
        } else if (tab.name === DESCRIPTION_NAME.MEMBERS) {
            this.dispatch({ type: 'activityPage/intervalGetMembers' });
        }
    }

    changeCallback(value) {
        this.setState({ tabPage: 0 });
        this.setState({
            appearState: TYPE_APPEAR.ALL
        });
        this.dispatch({ type: 'activityPage/searchMember', payload: { value: value }});
    }

    cancleCallback() {
        this.setState({
            appearState: TYPE_APPEAR.ALL
        });
        this.dispatch({ type: 'activityPage/getAllMembers' }); // 1最新 2 人气 3全部
    }

    startClick(voteItem) {
        this.setState({ modal: true, voteItem: voteItem });
    }

    endClick() {
        this.setState({ modal: false });
    }

    decideVote(giftId, memberId) {
        const { giftDatas } = this.props.activityPage;
        let gift = giftDatas.filter((item) => {
            return item.pkId === giftId;
        });
        this.dispatch({ type: 'activityPage/getMember', payload: { memberId }});
        this.dispatch({ type: 'activityPage/decideVote', payload: {
            memberId,
            gift: gift[0],
            voteSuccessBack: () => (this.dispatch({ type: 'activityPage/getMember', payload: { memberId }}))
        }});
        this.endClick();
    }

    updataMembers() {
        // 下拉刷新
        this.dispatch({ type: 'activityPage/getAllMembers', payload: { refresh: true }}); // 1最新 2 人气 3全部
    }

    onChangePage(page) {
        this.dispatch({ type: 'activityPage/getVoteMembers', payload: { page }});
    }

    render() {
        const { activityId, totalMember, totalVoteNumber, allMembers, voteMembers, prizeData, giftDatas, detail, liveDetail, warmUp, attention } = this.props.activityPage;
        const { appearState } = this.state;
        let content = '';
        if (!activityId) {
            content = (<p className={styles['noneStyle']}>无此活动！</p>);
        } else if (appearState === TYPE_APPEAR.ALL || appearState === TYPE_APPEAR.NEW) {
            content = (allMembers && allMembers.length > 0) ? (<VoteList startClick={this.startClick.bind(this)} allMembers={allMembers} onRefresh={this.updataMembers.bind(this)} />) : (<p className={styles['noneStyle']}>无数据</p>);
        } else if (appearState === TYPE_APPEAR.VOTE) {
            content = (voteMembers && voteMembers.length > 0) ? (<PopularityList totalMember={totalMember} onChangePage={this.onChangePage.bind(this)} voteMembers={voteMembers} />) : (<p className={styles['noneStyle']}>无数据</p>);
        } else if (appearState === TYPE_APPEAR.SIGN) {
            content = (<p className={styles['noneStyle']}>请联系{detail.firstOrganizer}！</p>);
        } else if (appearState === TYPE_APPEAR.PRIZE) {
            content = (<div style={{ margin: '5vw 3vw 0' }}>
                {
                    prizeData && prizeData.map((item, index) => {
                        return (<p key={index}>{item.name}:{item.detail}</p>);
                    })
                }
            </div>);
        }
        return (
            <StickyContainer>
                <meta name='title' content={detail.name}/>
                <meta name='keywords' content={detail.name}/>
                <meta name='description' content={detail.name}/>
                <VoteChange
                    modal={this.state.modal}
                    giftDatas={giftDatas}
                    voteItem={this.state.voteItem}
                    endClick={this.endClick.bind(this)}
                    decideVote={this.decideVote.bind(this)}
                />
                <div className={styles['AllWrapper']}>
                    <Header
                        changeCallback={this.changeCallback.bind(this)}
                        cancleCallback={this.cancleCallback.bind(this)}
                        liveDetail={liveDetail || {}}
                        warmUp={warmUp || []}
                        totalMember={totalMember}
                        detail={detail || {}}
                        totalVoteNumber={totalVoteNumber}
                        headerStyles={{ position: 'absolute', top: '44px', left: 0, zIndex: 9, width: '100vw' }}
                    />
                    <Tabs
                        tabs={ALL_TABS}
                        page={this.state.tabPage}
                        swipeable={false}
                        onTabClick={this.changeTabPage.bind(this)}
                        renderTabBar={(props) => (<Sticky>
                            {({ style }) => <div style={{ ...style, zIndex: 10 }}><Tabs.DefaultTabBar {...props} /></div>}
                        </Sticky>)}
                        style={{ background: '#FAFAFA' }}
                    >
                        <div className={styles['first']}>
                            <div className={styles['empty']}/>
                            <div className={styles['content']}>
                                {
                                    VOTE_BUTTON && VOTE_BUTTON.map((item, index) => {
                                        let styleButton = {};
                                        if (appearState === item.type) {
                                            styleButton.borderRadius = '15px';
                                        } else {
                                            styleButton.background = 'rgba(250,250,250,1)';
                                        }
                                        return (
                                            <Button
                                                key={index}
                                                style={styleButton}
                                                onClick={this.changeState.bind(this, item.type)}
                                                size={'small'}
                                                type={appearState === item.type ? 'primary' : ''}
                                            >{item.name}</Button>
                                        );
                                    })
                                }
                            </div>
                            <div>
                                {content}
                            </div>
                        </div>
                        <div className={styles['second']}>
                            <div className={styles['empty']}/>
                            <div className={styles['content']}>
                                <p>活动名称：{detail.name}</p>
                                <p>活动地址：{detail.location}</p>
                                <p>主办单位：{detail.firstOrganizer}</p>
                                <p>协办单位：{detail.secondOrganizer}</p>
                                <p>媒体合作：{detail.mediaPartner}</p>
                                <p>开始时间：{moment(detail.startDate).format('YYYY-MM-DD HH:mm:ss')}</p>
                                <p>结束时间：{moment(detail.endDate).format('YYYY-MM-DD HH:mm:ss')}</p>
                                <p>活动介绍：</p>
                                <div dangerouslySetInnerHTML={{ __html: detail.detail }}/>
                            </div>
                        </div>
                        <div className={styles['third']}>
                            <div className={styles['empty']}/>
                            <div className={styles['content']}>
                                <div dangerouslySetInnerHTML={{ __html: detail.selectRule }}/>
                            </div>
                        </div>
                        <div className={styles['fourth']}>
                            <div className={styles['empty']}/>
                            <div className={styles['content']}>
                                <div dangerouslySetInnerHTML={{ __html: attention }}/>
                            </div>
                        </div>
                    </Tabs>
                </div>

            </StickyContainer>
        );
    }
}

export default connect(({ activityPage }) => ({ activityPage }))(Index);

