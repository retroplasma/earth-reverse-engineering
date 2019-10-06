#include <math.h>
const int MAX_LEVEL = 20;

// unpackVarInt unpacks variable length integer from proto (like coded_stream.h)
int unpackVarInt(std::string packed, int* index) {
	auto data = (uint8_t*)packed.data();
	auto size = packed.size();
	int c = 0, d = 1, e;
	do {
		assert(*index < size);
		e = data[(*index)++];
		c += (e & 0x7F) * d;
		d <<= 7;
	} while (e & 0x80);
	return c;
}

// vertex is a packed struct for an 8-byte-per-vertex array
#pragma pack(push, 1) 
struct vertex_t {
	uint8_t x, y, z; // position
	uint8_t w;       // octant mask
	uint16_t u, v;   // texture coordinates
};
#pragma pack(pop)
static_assert((sizeof(vertex_t) == 8), "vertex_t size must be 8");

// unpackVertices unpacks vertices XYZ to new 8-byte-per-vertex array
std::vector<uint8_t> unpackVertices(std::string packed) {
	auto data = (uint8_t*)packed.data();
	auto count = packed.size() / 3;
	auto vertices = std::vector<uint8_t>(count * sizeof(vertex_t));
	auto vtx = (vertex_t*)vertices.data();
	uint8_t x = 0, y = 0, z = 0; // 8 bit for % 0x100
	for (auto i = 0; i < count; i++) {
		vtx[i].x = x += data[count * 0 + i];
		vtx[i].y = y += data[count * 1 + i];
		vtx[i].z = z += data[count * 2 + i];
	}
	return vertices;
}

// unpackTexCoords unpacks texture coordinates UV to 8-byte-per-vertex-array
void unpackTexCoords(std::string packed, uint8_t* vertices, int vertices_len, Vector2f &uv_offset, Vector2f &uv_scale) {	
	auto data = (uint8_t*)packed.data();
	auto count = vertices_len / sizeof(vertex_t);
	assert(count * 4 == (packed.size() - 4) && packed.size() >= 4);
	auto u_mod = 1 + *(uint16_t *)(data + 0);
	auto v_mod = 1 + *(uint16_t *)(data + 2);
	data += 4;
	auto vtx = (vertex_t*)vertices;
	auto u = 0, v = 0;
	for (auto i = 0; i < count; i++) {
		vtx[i].u = u = (u + data[count * 0 + i] + (data[count * 2 + i] << 8)) % u_mod;
		vtx[i].v = v = (v + data[count * 1 + i] + (data[count * 3 + i] << 8)) % v_mod;
	}
	
	uv_offset[0] = 0.5;
	uv_offset[1] = 0.5;
	uv_scale[0] = 1.0 / u_mod;
	uv_scale[1] = 1.0 / v_mod;
}

// unpackIndices unpacks indices to triangle strip
std::vector<uint16_t> unpackIndices(std::string packed) {
	auto offset = 0;	

	auto triangle_strip_len = unpackVarInt(packed, &offset);
	auto triangle_strip = std::vector<uint16_t>(triangle_strip_len);
	auto num_non_degenerate_triangles = 0;
	for (int zeros = 0, a, b = 0, c = 0, i = 0; i < triangle_strip_len; i++) {
		int val = unpackVarInt(packed, &offset);
		triangle_strip[i] = (a = b, b = c, c = zeros - val);
		if (a != b && a != c && b != c) num_non_degenerate_triangles++;
		if (0 == val) zeros++;
	}	
	
	return triangle_strip;
}

// unpackOctantMaskAndOctantCountsAndLayerBounds unpacks the octant mask for vertices (W) and layer bounds and octant counts
void unpackOctantMaskAndOctantCountsAndLayerBounds(const std::string packed, const uint16_t *indices, int indices_len, uint8_t *vertices, int vertices_len, int layer_bounds[10])
{
	// todo: octant counts
	auto offset = 0;
	auto len = unpackVarInt(packed, &offset);
	auto idx_i = 0;
	auto k = 0;
	auto m = 0;

	for (auto i = 0; i < len; i++) {
		if (0 == i % 8) {
			assert(m < 10);
			layer_bounds[m++] = k;
		}
		auto v = unpackVarInt(packed, &offset);
		for (auto j = 0; j < v; j++) {
			auto idx = indices[idx_i++];
			assert(0 <= idx && idx < indices_len);
			auto vtx_i = idx;
			assert(0 <= vtx_i && vtx_i < vertices_len / sizeof(vertex_t));
			((vertex_t *)vertices)[vtx_i].w = i & 7;
		}
		k += v;
	}

	for (; 10 > m; m++) layer_bounds[m] = k;
}

