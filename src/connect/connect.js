import connectAdvanced from '../components/connectAdvanced'
import shallowEqual from '../utils/shallowEqual'
import defaultMapDispatchToPropsFactories from './mapDispatchToProps'
import defaultMapStateToPropsFactories from './mapStateToProps'
import defaultMergePropsFactories from './mergeProps'
import defaultSelectorFactory from './selectorFactory'

/*
  connect is a facade over connectAdvanced. It turns its args into a compatible
  selectorFactory, which has the signature:

    (dispatch, options) => (nextState, nextOwnProps) => nextFinalProps
  
  connect passes its args to connectAdvanced as options, which will in turn pass them to
  selectorFactory each time a Connect component instance is instantiated or hot reloaded.

  selectorFactory returns a final props selector from its mapStateToProps,
  mapStateToPropsFactories, mapDispatchToProps, mapDispatchToPropsFactories, mergeProps,
  mergePropsFactories, and pure args.

  The resulting final props selector is called by the Connect component instance whenever
  it receives new props or store state.
 */
// // 循环执行factories，factories 相当于一个函数数组
// 这里的factories也就是mapStateToProps和mapDisPatchToProps两个文件中暴露出来的处理函数数组

// 技巧：对于不同类型的参数去做不同的处理，可以使用这种类似 match 分流的做法
//      函数数组每个函数对应一种情况，并将处理结果返回
//      如果结果合适，就返回中断对函数数组的循环。
function match(arg, factories, name) {
   // arg也就是mapStateToProps或者mapDispatchToProps
    // 这里相当于将数组内的每个函数执行一遍，
    // 并将我们的mapToProps函数作为参数传进去
  for (let i = factories.length - 1; i >= 0; i--) {
    const result = factories[i](arg)
    if (result) return result
  }

  return (dispatch, options) => {
    throw new Error(
      `Invalid value of type ${typeof arg} for ${name} argument when connecting component ${
        options.wrappedComponentName
      }.`
    )
  }
}

function strictEqual(a, b) {
  return a === b
}

// createConnect with default args builds the 'official' connect behavior. Calling it with
// different options opens up some testing and extensibility scenarios
export function createConnect({
  connectHOC = connectAdvanced,
  mapStateToPropsFactories = defaultMapStateToPropsFactories,
  mapDispatchToPropsFactories = defaultMapDispatchToPropsFactories,
  mergePropsFactories = defaultMergePropsFactories,
  selectorFactory = defaultSelectorFactory
} = {}) {

// 按照connect(mapStateToProps, mapDispatchToProps)(component) 思路，这里返回的仍然是一个返回函数的函数，
// 技巧，作为 curry 化的一种实践方法，可以将函数封装逐层增加其功能。
  return function connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    {
      pure = true,
      areStatesEqual = strictEqual,
      areOwnPropsEqual = shallowEqual,
      areStatePropsEqual = shallowEqual,
      areMergedPropsEqual = shallowEqual,
      ...extraOptions
    } = {}
  ) {
    const initMapStateToProps = match(
      mapStateToProps,
      mapStateToPropsFactories,
      'mapStateToProps'
    )
    /*
      当 mapDispatchToProps 为对象，
      函数返回下边的获取 constant 的 getter 函数
      function constantSelector() {
        return constant
      }
      而且 constantSelector.dependsOnOwnProps = false 标识是否是自身属性
    */
    const initMapDispatchToProps = match(
      mapDispatchToProps,
      mapDispatchToPropsFactories,
      'mapDispatchToProps'
    )
    const initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps')

    // 返回 connectHOC 的调用结果，结果是 wrapWithConnect 函数，接受 wrapComponent
    return connectHOC(selectorFactory, {
      // used in error messages
      methodName: 'connect',

      // used to compute Connect's displayName from the wrapped component's displayName.
      getDisplayName: name => `Connect(${name})`,

      // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
      shouldHandleStateChanges: Boolean(mapStateToProps),

      // passed through to selectorFactory
      initMapStateToProps,
      initMapDispatchToProps,
      initMergeProps,
      pure,
      areStatesEqual,
      areOwnPropsEqual,
      areStatePropsEqual,
      areMergedPropsEqual,

      // any extra options args can override defaults of connect or connectAdvanced
      ...extraOptions
    })
  }
}

export default createConnect()
