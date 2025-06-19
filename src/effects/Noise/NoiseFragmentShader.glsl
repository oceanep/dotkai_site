uniform float opacity;
uniform float time;
uniform vec2 iResolution;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 fragColor) {
    vec2 coord = uv * iResolution.xy;

    // Generate uniform noise using a combination of sine and cosine
    float noise = fract(sin(dot(coord.xy + time, vec2(12.9898, 78.233))) * cos(dot(coord.xy, vec2(93.9898, 67.345))) * 43758.5453);

    // Blend noise with input color
    vec3 color = mix(inputColor.rgb, vec3(noise), opacity);

    fragColor = vec4(color, inputColor.a);
}