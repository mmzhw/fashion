import React from 'react';
import styles from './index.less';
import { Pagination } from 'antd-mobile';
import { PAGE } from '../../utils/constant';

class PopularityList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            page: 1
        };
        this.dispatch = this.props.dispatch;
    }

    onChange(page) {
        this.setState({ page });
        if (this.props.onChangePage) {
            this.props.onChangePage(page);
        }
    }

    render() {
        const { voteMembers = {}} = this.props;
        return (
            <div>
                <div className={styles['wrapper']}>
                    <div className={styles['header']}>
                        <span>排名</span>
                        <span>编号</span>
                        <span>姓名</span>
                        <span>人气</span>
                    </div>
                    {
                        voteMembers && voteMembers.length > 0 && voteMembers.map((item, index) => {
                            return (
                                <div key={index} className={styles['item']}>
                                    <span>{item.ranking}</span>
                                    <span>{item.memberNumber}</span>
                                    <span>{item.name}</span>
                                    <span>{item.voteNumber}</span>
                                </div>
                            );
                        })
                    }
                </div>
                <Pagination
                    className={styles['pageWrapper']}
                    total={Math.ceil(this.props.totalMember / PAGE.VOTE_DEFALUT) }
                    current={this.state.page}
                    mode={'button'}
                    onChange={this.onChange.bind(this)}
                />
            </div>

        );
    }
}
export default PopularityList;
