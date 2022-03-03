// call的实现
// 首先 context 为可选参数，如果不传的话默认上下文为 window
// 接下来给 context 创建一个 fn 属性，并将值设置为需要调用的函数
// 因为 call 可以传入多个参数作为调用函数的参数，所以需要将参数剥离出来
// 然后调用函数并将对象上的函数删除
Function.prototype.myCall = function(context) {
  if(typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = context || window
  context.fn = this
  const args = [...arguments].splice(1)
  const result = context.fn(...args)
  delete context.fn
  return result
}

// apply的实现
Function.prototype.myApply = function(context){
  if(typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = context || window
  context.fn = this
  let result
  if(arguments[1]){
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}

// bind的实现
// ...
// bind 返回了一个函数，对于函数来说有两种方式调用，一种是直接调用，一种是通过 new 的方式，我们先来说直接调用的方式
// 对于直接调用来说，这里选择了 apply 的方式实现，但是对于参数需要注意以下情况：因为 bind 可以实现类似这样的代码 f.bind(obj, 1)(2)，所以我们需要将两边的参数拼接起来，于是就有了这样的实现 args.concat(...arguments)
// 最后来说通过 new 的方式，在之前的章节中我们学习过如何判断 this，对于 new 的情况来说，不会被任何方式改变 this，所以对于这种情况我们需要忽略传入的 this
Function.prototype.myBind = function(context){
  if(typeof this !== 'function') {
    throw new TypeError('Error')
  }
  
  const _this = this
  const args = [...arguments].splice(1)

  return function F(){
    if(this instanceof F){
      return new _this(...args, ...arguments)
    }
    return _this.apply(context, args.concat(...arguments))
  }
}