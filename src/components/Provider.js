import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ReactReduxContext } from './Context'
import Subscription from '../utils/Subscription'

{/* <Provider store={store}>
  <App />
</Provider> */}
/* 
  总结：1、Provider 主要完成了对 store 数据的监控、订阅 state 变化、设置回调。
        2、理解难点：之前都是订阅事件，但是这里订阅数据变化 突然有点反应不过来，
          数据改变就要重新
        3、本来的 Provider 实现，将 store、subscription 作为state保存起来
        4、每次 store 发生改变都会触发重新创建 Subscription 实例？
          有一个原因是考虑到了Provider有可能被嵌套使用，
          所以会有这种在Provider更新之后取新数据并重新订阅的做法，
          这样才能保证每次传给子组件的context是最新的。
*/
function Provider({ store, context, children }) {
  // 对 store、subscription 浅比较 shallowEqual
  // 1、改变会新建 subscription ？  
  // 检查一下当前的 store 与之前的 store 是否一致，若不一致，说明应该根据新的数据做变化，
  // 那么依照原来的数据做出改变已经没有意义了，所以会先取消订阅，再重新声明Subscription实例，
  // 2、绑定 onStateChange ，
  // 也是类似的原因
  // onStateChange 的回调也就是通知订阅自己的 listeners 去执行
  // onStateChange 监听更新UI的事件，顶级的 Provider 直接绑定在 store 的 subscription 上
  const contextValue = useMemo(() => {
    // 比较一下前后的store是否相同，如果不同，那么用新的store作为context的值，
    // 并且取消订阅，重新订阅一个新的Subscription实例
    const subscription = new Subscription(store)
    subscription.onStateChange = subscription.notifyNestedSubs
    return {
      store,
      subscription
    }
  }, [store]);

  // 相当于做了一次 shouldComponetUpdate 的浅比较
  // 获取当前的 store 中的 state，作为上一次的state，将会在组件挂载完毕后，
  // 与store新的state比较，不一致的话更新Provider组件
  const previousState = useMemo(() => store.getState(), [store])

  // 总体流程应该是 previousState、contextValue 发生改变，然后引起 useEffect 的回调函数。
  useEffect(() => {
    const { subscription } = contextValue
    // trySubscribe 将 this.handleChangeWrapper 作为 listener ，添加到上一级的listeners中
    // this.parentSub.addNestedSub(this.handleChangeWrapper) ，
    // 而 this.handleChangeWrapper 即为 onStateChange 的回调函数，
    subscription.trySubscribe()
    /* 
    notifyNestedSubs() {
      this.listeners.notify()
    }
    */

  //  useEffect 的执行时机是在渲染完成后执行
  //  功能就是判断如果不同，就通知下边的 subscription 订阅在本级的 listener 去执行，更新 ui

  //  todo：确定这里还要 subscription.notifyNestedSubs() 的用意？？？？
  //  这里的对比不确定用意，感觉此时 priviousState 与 store.getState 应该是相同的，
  // 可能是因为 onstateChange 的 notifyNestedSubs 导致了 store 又发生改变
    if (previousState !== store.getState()) { 
      subscription.notifyNestedSubs()
    }
    // clean up 型的effect、类似class组件的 componentDidUnMount，取消订阅和onStateChange
    return () => {
      subscription.tryUnsubscribe()
      subscription.onStateChange = null
    }
  }, [contextValue, previousState])

  const Context = context || ReactReduxContext

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

Provider.propTypes = {
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired
  }),
  context: PropTypes.object,
  children: PropTypes.any
}

export default Provider
