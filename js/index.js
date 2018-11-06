const toRadians = deg => deg === 0 ? Math.PI * 2 : deg * (Math.PI / 180)
const leftPad = str => str.length == 2 ? str : `0${str}`
const desaturate = color => {
  const [ r, g, b ] = color.replace('#', '').match(/..?/g).map(i => parseInt(i, 16))
  return `rgba(${r}, ${g}, ${b}, 0.3)`
}

const getTextHeight = str => {
  const body = document.getElementsByTagName('body')[0]
  const div = document.createElement('div')
  div.appendChild(document.createTextNode('M'))
  div.setAttribute('style', 'font-family:"Helvetica Neue",sans-serif;font-size:26pt;position:absolute;top:0;left:0');
  body.appendChild(div);
  result = div.offsetHeight;
  body.removeChild(div);
  return result
}

const drawClockFace = ({ ctx, max, value, x, y, color }) => {
  const radius = 175
  ctx.lineWidth = 5

  // draw the outline of the circle
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, toRadians((360 / max) * value), 2 * Math.PI)
  ctx.stroke()

  // draw the desaturated, filled in one
  ctx.fillStyle = desaturate(color)
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.fill()

  // draw the text
  ctx.font = '26pt sans-serif'
  ctx.fillText(
    leftPad(value.toString()), 
    x - ctx.measureText(leftPad(value.toString())).width / 2, 
    y + getTextHeight(value) / 4
  )
}

const drawHours = ({ hours, ...args }) => drawClockFace({ color: '#9b59b6', max: 12, ...args })
const drawMins = ({ mins, ...args }) => drawClockFace({ color: '#2ecc71', max: 60, ...args })
const drawSecs = ({ secs, ...args }) => drawClockFace({ color: '#e74c3c', max: 60, ...args })

const main = () => {
  const canvas = document.getElementById('cvs')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')
  const placement = {
    hours: {
      x: canvas.offsetWidth * (1 / 4),
      y: canvas.offsetHeight / 2
    },
    minutes: {
      x: canvas.offsetWidth * (2 / 4),
      y: canvas.offsetHeight / 2
    },
    seconds: {
      x: canvas.offsetWidth * (3 / 4),
      y: canvas.offsetHeight / 2
    }
  }

  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const date = new Date()
    const hours = date.getHours()
    const mins = date.getMinutes()
    const secs = date.getSeconds()

    drawHours({ ctx, value: hours % 12, x: placement.hours.x, y: placement.hours.y })
    drawMins({ ctx, value: mins, x: placement.minutes.x, y: placement.minutes.y })
    drawSecs({ ctx, value: secs, x: placement.seconds.x, y: placement.seconds.y })
  }, 1000)
}

document.addEventListener("DOMContentLoaded", main)
