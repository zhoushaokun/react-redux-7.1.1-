import { bindActionCreators } from 'redux'
import { wrapMapToPropsConstant, wrapMapToPropsFunc } from './wrapMapToProps'

// 注意：
// 可以看到wrapMapToPropsFunc、wrapMapToPropsConstant
// mapStateToProps/mapDispathchToProps 是复用的函数
// 因此：可以研究一下是怎么做的

// 当 mapDispatchToProps 是函数，
/* 
function mapDispatchToProp(dispatch, ownProps) {
  return {
    handleChange(){
      dispatch(someAction);
    },
  };
}
*/
export function whenMapDispatchToPropsIsFunction(mapDispatchToProps) {
  return typeof mapDispatchToProps === 'function'
    ? wrapMapToPropsFunc(mapDispatchToProps, 'mapDispatchToProps')
    : undefined
}

// 当 mapDispatchToProps 为空时，仅将 dispatch 作为属性
export function whenMapDispatchToPropsIsMissing(mapDispatchToProps) {
  return !mapDispatchToProps
    ? wrapMapToPropsConstant(dispatch => ({ dispatch }))
    : undefined
}

// 为对象时，去 bindActionCreators(Redux 库的？？)，把dispatch 注入
// bindActionCreators 将一个值是action creators 的对象，转为一个拥有同样keys，但是每个 creator
// 被 wrapped 进的 dispatch 调用，
/* 
mapDispatchToProps {
  add,
}
等价于 {
  add: (...args) => dispatch(add(...args))
}
*/
//返回一个 initConstantSelector，调用 initConstantSelector 就得到了上边的封装后对象的访问函数
/* 
function constantSelector() {
  return constant
}
 */
export function whenMapDispatchToPropsIsObject(mapDispatchToProps) {
  return mapDispatchToProps && typeof mapDispatchToProps === 'object'
    ? wrapMapToPropsConstant(dispatch =>
        bindActionCreators(mapDispatchToProps, dispatch)
      )
    : undefined
}


// 这几个函数都是针对参数输入不同情况做的分流处理，最终合为函数数组
export default [
  whenMapDispatchToPropsIsFunction,
  whenMapDispatchToPropsIsMissing,
  whenMapDispatchToPropsIsObject
]
