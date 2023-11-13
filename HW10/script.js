const images = ['love1.png', 'love2.png', 'love3.png', 'love4.png', 'love5.png'];
let currentImage = 0;

document.getElementById('image-o').addEventListener('click', function() {
  currentImage = (currentImage + 1) % images.length;
  this.querySelector('img').src = images[currentImage];
});
