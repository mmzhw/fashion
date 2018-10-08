import React from 'react';
import styles from './index.less';
import { SearchBar } from 'antd-mobile';

class Search extends React.Component {
    changeCallback(value) {
        if (this.props.changeCallback) {
            this.props.changeCallback(value);
        }
    }

    cancleCallback(value) {
        this.searchElement.state.value = '';
        this.searchElement.state.focus = false;
        if (this.props.cancleCallback) {
            this.props.cancleCallback(value);
        }
    }

    render() {
        return (
            <div style={this.props.styles}>
                <SearchBar
                    style={{ height: this.props.height }}
                    className={styles['search']}
                    placeholder='Search'
                    maxLength={8}
                    onChange={this.changeCallback.bind(this)}
                    onCancel={this.cancleCallback.bind(this)}
                    ref={(ref) => (this.searchElement = ref)}
                />
            </div>
        );
    }
}

export default Search;
