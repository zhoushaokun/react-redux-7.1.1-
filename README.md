React Redux
=========================

Official React bindings for [Redux](https://github.com/reduxjs/redux).  
Performant and flexible.

[![build status](https://img.shields.io/travis/reduxjs/react-redux/master.svg?style=flat-square)](https://travis-ci.org/reduxjs/react-redux) [![npm version](https://img.shields.io/npm/v/react-redux.svg?style=flat-square)](https://www.npmjs.com/package/react-redux)
[![npm downloads](https://img.shields.io/npm/dm/react-redux.svg?style=flat-square)](https://www.npmjs.com/package/react-redux)
[![redux channel on discord](https://img.shields.io/badge/discord-redux@reactiflux-61DAFB.svg?style=flat-square)](http://www.reactiflux.com)


## Installation

React Redux requires **React 16.8.3 or later.**

```
npm install --save react-redux
```

This assumes that you’re using [npm](http://npmjs.com/) package manager 
with a module bundler like [Webpack](https://webpack.js.org/) or 
[Browserify](http://browserify.org/) to consume [CommonJS 
modules](https://webpack.js.org/api/module-methods/#commonjs).

If you don’t yet use [npm](http://npmjs.com/) or a modern module bundler, and would rather prefer a single-file [UMD](https://github.com/umdjs/umd) build that makes `ReactRedux` available as a global object, you can grab a pre-built version from [cdnjs](https://cdnjs.com/libraries/react-redux). We *don’t* recommend this approach for any serious application, as most of the libraries complementary to Redux are only available on [npm](http://npmjs.com/).

## React Native

As of React Native 0.18, React Redux 5.x should work with React Native. If you have any issues with React Redux 5.x on React Native, run `npm ls react` and make sure you don’t have a duplicate React installation in your `node_modules`. We recommend that you use `npm@3.x` which is better at avoiding these kinds of issues.


## Documentation

The React Redux docs are now published at **https://react-redux.js.org** .

We're currently expanding and rewriting our docs content - check back soon for more updates!

我们正在扩展和重写`docs`内容 - 快来看看更多的更新！

## How Does It Work?

We do a deep dive on how React Redux works in [this readthesource episode](https://www.youtube.com/watch?v=VJ38wSFbM3A).  

我们[在此](https://www.youtube.com/watch?v=VJ38wSFbM3A)深挖`React Redux`是如何工作的。

Also, the post [The History and Implementation of React-Redux](https://blog.isquaredsoftware.com/2018/11/react-redux-history-implementation/) 
explains what it does, how it works, and how the API and implementation have evolved over time.

除此之外，[The History and Implementation of React-Redux](https://blog.isquaredsoftware.com/2018/11/react-redux-history-implementation/)这篇博客阐述了`React-Redux`做了什么、如何工作以及`API`和实现是如何随着时间演变

Enjoy!

使用愉快！

## License

[MIT](LICENSE.md)

## 源码阅读
分为三个部分：

- [X] `Provider` 的[注释](https://github.com/zhoushaokun/react-redux-7.1.1-/blob/master/src/components/Provider.js)
- [X] `Subsription` 的[注释](https://github.com/zhoushaokun/react-redux-7.1.1-/blob/master/src/utils/Subscription.js)
- [ ] `connect` 比较多
  - [X] `connect` 表面封装层的[注释](https://github.com/zhoushaokun/react-redux-7.1.1-/blob/master/src/connect/connect.js)，即对 mapStateToProps/mapDisapatchToProps 的处理。
  - [ ] `connectAdvanced`内部如何注入
