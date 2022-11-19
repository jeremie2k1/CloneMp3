const audio = document.querySelector('audio');
const visualizer = document.querySelector('.visualizer');


window.AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new window.AudioContext();
const analyzer = ctx.createAnalyser();
const source = ctx.createMediaElementSource(audio);
source.connect(analyzer);
source.connect(ctx.destination);
analyzer.fftSize = 64;
const bufferLength = analyzer.frequencyBinCount;

let dataArray = new Uint8Array(bufferLength);
let elements = [];
for (let i = 0; i < bufferLength; i++) {
    const element = document.createElement('div');
    element.classList.add('element');
    elements.push(element);
    visualizer.appendChild(element);
}

const clamp = (num, min, max) => {
    if (num >= max) return max;
    if (num <= min) return min;
    return num;
}

const update = () => {
    requestAnimationFrame(update);
    analyzer.getByteFrequencyData(dataArray);
    for (let i = 0; i < bufferLength; i++) {
        let item = dataArray[i];
        item = item > 150 ? item / 1.5 : item * 1.5;
        // elements[i].style.transform = `rotateZ(${i * (360 / bufferLength)}deg) translate(-50%, ${clamp(item, 100, 150)}px)`;
        elements[i].style.transform = `translate(100%, ${clamp(item, 100, 150)}px)`;
        elements[i].style.left = 620 + i * 11 + 'px';
    }
};
update();