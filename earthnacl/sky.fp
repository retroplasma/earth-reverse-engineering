//! COMMON
// The view ray direction vector in Atmo Coordinates
// (pointing *away* from the camera, *not* normalized).
varying vec3 viewDirAtmo;

// The view ray direction vector in Sun Coordinates
// (pointing *away* from the camera, *not* normalized).
varying vec3 viewDirSun;

#ifdef ENABLE_STAR_SHADER
// The view ray direction vector in Galactic Coordinates
// (pointing *away* from the camera, *not* normalized).
varying vec3 viewDirGalactic;
#endif

#ifdef ENABLE_SKY_NOSCATTER
// Atmosphere coordintes.  These are calculated from the screen space
// coordinates of the vertices.
varying vec2 vAtmoCoord;
varying vec2 vPlanetOriginAtmoCoord;
#else
#if defined(VERTEX_SHADED) && defined(ENABLE_ATMOSPHERE)
varying vec3 atmoTransmittance;
varying vec3 atmoInscatter;
#endif
#endif

$input "sky.glsllib"
// Implements the abstract function defined in atmosphere.glsllib.
float atmosphereTweak(float r, float mu) {
  return 1.0;
}

void main() {
#if !defined(ENABLE_STAR_SHADER)
  vec3 viewDirGalactic;  // Make sure this is defined for compilation.
#endif  // ENABLE_STAR_SHADER
  vec4 sky_color = vec4(0.);
#if defined(ENABLE_SKY_NOSCATTER)
  // sky_color is black when ENABLE_ATMOSPHERE is not defined.
#if defined(ENABLE_ATMOSPHERE)
  sky_color = ComputeSkyColorNoScatter(
      viewDirAtmo, viewDirSun, vAtmoCoord, viewDirGalactic,
      vPlanetOriginAtmoCoord);
#endif
#else  // ENABLE_SKY_NOSCATTER
  vec3 atmoTransmittance_local = vec3(1.0);
  vec3 atmoInscatter_local = vec3(0.0);
#if defined(ENABLE_ATMOSPHERE) && !defined(DISABLE_INSCATTER)
#if !defined(VERTEX_SHADED)
  ComputeInscatter(atmoTransmittance_local, atmoInscatter_local);
#else  // VERTEX_SHADED
  atmoTransmittance_local = atmoTransmittance;
  atmoInscatter_local = atmoInscatter;
#endif  // VERTEX_SHADED
  sky_color = ComputeSkyColorScatter(
      viewDirAtmo, viewDirSun, viewDirGalactic,
      atmoTransmittance_local, atmoInscatter_local);
#endif  // ENABLE_ATMOSPHERE && !DISABLE_INSCATTER
#endif  // ENABLE_SKY_NOSCATTER
  gl_FragColor = vec4(sky_color.rgb, 0.);
}
