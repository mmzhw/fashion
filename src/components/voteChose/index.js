import React from 'react';
import { List, Radio, Modal, Button, WingBlank } from 'antd-mobile';
import { handleIMG } from '../../utils/commfun';
import styles from './index.less';
import { Toast } from 'antd-mobile';

const RadioItem = Radio.RadioItem;

class VoteChange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pkId: '',
        };
    }

    onChange(pkId) {
        this.setState({
            pkId,
        });
    };

    decideVote(memberId) {
        let pkId = this.state.pkId;
        if (!pkId) {
            Toast.fail('请选择投票的礼物');
            return false;
        }
        this.setState({ pkId: '' });
        this.props.decideVote(pkId, memberId);
    }

    render() {
        const { modal, voteItem = {}, endClick, giftDatas = [] } = this.props;
        return (
            <WingBlank>
                <Modal
                    popup
                    maskClosable={true}
                    visible={modal}
                    onClose={endClick}
                    animationType='slide-up'
                >
                    <List
                        renderHeader={() => <div>您正为编号为<span style={{ color: '#FFAA00' }}>{voteItem.memberNumber}</span>的<span style={{ color: '#FFAA00' }}>{voteItem.name}</span>投票</div>}
                        className={styles['popList']}
                    >
                        {giftDatas.map(item => {
                            let cname = '';
                            let isDis = false;
                            if (item.price <= 0 && voteItem.isFreeVoted) {
                                cname = styles['radioDis'];
                                isDis = true;
                            } else {
                                if (this.state.pkId === item.pkId) {
                                    cname = styles['radioAc'];
                                } else {
                                    cname = styles['radioNoAc'];
                                }
                            }
                            return (
                                <RadioItem
                                    key={item.pkId}
                                    checked={ this.state.pkId === item.pkId}
                                    disabled={isDis}
                                    onChange={this.onChange.bind(this, item.pkId)}
                                    className={cname}
                                >
                                    <img src={handleIMG(item.iconUrl)} alt={''} />
                                    <span> {item.name} ({(item.price !== 0) ? (item.price + '点') : '免费' })--(价值{item.voteNumber}人气)</span>
                                </RadioItem>
                            );
                        }
                        )}
                        <List.Item>
                            <Button type='primary' onClick={this.decideVote.bind(this, voteItem.pkId)}>投票</Button>
                        </List.Item>
                    </List>
                </Modal>
            </WingBlank>
        );
    }
}

export default VoteChange;
