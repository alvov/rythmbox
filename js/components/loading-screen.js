'use strict';

import React from 'react';
import Store from '../stores/store';

var LoadingScreen = React.createClass({
    getInitialState() {
        return {
            loading: Store.getState('loading'),
            error: Store.getState('error')
        };
    },
    componentDidMount() {
        Store.addChangeListener(this.onStateChange);
    },
    componentWillUnmount() {
        Store.removeChangeListener(this.onStateChange);
    },
    render() {
        return (
            <div className={'loading-screen' + (this.state.loading ? ' is-loading' : '') + (this.state.error ? ' is-error' : '')}>
                <span>{this.state.error ? this.state.error : 'Loading...'}</span>
            </div>
        );
    },
    onStateChange(key) {
        if (key === 'loading') {
            this.setState({ loading: Store.getState('loading') });
        } else if (key === 'error') {
            this.setState({ error: Store.getState('error') });
        }
    }
});

export default LoadingScreen;