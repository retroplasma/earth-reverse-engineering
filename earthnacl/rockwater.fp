#if defined(DRAPED)
uniform sampler2D uDrapedTexture;
varying vec3 vDrapedTexCoord;
#endif

#if defined(ENABLE_IMPROVED_WATER)
$input "atmosphere.glsllib"
$input "water.glsllib"

uniform vec4 uEyePosAndAnimTime;
uniform vec4 uFogColorAndDensity;
// x: atmosphere density.
// y: atmosphere angle falloff.
// z: night intensity.
// w: camera exposure.
uniform vec4 uAtmosphereTweaks;
uniform float uWaterTweaks;

// Vertex position in water coordinates translated by one Earth radius (so z
// is the altitude above water, not the distance to the Earth center) and
// vertex alpha.
varying vec4 vout_water_pos_and_alpha;
varying vec3 transmittance;
varying vec3 inscatterL;

vec4 ComputeImprovedWaterColor() {
  // Computes the "vertex to camera" vector in water coordinates.
  vec3 waterCamera = uEyePosAndAnimTime.xyz;
  vec3 waterPosToCamera = waterCamera - vout_water_pos_and_alpha.xyz;
  // Computes the distance from the camera to the current water fragment.
  float waterDist = length(waterPosToCamera);
  // Computes the opposite view ray direction, in water coordinates.
  vec3 waterViewDir = waterPosToCamera / waterDist;

  // Computes the vertex position in (geocentric) water coordinates.
  vec3 waterPos = vout_water_pos_and_alpha.xyz + vec3(0.0, 0.0, 1.0);
  // Computes the normal to the water waves, in water coordinates.
  vec3 waterNormal = waveNormalWater(waterPos);
  // Reflects backfacing normals.
  if (dot(waterViewDir, waterNormal) < 0.0) {
    waterNormal = reflect(waterNormal, waterViewDir);
  }

  // Computes the Sun zenith angle at waterPos.
  float wMuS = dot(waterPos, sunDirWater);
  // Computes the irradiance due to the sky dome (excluding the Sun).
  vec3 skyIrradiance = skyTex(1.0, wMuS) * uAtmosphereTweaks.x;
  // Computes the radiance of the Sun reaching waterPos, relatively to the outer
  // Sun radiance. This is the transmittance of the atmosphere from the ground
  // to the top atmosphere boundary in the Sun direction.
  vec3 sunRadiance = atmoTex(1.0, wMuS).rgb;

  // The angular size of a pixel times the Earth radius (in radians.kilometers).
  // TODO(ebruneton): must be a uniform, value depends on screen size.
  const float kPixelFOV = 0.00128 * 6360.0;
  // The size of the pixel footprint on the water surface, in kilometers.
  float pixelSize = kPixelFOV * waterDist * waterDist / abs(waterPosToCamera.z);
  // The wave slope variance due to waves smaller than pixelSize.
  float waveSlopeVariance = max(waterWaveSlopeVariance(pixelSize), 2e-5);

#if defined(ENABLE_UNDER_WATER_LIGHTING)
  // Basic ad-hoc shading, not physically-based, for under water views.
  float viewDirDotNormal = max(0.0, dot(waterViewDir, waterNormal) - 0.05);
  float skyR = waterMeanFresnel(viewDirDotNormal, waveSlopeVariance);
  vec3 skyColor = 0.75 * toneMapping(skyIrradiance * (1.0 / kPi),
      uAtmosphereTweaks.w);
  vec3 waterColor = mix(skyColor, uFogColorAndDensity.rgb, skyR);
  float waterAlpha = 1.0 - exp(-100.0 * uFogColorAndDensity.w * waterDist);

  vec4 pixelShaderColor = vec4(waterColor * waterAlpha, waterAlpha);
#else
  // Computes the radiance of the water, i.e. how much light is reflected at
  // the water surface, from the Sun and from the sky, in the viewer direction.
  vec3 reflectedSunRadiance;
  vec3 reflectedSkyRadiance;
  waterRadiance(
      waterViewDir,
      waterNormal,
      sunDirWater,
      waveSlopeVariance,
      sunRadiance,
      skyIrradiance,
      uWaterTweaks,
      reflectedSunRadiance,
      reflectedSkyRadiance);
  vec3 waterL = reflectedSunRadiance + reflectedSkyRadiance;

  // Computes the opacity of the water, using an adhoc formula assuming an
  // exponential extinction with depth, and supposing that the vertex alpha
  // somehow represents the water depth.
  float waterA = 1.0 - exp(-10.0 * vout_water_pos_and_alpha.a);
  // Attenuates the opacity of the water when the camera altitude increases, and
  // when the tilt angle decreases.
  waterA *= 1.0 - smoothstep(1.0, kMaxWaterShaderRadius, cameraAndSunState.x);
  waterA = clamp(waterA, 0.01, 1.0);

  // The pixel radiance is the water radiance plus the under water ground
  // radiance times the water transmittance, multiplied by the atmosphere
  // transmittance and augmented by the inscattered light. The pixel color is
  // the tone mapping of this radiance, i.e.
  //   toneMapping((waterL+groundL*(1-waterA))*transmittance+inscatterL);
  // But computing this is not possible without deferred shading, as the water
  // and ground meshes are drawn and tone mapped separately. If we simply output
  //   toneMapping(waterL*transmittance+inscatterL)
  // then the end result on screen will be
  //   toneMapping(waterL*transmittance+inscatterL) +
  //     toneMapping(groundL*transmittance+inscatterL)*(1-waterA);
  // which is quite different from what we want. Lets suppose we know, in this
  // shader, the value of groundL. Then we can output the pre-alpha multiplied
  // value
  //   toneMapping((waterL+groundL*(1-waterA))*transmittance+inscatterL) -
  //     toneMapping(groundL*transmittance+inscatterL)*(1-waterA)
  // in order to get exactly the end value we want on screen. In practice we
  // cannot know groundL, but we can use an approximate value. The more accurate
  // this value is, the more accurate the end result will be. Here we
  // approximate groundL with 0, because the ground texture near water is likely
  // to already contain water colors, which are quite dark. Using 0 also prevent
  // us from outputing negative values, which would be clamped. So, in the end,
  // we output:
  vec4 pixelShaderColor =
      vec4(toneMapping(waterL * waterA * transmittance + inscatterL,
                       uAtmosphereTweaks.w) -
               toneMapping(inscatterL, uAtmosphereTweaks.w) * (1.0 - waterA),
           waterA);
#endif  // ENABLE_UNDER_WATER_LIGHTING

#ifdef COLOR_DESATURATION
  ApplyColorDesaturation(pixelShaderColor, colorDesaturation.x);
#endif
  return pixelShaderColor;
}

