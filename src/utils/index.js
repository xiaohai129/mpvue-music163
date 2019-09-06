export function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

let width = 750
export function px2rpx (value, winWidth, isInt) {
  let newVale = (value * (width / winWidth))
  if (isInt) {
    return parseInt(newVale)
  }
  return newVale
}

export function rpx2px (value, winWidth, isInt) {
  let newVale = (value * (winWidth / width))
  if (isInt) {
    return parseInt(newVale)
  }
  return newVale
}
