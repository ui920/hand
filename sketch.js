let canvasSize = [1080, 1080];
let scale = 0.05;
let captureSize = [canvasSize[0] * scale, canvasSize[1] * scale];
let tileWidth = canvasSize[0] / captureSize[0];

let capture;
let imgs = []; // 여러 텍스트 이미지 저장용
let numImgs = 5; // 사용할 이미지 개수 (예: 0.png ~ 4.png)

function preload() {
  for (let i = 0; i < numImgs; i++) {
    imgs[i] = loadImage(
      i + '.png',
      () => console.log(i + '.png loaded'),
      () => console.log(i + '.png failed')
    );
  }
}

function setup() {
  createCanvas(canvasSize[0], canvasSize[1]);
  frameRate(30);
  capture = createCapture(VIDEO);
  capture.size(captureSize[0], captureSize[1]);
  capture.hide();
  noStroke();
  imageMode(CENTER);
}

function draw() {
  background(0);

  capture.loadPixels();
  if (capture.pixels.length > 0) {
    for (let y = 0; y < captureSize[1]; y++) {
      for (let x = 0; x < captureSize[0]; x++) {
        let idx = (x + y * captureSize[0]) * 4;
        let r = capture.pixels[idx];
        let g = capture.pixels[idx + 1];
        let b = capture.pixels[idx + 2];

        // 밝기 계산
        let bright = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        // 밝기에 따른 이미지 선택
        let imgIdx = floor(map(bright, 0, 255, 0, imgs.length));
        imgIdx = constrain(imgIdx, 0, imgs.length - 1);

        // 밝기에 따른 크기 & 회전
        let size = map(bright, 0, 255, 2, tileWidth);
        let angle = map(bright, 0, 255, 0, PI);

        // 그리기
        push();
        translate(x * tileWidth + tileWidth / 2, y * tileWidth + tileWidth / 2);
        rotate(angle);
        // tint(r, g, b); // 웹캠 컬러 반영
        image(imgs[imgIdx], 0, 0, size, size);
        pop();
      }
    }
  }
}
