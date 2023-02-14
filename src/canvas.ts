const RATIO = 1.7777777777777777

const canvas = document.getElementById('game') as HTMLCanvasElement

onload = onresize = () => {
    const width = document.body.clientWidth
    const height = document.body.clientHeight

    if (width / height > RATIO) {
        canvas.width = height * 800 / 450
        canvas.height = height
    } else {
        canvas.height = width * 450 / 800
        canvas.width = width
    }
}

export default canvas
