varying vec2 vUv;
varying vec3 e;
varying vec3 n;

void main() {

    vUv = uv;

    e = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );
    n = normalize( normalMatrix * normal );

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1. );

}
