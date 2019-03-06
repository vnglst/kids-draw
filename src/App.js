import React, { useRef, useState, useEffect } from 'react'
import './App.css'

const HEART_SVG =
  'M 226.3 157 C 205 157 201.4 171.1 201.4 171.1 C 201 172.7 200.3 172.7 199.9 171.1 C 199.9 171.1 196.4 157 175.1 157 C 153.8 157 146.4 179.7 146.4 189.3 C 146.4 219.9 198.2 251.3 198.2 251.3 C 199.5 252.2 201.8 252.2 203.2 251.3 C 203.2 251.3 255 219.9 255 189.3 C 255 179.7 247.5 157 226.3 157z'
const HEARTH_PATH = new Path2D(HEART_SVG)
const HEART_SCALE = 8

function drawHeart(ctx, x, y, hsl) {
  ctx.shadowColor = hsl
  ctx.shadowBlur = 30
  ctx.translate(x - 200, y - 500)
  ctx.fill(HEARTH_PATH)
}

const App = () => {
  const [points, addPoint] = useState([])
  const [draw, setDraw] = useState(false)
  const [color, setColor] = useState(340)

  const canvas = useRef(null)

  const width = window.innerWidth
  const height = window.innerHeight
  const pixelRatio = window.devicePixelRatio

  useEffect(() => {
    const ctx = canvas.current.getContext('2d')

    function clearCanvas() {
      ctx.save()
      ctx.scale(pixelRatio, pixelRatio)
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, width, height)
      ctx.restore()
    }

    clearCanvas()

    function draw(point) {
      ctx.save()
      ctx.scale(pixelRatio / HEART_SCALE, pixelRatio / HEART_SCALE)
      ctx.fillStyle = point.hsl
      drawHeart(ctx, point.x * HEART_SCALE, point.y * HEART_SCALE, point.hsl)
      ctx.restore()
    }

    points.forEach(draw)
  }, [points])

  function handleDraw(e) {
    if (!draw) return

    let x, y, speed
    const touches = e.targetTouches
    if (touches) {
      speed = touches[0].force * 20
      x = touches[0].clientX
      y = touches[0].clientY
    } else {
      x = e.clientX
      y = e.clientY
      const movX = e.movementX
      const movY = e.movementY
      speed = Math.sqrt(movX * movX + movY * movY)
    }
    addPoint([
      ...points,
      {
        x,
        y,
        hsl: `hsl(${color}, ${Math.min(speed * 3 + 80, 120)}%, ${Math.min(
          speed * 3 + 40,
          200
        )}%)`
      }
    ])
  }

  const dw = Math.floor(pixelRatio * width)
  const dh = Math.floor(pixelRatio * height)
  const style = { width, height }
  return (
    <div className="background">
      <button
        onClick={() => {
          addPoint(points.slice(0, points.length - 1))
        }}
      >
        UNDO
      </button>
      <button
        onClick={() => {
          addPoint([])
        }}
      >
        CLEAR
      </button>
      <button
        style={{ backgroundColor: 'lightgreen' }}
        onClick={() => {
          setColor(100)
        }}
      >
        GREEN
      </button>
      <button
        style={{ backgroundColor: 'pink' }}
        onClick={() => {
          setColor(340)
        }}
      >
        PINK
      </button>
      <button
        style={{ backgroundColor: 'lightblue' }}
        onClick={() => {
          setColor(200)
        }}
      >
        BLUE
      </button>
      <canvas
        ref={canvas}
        width={dw}
        height={dh}
        style={style}
        onTouchMove={handleDraw}
        onMouseMove={handleDraw}
        onMouseDown={e => {
          setDraw(true)
        }}
        onTouchStart={e => {
          setDraw(true)
        }}
        onMouseUp={e => {
          setDraw(false)
        }}
        onTouchEnd={e => {
          setDraw(false)
        }}
      />
    </div>
  )
}

export default App
