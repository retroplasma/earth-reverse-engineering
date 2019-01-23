// Don't replace these #endif/#if with #elif - this is a workaround for Mali 400
// preprocessor bug.
// Define uniforms, attributes, and varyings based on render mode.
#if defined(WIREFRAME)
uniform vec4 uColor;
#else
varying vec2 vTexCoord;
#endif
#if defined(AGGREGATE)
uniform sampler2D uMeshTextureAtlas;
varying float vUnpopOpacity;
#else
uniform sampler2D uMeshTexture;
uniform float uUnpopOpacity;
#endif
#if defined(DRAPED)
uniform sampler2D uDrapedTexture;
uniform vec4 uDrapedTextureInsetOffsetScale;
varying vec4 vDrapedTexCoord_DoDrape;
#if defined(ENABLE_ROCK_NORMALS)
varying vec2 vDrapedDot;
#else
varying float vDrapedDot;
#endif
#endif
$input "texturefilter.glsllib"

#if defined(ENABLE_ATMOSPHERE)
$input "terrainatmo.fp"
#endif  // if defined(ENABLE_ATMOSPHERE)

#if defined(MIRTH_CLIENT_INJECTED_SHADER_CODE)
varying vec3 vWorldPos;
varying float vPosLatitude;
varying float vPosAltitude;
#endif // #if defined(MIRTH_CLIENT_INJECTED_SHADER_CODE)

#if defined(DRAPED)
vec4 GetDrapedColor(in vec4 mesh_color) {
#if defined(ENABLE_ROCK_NORMALS)
  // Equivalent to .w == 0. || vDrapedDot.x >= 0.
  if (vDrapedTexCoord_DoDrape.w * vDrapedDot.x >= 0.)
    return mesh_color;
  // vDrapedDot.y is dot of vertex normal with "sky" vector. We allow draping
  // on mostly-horizontal surfaces so we drape on bridges and overpasses but not
  // on sides of buildings. .7 is a heuristic that seems to work ok.
  if (vDrapedDot.y < .7)
    return mesh_color;
#else
  // Equivalent to .w == 0. || vDrapedDot.x >= 0.
  if (vDrapedTexCoord_DoDrape.w * vDrapedDot >= 0.)
    return mesh_color;
#endif
  // Go ahead and do 2 texture lookups rather than an if test which could be
  // costly. TODO(b/26144054): Profile different if/ternary arrangements.
  vec4 draped_color = texture2DProj(
      uDrapedTexture, vDrapedTexCoord_DoDrape.xyz);
#if defined(NOTERRAIN_TEXTURE)
  return draped_color;
#else
  // Blend in |draped_color|, which has premultiplied alpha.
  vec4 combined_color = draped_color + (1.0 - draped_color.a) * mesh_color;
  return combined_color;
#endif  // if defined(NOTERRAIN_TEXTURE)
}
#endif  // #if defined(DRAPED)

#if defined(MIRTH_CLIENT_INJECTED_SHADER_CODE)
// Taken from mirth/core/geodesy/srs.cc GetLlaFromXyz().
float ComputeLongitude(in vec3 world_pos) {
  float m_1_pi = 0.31830988618379067154;
  float lon = -1.0 * atan(world_pos.z, world_pos.x) * m_1_pi - 0.5;
  return mod(lon + 1.0, 2.0) - 1.0;
}

  // Do NOT change the following line; we need it to search for this spot.
  //MIRTH_CLIENT_SHADER_BODY
#endif

// Define main() based on render mode.
void main() {
  vec4 color;
  // First get mesh color.
#if defined(WIREFRAME)
  color = uColor;
#else
#if defined(AGGREGATE)
  color = sampleTexture2D_discard_black_texels(uMeshTextureAtlas, vTexCoord);
#else
#if defined(NOTERRAIN_TEXTURE)
  color = vec4(0.);
#else
  color = sampleTexture2D(uMeshTexture, vTexCoord);
#endif  // if defined(NOTERRAIN_TEXTURE)
#endif  // if defined(AGGREGATE)
#endif  // if defined(WIREFRAME)
  // Now get draped color.
#if defined(DRAPED)
  color = GetDrapedColor(color);
#if defined(NOTERRAIN_TEXTURE)
  if (color.w < 0.001) {
    discard;
  } else {
    // Unmultiply alpha because we use a const alpha to blend the occluded KML
    // with the terrain.
    if (color.a != 0.) {
      color.rgb = color.rgb / color.a;
    }
    color.a = min(color.a * 0.5, 0.3);
  }
#endif  // if defined(NOTERRAIN_TEXTURE)
#endif  // if defined(DRAPED)

#if !defined(NOTERRAIN_TEXTURE)
  // Apply atmosphere.
#if defined(ENABLE_ATMOSPHERE)
  color = ComputeAtmosphereColor(color);
#endif
  // Apply unpop opacity.
#if defined(AGGREGATE)
  color.a *= vUnpopOpacity;
#else
  color.a *= uUnpopOpacity;
#endif
#endif  // if !defined(NOTERRAIN_TEXTURE)
#if defined(MIRTH_CLIENT_INJECTED_SHADER_CODE)
  // Longitude needs to be computed in the fragment shader because otherwise
  // it will be incorrectly interpolated across the 180th meridian.
  vec3 posLla = vec3(ComputeLongitude(vWorldPos), vPosLatitude, vPosAltitude);
  color = ClientColorFunction(color, posLla);
#endif
  gl_FragColor = vec4(color.rgb * color.a, color.a);  // Pre-multiplied alpha.
}
