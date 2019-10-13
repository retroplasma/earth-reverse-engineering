### Example usage with C++

Kudos to [@fabioarnold](https://github.com/fabioarnold)!

#### Compile proto
``` bash
protoc --cpp_out=. rocktree.proto
```

It produces `rocktree.pb.cc` and `rocktree.pb.h`. Some data is still packed after decoding protobuf.

#### Unpack data

Assuming we want an 8-byte vertex-buffer like this
```cpp
#pragma pack(push, 1) 
struct vertex {
	uint8_t x, y, z  // position
	uint8_t w;       // octant mask
	uint16_t u, v;   // texture coordinates
};
#pragma pack(pop)
static_assert((sizeof(vertex) == 8), "vertex size must be 8");
```

And this method for unpacking variable integers in protobuf (or use [coded_stream.h](https://developers.google.com/protocol-buffers/docs/reference/cpp/google.protobuf.io.coded_stream))
```cpp
int unpackVarInt(std::string packed, int* index) {
	int c = 0, d = 1, e;
	do {
		assert(*index < packed.size());
		e = (uint8_t)packed[(*index)++];
		c += (e & 0x7F) * d;
		d <<= 7;
	} while (e & 0x80);
	return c;
}
```

We can unpack vertices from `Mesh.vertices` (XYZ):
```cpp
int unpackVertices(std::string packed, uint8_t** vertices) {
	auto data = (uint8_t*)packed.data();
	auto count = packed.size() / 3;
	auto vtx = new vertex[count];
	uint8_t x = 0, y = 0, z = 0; // 8 bit for % 0x100
	for (auto i = 0; i < count; i++) {
		vtx[i].x = x += data[count * 0 + i];
		vtx[i].y = y += data[count * 1 + i];
		vtx[i].z = z += data[count * 2 + i];
	}
	*vertices = (uint8_t*)vtx;
	return sizeof(vertex) * count;
}
```

And combine them with texture coordinates from `Mesh.texture_coordinates` (UV):
```cpp
void unpackTexCoords(std::string packed, uint8_t* vertices, int vertices_len) {	
	auto data = (uint8_t*)packed.data();
	auto count = vertices_len / sizeof(vertex);
	assert(count * 4 == (packed.size() - 4) && packed.size() >= 4);
	auto u_mod = 1 + *(uint16_t *)(data + 0);
	auto v_mod = 1 + *(uint16_t *)(data + 2);
	data += 4;
	auto vtx = (vertex*)vertices;
	auto u = 0, v = 0;	
	for (auto i = 0; i < count; i++) {
		vtx[i].u = u = (u + data[count * 0 + i] + (data[count * 2 + i] << 8)) % u_mod;
		vtx[i].v = v = (v + data[count * 1 + i] + (data[count * 3 + i] << 8)) % v_mod;
	}
}
```

Indices (`Mesh.indices`) are unpacked to a triangle strip and can be further unpacked to individual triangles
```cpp
int unpackIndices(std::string packed, uint16_t** indices) {
	auto offset = 0;	

	// packed -> triangle strip
	auto triangle_strip_len = unpackVarInt(packed, &offset);
	auto triangle_strip = new uint16_t[triangle_strip_len];
	auto num_non_degenerate_triangles = 0;
	for (int zeros = 0, a, b = 0, c = 0, i = 0; i < triangle_strip_len; i++) {
		int val = unpackVarInt(packed, &offset);
		triangle_strip[i] = (a = b, b = c, c = zeros - val);
		if (a != b && a != c && b != c) num_non_degenerate_triangles++;
		if (0 == val) zeros++;
	}	
	
	// triangle strip -> triangles
	auto triangles_len = 3 * num_non_degenerate_triangles;
	auto triangles = new uint16_t[triangles_len];
	for (int i = 0, j = 0; i < triangle_strip_len - 2; i++) {
		int a = triangle_strip[i + 0];
		int b = triangle_strip[i + 1];
		int c = triangle_strip[i + 2];
		if (a == b || a == c || b == c) continue;
		if (i & 1) {
			triangles[j++] = a;
			triangles[j++] = c;
			triangles[j++] = b;
		} else {
			triangles[j++] = a;
			triangles[j++] = b;
			triangles[j++] = c;
		}
	}

	*indices = triangles;
	delete [] triangle_strip;
	return triangles_len;
}
```

To use normals we need `NodaData.for_normals` first which can be unpacked like this:
```cpp
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
```

Then we can unpack normals for a mesh using `Mesh.normals` indices and our unpacked `for_normals` from above:
```cpp
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
```

Textures are either JPG or CRN-DXT1. To de-crunch the DXT1 you can use [this code](https://github.com/retroplasma/earth-reverse-engineering/tree/23bc8a27fe250798a41545f66f9e21a5ba914e19/client/crn) this way:

```cpp
extern "C" {
  unsigned int crn_get_decompressed_size(const void *src, unsigned int src_size, unsigned int level_index);
  void crn_decompress(const void *src, unsigned int src_size, void *dst, unsigned int dst_size, unsigned int level_index);
}
// ...
  switch(texture.format()) {
    // ...
    case Texture_Format_CRN_DXT1: {
      auto srcSize = (uint)data.size();
      auto src = data.data();
      auto dstSize = crn_get_decompressed_size(src, srcSize, 0);
      auto dst = new uint8_t[dstSize];
      crn_decompress(src, srcSize, dst, dstSize, 0);
      // ... do something with dst (pure DXT1) here ...
      delete[] dst;
      break;
    }
    // ...
  }
// ...
```
