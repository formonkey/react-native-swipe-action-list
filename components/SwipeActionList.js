import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, Animated, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import { SwipeListView } from 'react-native-swipe-list-view';

function ActionRowBack({renderLeftHiddenItem, renderRightHiddenItem, opacityAnim}) {
  const leftOpacity = opacityAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 1, 1]
  });
  const rightOpacity = opacityAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [1, 1, 0]
  });
  return (
    <Animated.View style={{flex: 1}}>
    {
      renderLeftHiddenItem && (
        <Animated.View style={{position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, opacity: leftOpacity}}>
          {renderLeftHiddenItem()}
        </Animated.View>
      )
    }
    {
      renderRightHiddenItem && (
        <Animated.View style={{position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, opacity: rightOpacity}}>
          {renderRightHiddenItem()}
        </Animated.View>
      )
    }
    </Animated.View>
  );
}

export default class SwipeActionList extends React.Component {
  static Defaults = {
    // a small buffer for client-specific animation hooks to run
    ANIM_HOOK_DURATION: 200,
    // the animation to remove a row
    ANIM_HEIGHT_DURATION: 150,
  };

  constructor(props) {
    super(props);
    const opacityAnims = this.props.data.reduce((acc, item) => {
      const key = this.props.keyExtractor(item);
      acc[key] = new Animated.Value(0);
      return acc;
    }, {});
    const hookAnims = this.props.data.reduce((acc, item) => {
      const key = this.props.keyExtractor(item);
      acc[key] = new Animated.Value(0);
      return acc;
    }, {});
    const itemHeightAnims = this.props.data.reduce((acc, item) => {
      const key = this.props.keyExtractor(item);
      acc[key] = new Animated.Value(1);
      return acc;
    }, {});
    this.state = {
      itemHeight: -1,
      opacityAnims,
      hookAnims,
      itemHeightAnims
    }
  }

  renderItem = (data, rowMap) => {
    const key = this.props.keyExtractor(data.item);

    // We need to know the height of the items to perform the row collapse
    // animation after a swipe. On the very first item render, specify an
    // onLayout callback to store the height.
    if (this.state.itemHeight < 0) {
      const onLayout = (evt) => {
        const { height } = evt.nativeEvent.layout;
        this.setState({ itemHeight: height });
      }

      return (
        <TouchableHighlight onPress={ this.props.onPress }>
          <Animated.View onLayout={onLayout}>
            {this.props.renderItem(data, rowMap)}
          </Animated.View>
        </TouchableHighlight>
      );
    } else {
      const height = this.state.itemHeightAnims[key].interpolate({
        // Keep a small buffer near 0 to avoid animation glitches where the
        // height doesn't finish animating and has some small height left over
        // at the end. Chosen empirically.
        inputRange: [0, 0.02, 1],
        outputRange: [0, 0, this.state.itemHeight]
      });

      return (
        <TouchableHighlight onPress={ this.props.onPress }>
          <Animated.View style={{height}}>
            {this.props.renderItem(data, rowMap)}
          </Animated.View>
        </TouchableHighlight>
      );
    }
  }

  renderHiddenItem = (data, _) => {
    const key = this.props.keyExtractor(data.item);
    return (
      <ActionRowBack
        renderLeftHiddenItem={this.props.renderLeftHiddenItem}
        renderRightHiddenItem={this.props.renderRightHiddenItem}
        opacityAnim={this.state.opacityAnims[key]}
      />
    );
  }

  render() {
    const screenWidth = Dimensions.get('window').width;
    return (
      <SwipeListView
        renderHiddenItem={this.renderHiddenItem}
        rightOpenValue={-screenWidth}
        leftOpenValue={screenWidth}
        renderItem={this.renderItem}
        // Make sure to not trigger a row close on scroll since it has racing
        // issues with onSwipe(Left|Right).
        closeOnScroll={false}
        // -- WORKAROUND ------------------------------------------------------
        // https://github.com/jemise111/react-native-swipe-list-view/issues/312
        // useNativeDriver causes a bug on Android when releasing a row swipe
        useNativeDriver={false}
        {...this.props}
        // -- /WORKAROUND -----------------------------------------------------
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
});

