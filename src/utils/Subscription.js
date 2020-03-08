import { getBatch } from './batch'

// encapsulates the subscription logic for connecting a component to the redux store, as
// well as nesting subscriptions of descendant components, so that we can ensure the
// ancestor components re-render before descendants

const CLEARED = null
const nullListeners = { notify() {} }

/* 
  总结：
    1、subscription 这个类的方法定义
    2、订阅和取消订阅 都用到了 try。。。。
      订阅是将本级挂载父级 Subscription 上，（❤❤❤❤）
    3、发布只用调用 sub 订阅在本级的listener，而本级的订阅由上一级去 notify，
      也就是说本级的 notify 不会触发本级的 onStateChange，而是由上级去调用
*/

function createListenerCollection() {
  const batch = getBatch()
  // the current/next pattern is copied from redux's createStore code.
  // TODO: refactor+expose that code to be reusable here?
  let current = []
  let next = []

  return {
    clear() {
      next = CLEARED
      current = CLEARED
    },

    notify() {
      // 将next赋值给current，并同时赋值给listeners，
      // 这里的next、current、listeners其实就是订阅的更新函数队列
      const listeners = (current = next)
      batch(() => {
        for (let i = 0; i < listeners.length; i++) {
          listeners[i]()
        }
      })
    },

    get() {
      return next
    },

    subscribe(listener) {
      let isSubscribed = true
      if (next === current) next = current.slice()
      next.push(listener)

      // 值得学习，闭包也可以这么去做，返回一个能取消闭包内变量的方法
      // 返回一个取消订阅传入 listener 的函数，方便取消
      return function unsubscribe() {
        if (!isSubscribed || current === CLEARED) return
        isSubscribed = false

        if (next === current) next = current.slice()
        next.splice(next.indexOf(listener), 1)
      }
    }
  }
}

export default class Subscription {
  constructor(store, parentSub) {
    this.store = store
     // 获取来自父级的subscription实例，主要是在connect的时候可能会用到
    this.parentSub = parentSub
    this.unsubscribe = null
    this.listeners = nullListeners

    this.handleChangeWrapper = this.handleChangeWrapper.bind(this)
  }

  addNestedSub(listener) {
    // handleChangeWrapper作为listener绑定在父sub上
    this.trySubscribe()
    // 绑定要绑定的 listener 到本 subscription 实例上
    return this.listeners.subscribe(listener)
  }

  notifyNestedSubs() {
    this.listeners.notify()
  }

  handleChangeWrapper() {
    if (this.onStateChange) {
      this.onStateChange()
    }
  }

  isSubscribed() {
    return Boolean(this.unsubscribe)
  }

  trySubscribe() {
    if (!this.unsubscribe) {
      // 如果parentSub没传，那么使用store订阅，
      // 否则，调用context中获取的subscrption来订阅，保证都订阅到一个地方，具体会在下边说明,
      //这里 this.handleChangeWrapper 作为 listener 添加到了，并返回解绑的函数
      this.unsubscribe = this.parentSub
        ? this.parentSub.addNestedSub(this.handleChangeWrapper)
        : this.store.subscribe(this.handleChangeWrapper)

      this.listeners = createListenerCollection()
    }
  }

  tryUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
      this.listeners.clear()
      this.listeners = nullListeners
    }
  }
}
