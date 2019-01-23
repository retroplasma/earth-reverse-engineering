// Copyright 2012 Google Inc. All Rights Reserved.
// Author: ebruneton@google.com (Eric Bruneton)

$input "atmosphere.glsllib"

// .x = The camera exposure, used for tone mapping (increasing this
// value increases the resulting luminosity of the image). Typical
// values between 20 (at noon) to 200 (for night scenes).
uniform vec2 uExposureAndAtmoTweak;

// Implements the abstract function defined in atmosphere.glsllib. This function
// is never called directly or indirectly from main(), but some driver versions
// still complain that the function is 'called but not defined'. We add a dummy
// implementation here as a workaround for this bug.
float atmosphereTweak(float r, float mu) {
  return 1.0;
}

void main() {
  gl_FragColor = computeInscatter(gl_FragCoord.xy, uExposureAndAtmoTweak.x);
}