// Implements the abstract function defined in atmosphere.glsllib. This function
// is never called directly or indirectly from main(), but some driver versions
// still complain that the function is 'called but not defined'. We add a dummy
// implementation here as a workaround for this bug.
float atmosphereTweak(float r, float mu) {
  return 1.0;
}
#endif  // ENABLE_IMPROVED_WATER

void main() {
  vec4 water_color = vec4(0.0);

// TODO(b/30766276): There are many visual artifacts with water. For now,
// we just disable the shading of the water surface.
#if 0
#if defined(ENABLE_IMPROVED_WATER)
  water_color = ComputeImprovedWaterColor();
#endif  // ENABLE_IMPROVED_WATER
#endif

#if defined(DRAPED)
  // So texture2DProj does divide by w to give us NDC or -1 to 1 which
  // doesn't work so well with textures that expect 0-1. The following gives
  // us 0-1 after perspective divide:
  // s' / w = (s / w + 1) / 2, s' = (s + w) / 2
  float w = vDrapedTexCoord.z;
  vec2 tc = (vDrapedTexCoord.st + vec2(w)) * .5;
  vec4 draped_color = texture2DProj(uDrapedTexture, vec3(tc, w));
  // Blend in |draped_color|, which has premultiplied alpha.
  water_color = draped_color + (1.0 - draped_color.a) * water_color;
#endif
  // Unmultiply alpha because the water blending does not use premultiplied
  // alpha.
  //
  // TODO(mirth-dev): Can water blending switch to premultiplied alpha?
  if (water_color.a != 0.) {
    water_color.rgb /= water_color.a;
  }
  gl_FragColor = water_color;
}
