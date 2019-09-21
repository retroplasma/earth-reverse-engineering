typedef float vec3_t[3];
typedef float vec4_t[4];
typedef float mat3_t[9];
typedef float mat4_t[16];

void VectorAdd(vec3_t a, vec3_t b, vec3_t out) {
	out[0] = a[0] + b[0];
	out[1] = a[1] + b[1];
	out[2] = a[2] + b[2];
}

void VectorSubtract(vec3_t a, vec3_t b, vec3_t out) {
	out[0] = a[0] - b[0];
	out[1] = a[1] - b[1];
	out[2] = a[2] - b[2];
}

void VectorCopy(vec3_t in, vec3_t out) {
	out[0] = in[0];
	out[1] = in[1];
	out[2] = in[2];
}

void VectorScale(vec3_t in, float scale, vec3_t out) {
	out[0] = in[0] * scale;
	out[1] = in[1] * scale;
	out[2] = in[2] * scale;
}

float DotProduct(vec3_t v0, vec3_t v1) {
	return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
}

void CrossProduct(vec3_t v0, vec3_t v1, vec3_t out) {
	out[0] = v0[1] * v1[2] - v0[2] * v1[1];
	out[1] = v0[2] * v1[0] - v0[0] * v1[2];
	out[2] = v0[0] * v1[1] - v0[1] * v1[0];
}

float VectorLength(vec3_t v) {
	return sqrtf(DotProduct(v, v));
}

void VectorNormalize(vec3_t v) {
	float len = VectorLength(v);
	VectorScale(v, 1.0f / len, v);
}

void MatrixIdentity(mat4_t out) {
	out[0] = 1.0f; out[1] = 0.0f; out[2] = 0.0f; out[3] = 0.0f;
	out[4] = 0.0f; out[5] = 1.0f; out[6] = 0.0f; out[7] = 0.0f;
	out[8] = 0.0f; out[9] = 0.0f; out[10] = 1.0f; out[11] = 0.0f;
	out[12] = 0.0f; out[13] = 0.0f; out[14] = 0.0f; out[15] = 1.0f;
}

void MatrixCopy(mat4_t in, mat4_t out) {
	memcpy(out, in, sizeof(mat4_t));
}

void MatrixCopy34(mat3_t in, mat4_t out) {
	out[0] = in[0]; out[1] = in[1]; out[2] = in[2]; out[3] = 0.0f;
	out[4] = in[3]; out[5] = in[4]; out[6] = in[5]; out[7] = 0.0f;
	out[8] = in[6]; out[9] = in[7]; out[10] = in[8]; out[11] = 0.0f;
	out[12] = 0.0f; out[13] = 0.0f; out[14] = 0.0f; out[15] = 1.0f;
}

void MatrixTranspose(mat4_t m) {
	float tmp;
#define MATVALUESWAP(i, j) tmp = m[i]; m[i] = m[j]; m[j] = tmp;
	MATVALUESWAP(1, 4);
	MATVALUESWAP(2, 8);
	MATVALUESWAP(3, 12);
	MATVALUESWAP(6, 9);
	MATVALUESWAP(7, 13);
	MATVALUESWAP(11, 14);
#undef MATVALUESWAP
}

void MatrixTranslation(vec3_t t, mat4_t out) {
	out[0] = 1.0f; out[1] = 0.0f; out[2] = 0.0f; out[3] = 0.0f;
	out[4] = 0.0f; out[5] = 1.0f; out[6] = 0.0f; out[7] = 0.0f;
	out[8] = 0.0f; out[9] = 0.0f; out[10] = 1.0f; out[11] = 0.0f;
	out[12] = t[0]; out[13] = t[1]; out[14] = t[2]; out[15] = 1.0f;
}

void MatrixScale(vec3_t s, mat4_t out) {
	out[0] = s[0]; out[1] = 0.0f; out[2] = 0.0f; out[3] = 0.0f;
	out[4] = 0.0f; out[5] = s[1]; out[6] = 0.0f; out[7] = 0.0f;
	out[8] = 0.0f; out[9] = 0.0f; out[10] = s[2]; out[11] = 0.0f;
	out[12] = 0.0f; out[13] = 0.0f; out[14] = 0.0f; out[15] = 1.0f;
}

void MatrixRotation(vec3_t axis, float angle, mat4_t out) {
	float c = cosf(angle), s = sinf(angle);
	vec3_t w; VectorScale(axis, 1.0f - c, w);
	out[0] = c + w[0] * axis[0]; out[1] = w[0] * axis[1] + s * axis[2]; out[2] = w[0] * axis[2] - s * axis[1]; out[3] = 0.0f;
	out[4] = w[1] * axis[0] - s * axis[2]; out[5] = c + w[1] * axis[1]; out[6] = w[1] * axis[2] + s * axis[0]; out[7] = 0.0f;
	out[8] = w[2] * axis[0] + s * axis[1]; out[9] = w[2] * axis[1] - s * axis[0]; out[10] = c + w[2] * axis[2]; out[11] = 0.0f;
	out[12] = 0.0f; out[13] = 0.0f; out[14] = 0.0f; out[15] = 1.0f;
}

void MatrixFrustum(float l, float r, float b, float t, float n, float f, mat4_t out) {
	out[0] = 2.0f * n / (r - l); out[1] = 0.0f; out[2] = 0.0f; out[3] = 0.0f;
	out[4] = 0.0f; out[5] = 2.0f * n / (t - b); out[6] = 0.0f; out[7] = 0.0f;
	out[8] = (r + l) / (r - l); out[9] = (t + b) / (t - b); out[10] = -(f + n) / (f - n); out[11] = -1.0f;
	out[12] = 0.0f; out[13] = 0.0f; out[14] = -(2.0f * f * n) / (f - n); out[15] = 0.0f;
}

void MatrixOrtho(float l, float r, float b, float t, float n, float f, mat4_t out) {
    out[0] = 2.0f / (r - l); out[1] = 0.0f; out[2] = 0.0f; out[3] = 0.0f;
    out[4] = 0.0f; out[5] = 2.0f / (t - b); out[6] = 0.0f; out[7] = 0.0f;
	out[8] = 0.0f; out[9] = 0.0f; out[10] = -2.0f / (f - n); out[11] = 0.0f;
    out[12] = -(r + l) / (r - l); out[13] = -(t + b) / (t - b); out[14] = (f + n) / (f - n); out[15] = 1.0f;
}

void MatrixMultiply(mat4_t a, mat4_t b, mat4_t out) {
	for (int col = 0; col < 4; col++) {
		for (int row = 0; row < 4; row++) {
			out[4 * col + row] = 
				a[4 * 0 + row] * b[4 * col + 0] + 
				a[4 * 1 + row] * b[4 * col + 1] + 
				a[4 * 2 + row] * b[4 * col + 2] + 
				a[4 * 3 + row] * b[4 * col + 3];
		}
	}
}

void MatrixMultiplyPosition(mat4_t m, vec3_t v, vec3_t out) {
	out[0] = m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12];
	out[1] = m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13];
	out[2] = m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14];
}