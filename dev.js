// 프레임워크 로드
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

// 게임
let x = 50
let y = 50
let vx = 0
let vy = 0
let Xdirection = 1
let Ydirection = 1

let movePoint = 3

let bclick = false
let dstX = 50
let dstY = 50

let oldTime = Date.now()
let deltaTime = 10
const loop = () => {
    const newTime = Date.now()
    while (newTime - oldTime >= deltaTime) {
        oldTime += deltaTime

        //
        if (bclick) {
            bclick = false

            const angle = Math.atan2(dstY - y, dstX - x)

            if (Math.abs(angle) > Math.PI / 2) {
                Xdirection = -1
            }
            else {
                Xdirection = 1
            }

            if (angle < 0) {
                Ydirection = -1
            }
            else {
                Ydirection = 1
            }

            const mx = Math.cos(angle) * movePoint
            const my = Math.sin(angle) * movePoint
            vx += mx
            vy += my
        }
        vx *= 0.95
        vy *= 0.95
        x += vx
        y += vy

        //
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const targetImage = image
        ctx.save()
        ctx.translate(x, y)
        ctx.scale(Xdirection, 1)
        ctx.translate(-targetImage.center.x, -targetImage.center.y)
        ctx.drawImage(targetImage, 0, 0)
        ctx.restore()
    }
    setTimeout(loop)
}

// 리소스 로드
const image = document.createElement('img')
image.center = {
    x: 17,
    y: 22
}
image.src = '슬라임.png'

image.onload = () => { // 웹소켓 로드는 어떻게 보장할 것인가?
    canvas.addEventListener('click', (event) => {
        bclick = true
        dstX = event.offsetX
        dstY = event.offsetY
    })
    setTimeout(loop)
}
