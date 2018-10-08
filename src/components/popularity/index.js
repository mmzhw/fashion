import React from 'react';
import styles from './index.less';

const Popularity = ({ records, voteNumber }) => {
    return (
        <div className={styles['wrapper']}>
            <div className={styles['single']}>
                <span>选手</span>
                <span>{records}</span>
            </div>
            <div className={styles['total']}>
                <span>累计人气</span>
                <span>{voteNumber}</span>
            </div>
        </div>
    );
};

export default Popularity;
