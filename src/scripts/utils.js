// Simple function to create controlled timeouts
export const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export const debounce = (func, wait, immediate) => {
  var timeout
  return function () {
    var context = this,
      args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

import { ref, computed } from 'vue'

export const useStopwatch = () => {
  let seconds = ref(0)
  let timer = null

  const start = () => {
    seconds.value = 0
    timer = setInterval(() => seconds.value++, 1000)
  }

  const stop = () => {
    clearInterval(timer)
    // Returns readable human time in hh:mm:ss
    // return new Date(seconds * 1000).toISOString().substr(11, 8)
    // return getTimeFromSeconds(seconds.value * 1000)
  }

  const time = computed(() => getTimeFromSeconds(seconds.value))

  // Return start and stop functions
  return { start, stop, time }
}

export const formatTime = (time, noSeconds = false) => {
  return new Date(time).toISOString().substr(11, noSeconds ? 5 : 8)
}

export function getTimeFromSeconds(secs) {
  function z(n) {
    return (n < 10 ? '0' : '') + n
  }
  // var sign = secs < 0 ? '-' : ''
  secs = Math.abs(secs)
  return z((secs / 3600) | 0) + ':' + z(((secs % 3600) / 60) | 0) + ':' + z(secs % 60)
}

export const formatDate = (date) => {
  const d = new Date(date)

  const month = d.toLocaleDateString('default', { month: 'long' })
  const day = d.toLocaleDateString('default', { day: 'numeric' })
  const year = d.toLocaleDateString('default', { year: 'numeric' })

  return `${month} ${day} ${year}`
}

export const inRange = (number, min, max) => {
  if (number >= min && number <= max) return true
  return false
}

export const colors = (color) => {
  const colors = {
    'color-bg': '#303841',
    'color-bg-light': '#3a4750',
    'color-text': '#eeeeee',
    'color-highlight': '#f6c90e',
    'color-highlight-shade': '#c59a12',
    'color-red': '#f60e70',
    'color-red-shade': '#be155c',
    'color-blue': '#007FFF',
  }

  return colors[color] ?? colors['color-text']
}

export const percent = (value, outoff) => {
  if (value && outoff) {
    return Math.floor((value * 100) / outoff)
  } else {
    return 0
  }
}
