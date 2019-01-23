#if defined(ENABLE_ATMOSPHERE)
#if defined(ENABLE_TERRAIN_ATMOSPHERE_NOSCATTER)
uniform vec4 cameraAndSunState;
varying float vMu;

vec4 ComputeAtmosphereColor(in vec4 color) {
  // Blend from terrain color to color at horizon based on tilt and
  // distance to eye (vMu).
  // kHorizColor mostly matches horizon color spit out by
  // ComputeSkyColorNoScatter in sky.glsllib
  const vec3 kHorizColor = vec3(200./255., 210./255., 1.);
  vec3 atmo_color = mix(kHorizColor, color.rgb, vMu);
  // cameraAndSunState.w is atmosphere fading used to smoothly enbale/disable
  // atmosphere effects.
  return vec4(mix(color.rgb, atmo_color, cameraAndSunState.w), color.a);
}

#else  // if defined(ENABLE_TERRAIN_ATMOSPHERE_NOSCATTER)
#if defined(FRAGMENT_ATMOSPHERE)
#define VERTEX_SHADER  // Includes the vertex bits of ground.glsllib
#endif
#define FRAGMENT_SHADER  // Includes the fragment bits of ground.glsllib
$input "ground.glsllib"
#undef FRAGMENT_SHADER
#undef VERTEX_SHADER
// All values in world coordinates.
uniform vec3 cameraAtmo;
uniform vec3 sunDirAtmo;
varying vec3 posAtmo;
#if defined(FRAGMENT_ATMOSPHERE)
varying vec3 normalAtmo;

vec4 ComputeAtmosphereColor(in vec4 color) {
  vec3 pixelL = terrainShading(
      color.rgb, cameraAtmo, posAtmo, normalAtmo, sunDirAtmo);
  return vec4(atmosphereFading(color.rgb, pixelL), color.a);
}

#else  // defined(FRAGMENT_ATMOSPHERE)
varying vec3 sunIrradiance;
varying vec3 sunRadiance;
varying vec4 skyIrradianceAndNight;
varying vec3 transmittance;
varying vec3 inscattering;

vec4 ComputeAtmosphereColor(in vec4 color) {
  vec3 pixelL = terrainShadingFS(
      color.rgb, cameraAtmo, posAtmo, sunDirAtmo,
      sunIrradiance, skyIrradianceAndNight,
      transmittance, inscattering, sunRadiance);
  return vec4(atmosphereFading(color.rgb, pixelL), color.a);
}

#endif  // else defined(FRAGMENT_ATMOSPHERE)
#endif  // else if defined(ENABLE_TERRAIN_ATMOSPHERE_NOSCATTER)
#endif  // if defined(ENABLE_ATMOSPHERE)

void InjectFragment(inout vec4 color, in vec2 texcoord) {
#if defined(ENABLE_ATMOSPHERE)
  color = ComputeAtmosphereColor(color);
#endif  // #if defined(ENABLE_ATMOSPHERE)
}
