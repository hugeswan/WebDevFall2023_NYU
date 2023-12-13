# Documentation

## Overview
The Pixel Art Converter is a web application that allows users to upload images and convert them into pixel art. Users can adjust the size of the pixels and download the converted pixel art.

## Implementation Details
### HTML Structure

The `index.html` file defines the structure of the web page. This file is divided into two main sections identified as 'leftPanel' and 'rightPanel'.

    <div id="leftPanel">
        <div id="canvasContainer">
            <canvas id="canvas" onclick="document.getElementById('imageUploader').click()"></canvas>
            <div id="selectImageText">Select Image</div>
        </div>
        <input type="file" id="imageUploader" accept="image/*" hidden>
    </div>

    <div id="rightPanel">
        <h1 id="title">Pixel Art Converter</h1>
        <div id="imageName" class="poppins"></div>
        <label for="pixelSize" class="poppins">Pixel Size:</label>
        <button id="decreasePixelSize">-10</button>
        <input type="number" id="pixelSize" value="10" min="1" max="100">
        <button id="increasePixelSize">+10</button><br>
        <button id="convertButton">Convert to Pixel Art</button><br>
        <button id="downloadButton">Download Pixel Art</button>
    </div>

The 'leftPanel' contains the image canvas, and the 'rightPanel' contains buttons for adjusting pixel size and converting the image.

### Styling with CSS

The `style.css` file defines the visual styles of the web page. This stylesheet uses 'Poppins' and 'VT323' fonts sourced from Google Fonts.

    body {
        display: flex;
        font-family: 'Poppins', sans-serif;
        height: 100vh;
        align-items: center;
    }

    button {
        background-color: #999;
        color: white;
        padding: 15px 32px;
        font-size: 16px;
        border: none;
        border-radius: 4px;
        width: 260px;
        margin: 10px 10px;
        transition: background-color 0.3s; 
    }


A hover effect was added to the buttons to enhance user interaction.

    button:hover {
        background-color: #666;
    }


### JavaScript Interactivity

The `script.js` file handles the dynamic functionality of the page. When an image is uploaded, the `loadImage` function is called, loading the image onto the canvas.

    function loadImage(file) {
        // FileReader and Image objects are used to load the image
        ...   
    }

The `convertToPixel Art` function is responsible for turning the image into pixel art.

    function convertToPixelArt() {
        // Draw the image on the canvas and create pixel art based on pixel size
        ...
    }


### Image Aspect Ratio

Following user feedback, the `loadImage` function was modified to maintain the original aspect ratio when uploading 16:9 images.

    if (img.width > img.height) {
        canvasWidth = maxCanvasWidth;
        canvasHeight = img.height / img.width * maxCanvasWidth;
    } else {
        canvasHeight = maxCanvasHeight;
        canvasWidth = maxCanvasHeight * ratio;
    }

### Dynamic Title Color

The `changeTitleColor` function adds an artistic touch to the application by changing the color of each letter in the title based on the colors present in the pixel art. This function enhances the visual appeal and ensures that the title's appearance is consistent with the pixel art theme.

    function changeTitleColor() {
        // Extract random pixel colors from the canvas and apply them to the title letters
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


### Convert to Pixel Art
The convertToPixelArt function is triggered when the "Convert to Pixel Art" button is clicked. It processes the uploaded image to create a pixelated version by drawing the image on the canvas and filling in each pixel block with the average color of the corresponding area.

    function convertToPixelArt() {
        // Convert the uploaded image into pixel art by redrawing it with larger pixels
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

### Maintaining Image Aspect Ratio
A significant challenge was ensuring that the uploaded images maintained their aspect ratio when displayed on the canvas. This was particularly important for images with a 16:9 aspect ratio, which needed to be presented without distortion.

    function loadImage(file) {
        // Read the file and load the image with the correct aspect ratio
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

### Adjusting Pixel Size

Adjusting the pixel size is an interactive feature allowing users to control the granularity of the pixel art. The adjustPixelSize function updates the pixel size and redraws the pixel art accordingly.

    function adjustPixelSize(delta) {
        // Update the pixel size based on user interaction and redraw the pixel art
        const pixelSizeInput = document.getElementById('pixelSize');
        let pixelSize = parseInt(pixelSizeInput.value) || 10;
        pixelSize = Math.max(1, pixelSize + delta);
        pixelSizeInput.value = pixelSize;
    }

### Downloading Pixel Art
Once users are satisfied with their pixel art, they can download the image using the "Download Pixel Art" button. This feature uses the canvas's data URL to facilitate the download of the image as a PNG file.

    document.getElementById('downloadButton').addEventListener('click', function() {
        // Trigger the download of the pixel art
        const canvas = document.getElementById('canvas');
        const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const link = document.createElement('a');
        link.download = 'pixel-art.png';
        link.href = image;
        link.click();
    });


### Challenges and Solutions

Throughout the project, several challenges arose. For example, maintaining the image aspect ratio was problematic, which was resolved by adjusting the canvas resizing logic. Additionally, ensuring that the image did not scale when changing the pixel size required adjustments to the `convertToPixelArt` function.

In conclusion, the Pixel Art Converter provides a fun and interactive way for users to turn regular images into pixel art. Through iterative development and addressing user feedback, the application offers a seamless experience from image upload to pixel art download. The project documentation will serve as a guide for future updates and maintenance.
