uniform vec2 iResolution;
uniform float intensity;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 fragColor) {
    vec2 coord = uv * iResolution.xy;
    vec2 dc = abs(0.5 - uv);
    dc *= dc;

    float vignette = 1.0 - dot(dc, vec2(intensity));
    vignette = clamp(vignette, 0.0, 1.0);

    vec3 color = inputColor.rgb;
    fragColor = vec4(color * vignette, 1.0);
}

uniform float offset;
uniform float darkness;

