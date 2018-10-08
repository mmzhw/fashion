import React, { Component } from 'react';
import styles from './index.less';
import { Button, PullToRefresh, ListView } from 'antd-mobile';
import { handleIMG, beyondObject } from '../../utils/commfun';

class VoteList extends Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource: dataSource.cloneWithRows(props.allMembers),
            refreshing: false,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!beyondObject(nextProps.allMembers, this.props.allMembers)) {
            console.log('参赛人员数据变动...更新成功');
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(nextProps.allMembers),
            });
        }
    }

    onRefresh() {
        if (this.props.onRefresh) {
            this.props.onRefresh();
        }
    }

    onEndReached() {
        this.setState({
            refreshing: false,
        });
    }

    render() {
        const { startClick } = this.props;
        return (
            <ListView
                dataSource={this.state.dataSource}
                useBodyScroll={true}
                horizontal={true}
                renderBodyComponent={() => (<div/>)}
                renderSectionWrapper={(sectionID) => (<div key={sectionID} className={styles['itemLineWrapper']}/>)}
                renderRow={(rowData, sectionID, rowID) => {
                    return (
                        <div key={rowID} className={styles['singleVote']} onClick={() => { startClick(rowData); }}>
                            <div className={rowID % 2 === 0 ? styles['ELeft'] : styles['EContent']}>
                                <div className={styles['top']}>
                                    <img alt={rowData.name} src={handleIMG(rowData.avator)} />
                                    <div>编号：{rowData.memberNumber}</div>
                                </div>
                                <div className={styles['bottom']}>
                                    <span>{rowData.name}</span>
                                    <span>{rowData.voteNumber}票</span>
                                </div>
                                <Button type='primary' size={'small'}>投票</Button>
                            </div>
                        </div>
                    );
                }}
                pullToRefresh={<PullToRefresh
                    direction={'up'}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh.bind(this)}
                />}
                onEndReached={this.onEndReached.bind(this)}
            />

        );
    }
}
export default VoteList;

