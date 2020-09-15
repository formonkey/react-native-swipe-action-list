import * as React from 'react';

import PropTypes from 'prop-types';

import { SwipeListView } from 'react-native-swipe-list-view';
import { Dimensions, TouchableWithoutFeedback } from 'react-native';

export default class SwipeActionList extends React.Component {
    render() {
        const screenWidth = Dimensions.get('window').width;

        return (
            <SwipeListView
                closeOnScroll={false}
                useNativeDriver={false}
                leftOpenValue={screenWidth}
                rightOpenValue={-screenWidth}
                {...this.props}
                renderItem={ (data) => (
                    <TouchableWithoutFeedback onPress={ () => this.props.onPress(data) }
                    >
                        { this.props.renderItem(data) }
                    </TouchableWithoutFeedback>
                )}
            />
        );
    }
}

SwipeActionList.propTypes = {
    data: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    keyExtractor: PropTypes.func.isRequired,
    renderLeftHiddenItem: PropTypes.func,
    renderRightHiddenItem: PropTypes.func,
    onSwipeLeft: PropTypes.func,
    onSwipeRight: PropTypes.func
};

