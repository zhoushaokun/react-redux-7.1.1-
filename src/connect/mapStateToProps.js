import { wrapMapToPropsConstant, wrapMapToPropsFunc } from './wrapMapToProps'

export function whenMapStateToPropsIsFunction(mapStateToProps) {
  return typeof mapStateToProps === 'function'
    ? wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps')
    : undefined
}

// 如果 mapStateToProps 为空，返回 
// function constantSelector() {
//   return constant
// }
// 这样一个返回空对象的函数

export function whenMapStateToPropsIsMissing(mapStateToProps) {
  return !mapStateToProps ? wrapMapToPropsConstant(() => ({})) : undefined
}
// 当 mapStateToProps 是正常的函数时，返回 wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps')
// 当不为函数时，第一个 whenMapStateToPropsIsFunction返回undefined
// 当 mapStateToProps 为空（null/undefined），wrapMapToPropsConstant(() => ({}))
// 当 mapStateToprops 既不为函数，也不为空，那么就会报错

export default [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing]
