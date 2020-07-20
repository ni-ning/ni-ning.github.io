// 直接抛出
export const name = 'linda';
export const age = 20;
export function practiceDance(){
    console.log('dance again and again.')
}

// 或者用对象包裹起来统一抛出，但不能export name 单独抛出
// export {
//     name,
//     age,
//     practiceDance
// }

// 只能是使用一次的 default
const obj = {
    foo: 'bar'
}
export default obj;  // 可以直接 import newName from 'module'
