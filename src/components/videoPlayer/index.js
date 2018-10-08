import React, { Component } from 'react';
import { connect } from 'react-redux';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import styles from './index.less';
import { beyondObject } from '../../utils/commfun';

class VideoPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: props.width,
            poster: props.poster || '',
            videoSources: props.videoSources,
            controls: true,
            autoplay: false,
        };
        this.player = null;
    }

    componentDidMount() {
        this.initPlayer();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!beyondObject(nextProps.videoSources, this.props.videoSources) && nextProps.videoSources.length > 0) {
            console.log('视频播放信息已变更：', nextProps.videoSources);
            let nowState = this.player.controlBar.playToggle.controlText();
            this.player.options({ children: ['controlBar'] });
            this.player.src(nextProps.videoSources);
            if (nowState === 'Pause') {
                this.player.play();
            }
            if (this.player.currentSource().src) {
                this.player.bigPlayButton.el_.style.display = '';
            }
        }
        if (!beyondObject(this.props.poster, nextProps.poster)) {
            this.player.poster(nextProps.poster);
        }
    }

    componentWillUnmount() {
        if (this.player) {
            this.player.dispose();
            this.player = null;
        }
    }

    initPlayer() {
        let { ...option } = this.state;
        let self = this;

        window.xx = this.player = videojs(this.refs.videoPlayer, option, () => {
            self.player.addClass(styles['myVideo']);
            if (self.props.videoSources.length > 0) {
                self.player.src(self.props.videoSources);
            } else {
                // 操作el_感觉不对，这个是vieojs内部属性，官方接口没有公布，但没找到其它方法
                self.player.bigPlayButton.el_.style.display = 'none';
            }
        });
    }

    render() {
        return (
            <video x5-playsinline='' playsinline='' webkit-playsinline='' x5-video-player-fullscreen='' ref='videoPlayer' className='video-js vjs-default-skin vjs-big-play-centered' style={{ margin: '0 auto' }}/>
        );
    }
}

export default connect()(VideoPlayer);
