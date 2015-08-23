'use strict';

import React from 'react';
import Store from '../stores/store';

var LoadingScreen = React.createClass({
    getInitialState() {
        return { loading: Store.getState('loading') };
    },
    componentDidMount() {
        Store.addChangeListener(this.onLoadingStateChange);
    },
    componentWillUnmount() {
        Store.removeChangeListener(this.onLoadingStateChange);
    },
    render() {
        return (
            <div className={'loading-screen' + (this.state.loading ? ' is-loading' : '')}>
                <span>Loading...</span>
            </div>
        );
    },
    onLoadingStateChange(key) {
        if (key === 'loading') {
            this.setState({ loading: Store.getState('loading') });
        }
    }
});

export default LoadingScreen;