# react-native-swipe-action-list

[![npm version](https://img.shields.io/npm/v/react-native-swipe-action-list?style=flat-square)](https://npmjs.org/package/react-native-swipe-action-list)
[![npm downloads](https://img.shields.io/npm/dm/react-native-swipe-action-list?style=flat-square)](https://npmjs.org/package/react-native-swipe-action-list)
[![Build Status](https://img.shields.io/travis/mirailabs/react-native-swipe-action-list?style=flat-square)](https://travis-ci.org/mirailabs/react-native-swipe-action-list)


A list view that supports swipe actions for React Native (Android &amp; iOS).

<br />

![demo gif](docs/demo.gif)

## API

### `<SwipeActionList />`

| Prop | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| data | array | Yes | An array of items to be rendered in the list. |
| keyExtractor | function | Yes | A function that returns an item's key. |
| renderItem | function | Yes | A render function for each item row. |
| renderLeftHiddenItem | function | Yes | A render function for the hidden view that appears when a user swipes left. |
| renderRightHiddenItem | function | Yes | A render function for the hidden view that appears when a user swipes right. |
| onSwipeLeft | function | No | A callback invoked after a user has finished swiping left. |
| onSwipeRight | function | No | A callback invoked after a user has finished swiping right. |
