// 首先我们创建了三个常量用于表示状态，对于经常使用的一些值都应该通过常量来管理，便于开发及后期维护
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise (fn) {
  // 在函数体内部首先创建了常量 that，因为代码可能会异步执行，用于获取正确的 this 对象
  const that = this
  // 一开始 Promise 的状态应该是 pending
  that.state = PENDING
  // value 变量用于保存 resolve 或者 reject 中传入的值
  that.value = null
  // resolvedCallbacks 和 rejectedCallbacks 用于保存 then 中的回调，因为当执行完 Promise 时状态可能还是等待中，这时候应该把 then 中的回调保存起来用于状态改变时使用
  that.resolvedCallbacks = []
  that.rejectedCallbacks = []

  // 首先两个函数都得判断当前状态是否为等待中，因为规范规定只有等待态才可以改变状态
  // 将当前状态更改为对应状态，并且将传入的值赋值给 value
  // 遍历回调数组并执行
  function resolve(value){
    if(that.state === PENDING){
      that.state = RESOLVED
      that.value = value
      that.resolvedCallbacks.map(cb => cb(that.value))
    }
  }
  function reject(value){
    if(that.state === PENDING){
      that.state = REJECTED
      that.value = value
      that.rejectedCallbacks.map(cb => cb(that.value))
    }
  }
  // 实现很简单，执行传入的参数并且将之前两个函数当做参数传进去
  // 要注意的是，可能执行函数过程中会遇到错误，需要捕获错误并且执行 reject 函数
  try{
    fn(resolve, reject)
  } catch (err) {
    reject(err)
  }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  const that = this
  // 首先判断两个参数是否为函数类型，因为这两个参数是可选参数
  // 当参数不是函数类型时，需要创建一个函数赋值给对应的参数，同时也实现了透传
  onFulfilled = typeof onFulfilled === 'function'? onFulfilled : v => v
  onRejected = typeof onRejected === 'function'? onRejected : r => { throw r }
  // 接下来就是一系列判断状态的逻辑，当状态不是等待态时，就去执行相对应的函数。如果状态是等待态的话，就往回调函数中 push 函数
  if(that.state === PENDING){
    that.resolvedCallbacks.push(onFulfilled)
    that.rejectedCallbacks.push(onRejected)
  }

  if(that.state === RESOLVED) {
    onFulfilled(that.value)
  }
  if(that.state === REJECTED) {
    onRejected(that.value)
  }
}

//使用
new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 0)
}).then(value => {
  console.log(value)
})
