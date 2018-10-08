import React from 'react';
import styles from './index.less';
import Popularity from '../popularity';
import Search from '../search';
import VideoPlayer from '../videoPlayer';
import { handleIMG, handleVideo, beyondObject } from '../../utils/commfun';
import { connect } from 'dva/index';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoSources: [],
            poster: '',
        };
        this.dispatch = this.props.dispatch;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!beyondObject(nextProps.liveDetail, this.props.liveDetail)) {
            this.getVideoSource(nextProps.liveDetail);
        }
        if (!beyondObject(nextProps.detail, this.props.detail)) {
            this.setState({
                poster: handleIMG(nextProps.detail.imageUrl)
            });
        }
    }

    getVideoSource(liveDetail) {
        // 直播状态，0:正在直播，1:直播前，2:直播结束
        let self = this;
        let videoSources = {};
        // let poster = handleIMG(liveDetail.displayImageUrl);
        if (liveDetail.liveStatus === 1) {
            this.dispatch({ type: 'activityPage/getWarmUp' }).then(() => {
                let warmUps = self.props.warmUp;
                if (warmUps && warmUps.length > 0) {
                    videoSources = [{
                        src: handleVideo(warmUps[0].vVideoDetailRspVos[0].videoResourceStatusVo.m3u8Clarity.url),
                        type: 'application/x-mpegURL',
                    }];
                    this.setState({ videoSources });
                }
            });
        } else if (liveDetail.liveStatus === 2) {
            videoSources = [{
                src: handleVideo(liveDetail.playbackUrl),
                type: 'application/x-mpegURL',
            }];
            this.setState({ videoSources });
        } else if (liveDetail.liveStatus === 0) {
            videoSources = [{
                src: handleVideo(liveDetail.hlsPlayUrl),
                type: 'application/x-mpegURL',
            }];
            this.setState({ videoSources });
        }
    }

    render() {
        const { headerStyles, changeCallback, cancleCallback, totalMember, totalVoteNumber } = this.props;
        return (
            <div style={headerStyles}>
                <div className={styles['top']}>
                    <Search
                        styles={{ width: '50%' }}
                        height={40}
                        changeCallback={changeCallback}
                        cancleCallback={cancleCallback}
                    />
                    <Popularity records={totalMember} voteNumber={totalVoteNumber}/>
                </div>
                <div className={styles['banner']}>
                    <VideoPlayer
                        videoSources={this.state.videoSources || []}
                        poster={this.state.poster}
                        width={window.screen.width}
                    />
                </div>
            </div>
        );
    }
}

export default connect(({ activityPage }) => ({ activityPage }))(Header);
