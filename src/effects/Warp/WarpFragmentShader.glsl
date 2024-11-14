uniform float frequency;
uniform float amplitude;
uniform float time;

void mainUv(inout vec2 uv) {
    uv.y += sin(uv.x * frequency + time) * amplitude;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = vec4(0.8, 1.0, 0.5, inputColor.a);
}