export function setup() {
    createCanvas(500, 500);
}
export function draw() {
    background(0);
    noStroke();
    fill("red")
    for (let i = 0; i < 4; i++) {
        ellipse(width / 2, height / 2 + (i * 2), 20);
    }
}