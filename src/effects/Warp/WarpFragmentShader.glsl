uniform vec2 iResolution;
uniform float warp;
uniform float s_intensity;
uniform float s_frequency;
uniform vec2 scale;
uniform sampler2D tDiffuse; // Input buffer from the rendered scene

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 fragColor) {
    vec2 coord = uv * iResolution.xy;
    vec2 dc = abs(0.5 - uv);
    dc *= dc;

    // Apply warp effect to UV coordinates
    vec2 warpedUv = uv;
    warpedUv.x -= 0.5; 
    warpedUv.x *= scale.x + (dc.y * (0.3 * warp)); 
    warpedUv.x += 0.5;
    warpedUv.y -= 0.5; 
    warpedUv.y *= scale.y + (dc.x * (0.4 * warp)); 
    warpedUv.y += 0.5;

    // Sample the input buffer and apply scanline effect
    if (warpedUv.y > 1.0 || warpedUv.x < 0.0 || warpedUv.x > 1.0 || warpedUv.y < 0.0) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        float apply = abs(sin(coord.y * s_frequency) * 0.5 * s_intensity);
        vec3 color = texture2D(tDiffuse, warpedUv).rgb;
        fragColor = vec4(mix(color, vec3(0.0), apply), 1.0);
    }
}