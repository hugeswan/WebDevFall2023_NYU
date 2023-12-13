document.getElementById('convertButton').addEventListener('click', convertToPixelArt);

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

                // 이미지 크기 조정
                const scaleFactor = Math.min(1, 800 / img.width, 600 / img.height);
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
