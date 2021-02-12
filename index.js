// 프레임워크 준비 ---
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

// 게임 정의 ---
const images = {}

const player = {
    type: '슬라임',
    position: {
        x: 50,
        y: 50
    },
    velocity: {
        x: 0,
        y: 0
    },
    direction: {
        x: 1,
        y: 1
    },
    movePoint: 3
}

const entities = [
    player,
]

let oldTime
let deltaTime = 10

const gameIdle = () => {
    const newTime = Date.now()
    while (newTime - oldTime >= deltaTime) {
        oldTime += deltaTime

        // translate
        for (const entity of entities) {
            entity.velocity.x *= 0.95
            entity.velocity.y *= 0.95

            entity.position.x += entity.velocity.x
            entity.position.y += entity.velocity.y
        }
    }

    // render
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const entity of entities) {
        const image = images[entity.type]
        ctx.save()
        ctx.translate(entity.position.x, entity.position.y)
        ctx.scale(entity.direction.x, 1)
        ctx.translate(-image.center.x, -image.center.y)
        ctx.drawImage(image, 0, 0)
        ctx.restore()
    }

    setTimeout(gameIdle)
}

const startGame = () => {
    canvas.addEventListener('click', (event) => {
        const x = event.offsetX
        const y = event.offsetY

        const angle = Math.atan2(y - player.position.y, x - player.position.x)

        if (Math.abs(angle) > Math.PI / 2) {
            player.direction.x = -1
        }
        else {
            player.direction.x = 1
        }

        if (angle < 0) {
            player.direction.y = -1
        }
        else {
            player.direction.y = 1
        }

        player.velocity.x += Math.cos(angle) * player.movePoint
        player.velocity.y += Math.sin(angle) * player.movePoint
    })
    oldTime = Date.now()
    setTimeout(gameIdle)
}

// 리소스 준비 ---
const imageResources = [
    {
        key: '슬라임',
        src: '슬라임.png',
        center: {
            x: 17,
            y: 22
        }
    },
]

let imageLoadCount = 0
let targetLoadCount = imageResources.length

for (const imageResource of imageResources) {
    const { key, src, center } = imageResource
    const image = new Image()
    image.src = src
    image.center = center
    image.onload = () => {
        imageLoadCount++
        if (imageLoadCount === targetLoadCount) {
            setTimeout(startGame)
        }
    }
    image.onerror = () => {
        console.log('에러, 이미지 리소스 로드 실패')
    }
    images[key] = image
}
