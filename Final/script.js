document.getElementById('convertButton').addEventListener('click', function() {
    convertToPixelArt();
    setTimeout(function() {
        changeTitleColor();
    }, 100);
});

document.getElementById('decreasePixelSize').addEventListener('click', function() {
    adjustPixelSize(-10);
});

document.getElementById('increasePixelSize').addEventListener('click', function() {
    adjustPixelSize(10);
});

document.getElementById('imageUploader').addEventListener('change', function() {
    loadImage(this.files[0]);
    document.getElementById('selectImageText').style.display = 'none';
    document.getElementById('imageName').textContent = this.files[0].name; // 이미지 이름 표시
});

function adjustPixelSize(delta) {
    const pixelSizeInput = document.getElementById('pixelSize');
    let pixelSize = parseInt(pixelSizeInput.value) || 10;
    pixelSize = Math.max(1, pixelSize + delta);
    pixelSizeInput.value = pixelSize;
}

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');

            const maxCanvasWidth = 500;
            const maxCanvasHeight = 500;

            const ratio = img.width / img.height;
            var canvasWidth;
            var canvasHeight;
            if (img.width > img.height){
                canvasWidth = maxCanvasWidth;
                canvasHeight = maxCanvasWidth / ratio;
            } else {
                canvasHeight = maxCanvasHeight;
                canvasWidth = maxCanvasHeight * ratio;
            }
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function changeTitleColor() {
    const title = document.getElementById('title');
    const letters = title.textContent.split('');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const pixelSize = parseInt(document.getElementById('pixelSize').value) || 10;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    title.innerHTML = letters.map(letter => {
        const x = Math.floor(Math.random() * canvas.width / pixelSize) * pixelSize;
        const y = Math.floor(Math.random() * canvas.height / pixelSize) * pixelSize;
        const index = (y * canvas.width + x) * 4;
        const color = `rgb(${data[index]}, ${data[index + 1]}, ${data[index + 2]})`;
        return `<span style="color: ${color}">${letter}</span>`;
    }).join('');
}

function convertToPixelArt() {
    const input = document.getElementById('imageUploader');
    const pixelSizeInput = document.getElementById('pixelSize');
    const pixelSize = parseInt(pixelSizeInput.value) || 10;

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');

                const scaleFactor = Math.min(1, 600 / img.width, 450 / img.height);
                const scaledWidth = img.width * scaleFactor;
                const scaledHeight = img.height * scaleFactor;

                canvas.width = scaledWidth;
                canvas.height = scaledHeight;

                ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

                for (let y = 0; y < scaledHeight; y += pixelSize) {
                    for (let x = 0; x < scaledWidth; x += pixelSize) {
                        const pixel = ctx.getImageData(x, y, 1, 1).data;
                        ctx.fillStyle = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3] / 255})`;
                        ctx.fillRect(x, y, pixelSize, pixelSize);
                    }
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

document.getElementById('downloadButton').addEventListener('click', function() {
    const canvas = document.getElementById('canvas');
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = image;
    link.click();
});