// unpackForNormals unpacks normals info for later mesh normals usage
int unpackForNormals(const NodeData nodeData, uint8_t**unpacked_for_normals)
{
	auto f1 = [](int v, int l) {
		if (4 >= l)
			return (v << l) + (v & (1 << l) - 1);
		if (6 >= l) {
			auto r = 8 - l;
			return (v << l) + (v << l >> r) + (v << l >> r >> r) + (v << l >> r >> r >> r);
		}
		return -(v & 1);
	};
	auto f2 = [](double c) {
		auto cr = (int)round(c);
		if (cr < 0) return 0;
		if (cr > 255) return 255;
		return cr;
	};
	assert(nodeData.has_for_normals());
	auto input = nodeData.for_normals();
	auto data = (uint8_t*)input.data();
	auto size = input.size();
	assert(size > 2);
	auto count = *(uint16_t*)data;
	assert(count * 2 == size - 3);
	int s = data[2];
	data += 3;

	auto output = new uint8_t[3 * count];
	
	for (auto i = 0; i < count; i++) {
		double a = f1(data[0 + i], s) / 255.0;
		double f = f1(data[count + i], s) / 255.0;
			
		double b = a, c = f, g = b + c, h = b - c;
		int sign = 1;

		if (!(.5 <= g && 1.5 >= g && -.5 <= h && .5 >= h)) {
			sign = -1;
			if (.5 >= g) {
				b = .5 - f;
				c = .5 - a;
			} else {
				if (1.5 <= g) {
					b = 1.5 - f;
					c = 1.5 - a;
				} else {
					if (-.5 >= h) {
						b = f - .5;
						c = a + .5;
					} else {
						b = f + .5;
						c = a - .5;
					}
				}
			}
			g = b + c;
			h = b - c;
		}
		
		a = fmin(fmin(2 * g - 1, 3 - 2 * g), fmin(2 * h + 1, 1 - 2 * h)) * sign;
		b = 2 * b - 1;
		c = 2 * c - 1;
		auto m = 127 / sqrt(a * a + b * b + c * c);

		output[3 * i + 0] = f2(m * a + 127);
		output[3 * i + 1] = f2(m * b + 127);
		output[3 * i + 2] = f2(m * c + 127);		
	}

	*unpacked_for_normals = output;
	return 3 * count;
}

// unpackNormals unpacks normals indices in mesh using normal data from NodeData
int unpackNormals(const Mesh mesh, const uint8_t*unpacked_for_normals, int unpacked_for_normals_len, uint8_t**unpacked_normals)
{
	auto normals = mesh.normals();
	uint8_t *new_normals = NULL;
	int count = 0;
	if (mesh.has_normals() && unpacked_for_normals) {
		count = normals.size() / 2;		
		new_normals = new uint8_t[4 * count];
		auto input = (uint8_t*)normals.data();
		for (auto i = 0; i < count; ++i) {
			int j = input[i] + (input[count + i] << 8);
			assert(3 * j + 2 < unpacked_for_normals_len);
			new_normals[4 * i + 0] = unpacked_for_normals[3 * j + 0];
			new_normals[4 * i + 1] = unpacked_for_normals[3 * j + 1];
			new_normals[4 * i + 2] = unpacked_for_normals[3 * j + 2];
			new_normals[4 * i + 3] = 0;			
		}
	} else {
		count = (mesh.vertices().size() / 3) * 8;
		new_normals = new uint8_t[4 * count];
		for (auto i = 0; i < count; ++i) {
			new_normals[4 * i + 0] = 127;
			new_normals[4 * i + 1] = 127;
			new_normals[4 * i + 2] = 127;
			new_normals[4 * i + 3] = 0;;
		}
	}
	*unpacked_normals = new_normals;
	return 4 * count;
}

struct node_data_path_and_flags_t {
	char path[MAX_LEVEL+1];	
	int flags;
	int level;
};

// unpackPathAndFlags unpacks path, flags and level (strlen(path)) from node metadata
node_data_path_and_flags_t unpackPathAndFlags(NodeMetadata node_meta) {

	auto getPathAndFlags = [](int path_id, char path[], int* level, int* flags) {
		*level = 1 + (path_id & 3);
		path_id >>= 2;
		for (int i = 0; i < *level; i++) {
			path[i] = '0' + (path_id & 7);
			path_id >>= 3;
		}
		*flags = path_id;
	};

	node_data_path_and_flags_t result;
	getPathAndFlags(node_meta.path_and_flags(), result.path, &result.level, &result.flags);
	result.path[result.level] = '\0';

	return result;
}

struct OrientedBoundingBox {
	Vector3d center;
	Vector3d extents;
	Matrix3d orientation;
};

OrientedBoundingBox unpackObb(std::string packed, Vector3f head_node_center, float meters_per_texel) {
	assert(packed.size() == 15);
	auto data = (uint8_t*)packed.data();
	OrientedBoundingBox obb;
	obb.center[0] = *(int16_t *)(data + 0) * meters_per_texel + head_node_center[0];
	obb.center[1] = *(int16_t *)(data + 2) * meters_per_texel + head_node_center[1];
	obb.center[2] = *(int16_t *)(data + 4) * meters_per_texel + head_node_center[2];
	obb.extents[0] = *(uint8_t *)(data + 6) * meters_per_texel;
	obb.extents[1] = *(uint8_t *)(data + 7) * meters_per_texel;
	obb.extents[2] = *(uint8_t *)(data + 8) * meters_per_texel;
	Vector3f euler;
	euler[0] = *(uint16_t *)(data + 9) * M_PI / 32768.0f;
	euler[1] = *(uint16_t *)(data + 11) * M_PI / 65536.0f;
	euler[2] = *(uint16_t *)(data + 13) * M_PI / 32768.0f;
	double c0 = cosf(euler[0]);
	double s0 = sinf(euler[0]);
	double c1 = cosf(euler[1]);
	double s1 = sinf(euler[1]);
	double c2 = cosf(euler[2]);
	double s2 = sinf(euler[2]);
	auto orientation = obb.orientation.data();
	orientation[0] = c0 * c2 - c1 * s0 * s2;
	orientation[1] = c1 * c0 * s2 + c2 * s0;
	orientation[2] = s2 * s1;
	orientation[3] = -c0 * s2 - c2 * c1 * s0;
	orientation[4] = c0 * c1 * c2 - s0 * s2;
	orientation[5] = c2 * s1;
	orientation[6] = s1 * s0;
	orientation[7] = -c0 * s1;
	orientation[8] = c1;

	return obb;
}