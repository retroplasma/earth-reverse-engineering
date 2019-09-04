#include <SDL.h>
#include <SDL_opengl.h>

#define HTTP_IMPLEMENTATION
#include "http.h"

#include "proto/rocktree.pb.h"
#include "proto/rocktree.pb.cc"
using namespace geo_globetrotter_proto_rocktree;

const int MAX_LEVEL = 20;

typedef struct {
	double n, s, w, e;
} llbounds_t;

void latLonToOctant(double lat, double lon, char octant[MAX_LEVEL]) {
	octant[0] = 0;
	octant[1] = 0;
	llbounds_t box;

	if (lat < 0.0) { octant[1] |= 2; box.n = 0.0; box.s = -90.0;}
	else { octant[0] |= 2; box.n = 90.0; box.s = 0.0; }

	if (lon < -90.0) { box.w = -180.0; box.e = -90.0; }
	else if (lon < 0.0) { octant[1] |= 1; box.w = -90.0; box.e = 0.0; }
	else if (lon < 90.0) { octant[0] |= 1; box.w = 0.0; box.e = 90.0; }
	else { octant[0] |= 1; octant[1] |= 1; box.w = 90.0; box.e = 180.0; }

	int level = MAX_LEVEL;
	for (int i = 2; i < level; i++) {
		octant[i] = 0;

		double mid_lat = (box.n + box.s) / 2.0;
		double mid_lon = (box.w + box.e) / 2.0;

		if (lat < mid_lat) {
			box.n = mid_lat;
		} else {
			box.s = mid_lat;
			octant[i] |= 2;
		}

		if (lon < mid_lon) {
			box.e = mid_lon;
		} else {
			box.w = mid_lon;
			octant[i] |= 1;
		}
	}

	// to ascii
	for (int i = 0; i < level; i++) octant[i] += '0';
}

void getPathAndFlags(int path_id, char path[], int* level, int* flags) {
	*level = 1 + (path_id & 3);
	path_id >>= 2;
	for (int i = 0; i < *level; i++) {
		path[i] = '0' + (path_id & 7);
		path_id >>= 3;
	}
	*flags = path_id;
}

bool fetchData(const char* path, unsigned char** data, size_t* len) {
	const char* base_url = "http://kh.google.com/rt/earth/";
	char* url = (char*)malloc(strlen(base_url) + strlen(path) + 1);
	strcpy(url, base_url); strcat(url, path);
	printf("GET %s\n", url);
	http_t* request = http_get(url, NULL); 
	free(url);
	if (!request) return false;
	
	http_status_t status;
	do {
		status = http_process(request);
		SDL_Delay(1);
	} while (status == HTTP_STATUS_PENDING);

	if (status == HTTP_STATUS_FAILED) {
		http_release(request);
		return false;
	}

	*data = (unsigned char*)malloc(request->response_size);
	*len = request->response_size;
	memcpy(*data, request->response_data, *len);
	
	http_release(request);
	return true;
}

PlanetoidMetadata* getPlanetoid() {
	unsigned char* data; size_t len;
	if (fetchData("PlanetoidMetadata", &data, &len)) {
		PlanetoidMetadata* planetoid = new PlanetoidMetadata();
		if (planetoid->ParseFromArray(data, len)) {
			free(data);
			return planetoid;
		} else {
			free(data);
			delete planetoid;
		}
	}
	return NULL;
}

BulkMetadata* getBulk(const char* path, int epoch) {
	char url_buf[200];
	sprintf(url_buf, "BulkMetadata/pb=!1m2!1s%s!2u%d", path, epoch);
	unsigned char* data; size_t len;
	if (fetchData(url_buf, &data, &len)) {
		BulkMetadata* bulk = new BulkMetadata();
		if (bulk->ParseFromArray(data, len)) {
			free(data);
			return bulk;
		} else {
			free(data);
			delete bulk;
		}
	}
	return NULL;
}

NodeData* getNode(const char* path, int epoch, int texture_format, int imagery_epoch) {
	char url_buf[200];
	sprintf(url_buf, "NodeData/pb=!1m2!1s%s!2u%d!2e%d!3u%d!4b0", path, epoch, texture_format, imagery_epoch);
	unsigned char* data; size_t len;
	if (fetchData(url_buf, &data, &len)) {
		NodeData* node = new NodeData();
		if (node->ParseFromArray(data, len)) {
			free(data);
			return node;
		} else {
			free(data);
			delete node;
		}
	}
	return NULL;
}

int unpackInt(std::string packed, int* index) {
	int c = 0, d = 1;
	int e;
	do {
		e = (unsigned char)packed[(*index)++];
		c += (e & 0x7F) * d;
		d <<= 7;
	} while (e & 0x80);
	return c;
}

// from minified js
int unpackIndices(std::string packed, unsigned short** indices) {
	int i = 0;
	int e = unpackInt(packed, &i);
	*indices = new unsigned short[e];
	for (int k = 0, g = 0, m, p = 0, v = 0, z = 0; z < e; z++) {
		int B = unpackInt(packed, &i);
		m = p;
		p = v;
		v = k - B;
		(*indices)[z] = v;
		m != p && p != v && m != v && g++;
		B || k++;
	}
	// g == numNonDegenerateTriangles
	return e;
}

// from minified js (only positions)
int unpackVertices(std::string packed, unsigned char** vertices) {
	int i = 0;
	int h = packed.size();
	int k = h / 3;
	*vertices = new unsigned char[8 * k];
	for (int m = 0; m < 3; m++) { // m == stride
		int p = (unsigned char)packed[i++];
		(*vertices)[m] = p;
		for (int v = 1; v < k; v++) {
			p = (p + packed[i++]) & 0xFF;
			(*vertices)[8 * v + m] = p;
		}
	}
	return 8 * k;
}

// from minified js
void unpackTexCoords(std::string packed, unsigned char* vertices, int vertices_len) {
	int h = vertices_len / 8;

	int i = 0;
	int k = (unsigned char)packed[i++];
	k += (unsigned char)packed[i++] << 8; // 65535
	int g = (unsigned char)packed[i++];
	g += (unsigned char)packed[i++] << 8; // 65535
	int m = 0, p = 0;
	for (int B = 0; B < h; B++) {
		m = (m + ((unsigned char)packed[i + 0 * h + B] + 
				 ((unsigned char)packed[i + 2 * h + B] << 8))) & k; // 18418
		p = (p + ((unsigned char)packed[i + 1 * h + B] + 
				 ((unsigned char)packed[i + 3 * h + B] << 8))) & g; // 49234
		int A = 8 * B + 4;
		vertices[A + 0] = m & 0xFF;
		vertices[A + 1] = m >> 8;
		vertices[A + 2] = p & 0xFF;
		vertices[A + 3] = p >> 8;
	}
}

int main(int argc, char* argv[]) {
	PlanetoidMetadata* planetoid = getPlanetoid();
	printf("earth radius: %f\n", planetoid->radius());
	int root_epoch = planetoid->root_node_metadata().epoch();
	BulkMetadata* root_bulk = getBulk("", root_epoch);
	printf("%d root metas\n", root_bulk->node_metadata().size());
	//printf("head node key path: %s epoch: %d\n", root_bulk->head_node_key().path().c_str(), root_bulk->head_node_key().epoch());
	for (auto node_meta : root_bulk->node_metadata()) {
		char path[MAX_LEVEL+1];
		int level, flags;
		getPathAndFlags(node_meta.path_and_flags(), path, &level, &flags);
		path[level] = '\0';
		printf("path %.*s flag %d\n", level, path, flags);

		if (!(flags & NodeMetadata_Flags_NODATA)) {
			int imagery_epoch = node_meta.imagery_epoch();
			if (flags & NodeMetadata_Flags_USE_IMAGERY_EPOCH) {
				imagery_epoch = root_bulk->default_imagery_epoch();
			}
			NodeData* node = getNode(path, root_epoch, Texture_Format_JPG, imagery_epoch);
			if (node) {
				for (auto mesh : node->meshes()) {
					unsigned short* indices;
					unsigned char* vertices;
					int indices_len = unpackIndices(mesh.indices(), &indices); // big endian u16
					int vertices_len = unpackVertices(mesh.vertices(), &vertices);
					unpackTexCoords(mesh.texture_coordinates(), vertices, vertices_len);
					for (int i = 0; i < vertices_len; i += 8) {
						printf("x: %d y: %d z: %d\n", 
							vertices[i + 0],
							vertices[i + 1],
							vertices[i + 2]);
					}
				}
				delete node;
			}
		}

		// next level
		if (level == 4 && !(flags & NodeMetadata_Flags_LEAF)) { // bulk
			BulkMetadata* bulk = getBulk(path, root_epoch);
			if (bulk != NULL) {
				printf("metas %d\n", bulk->node_metadata().size());
				for (auto meta2 : bulk->node_metadata()) {
					getPathAndFlags(meta2.path_and_flags(), path, &level, &flags);
				}
				delete bulk;
			}
		}
	}
	
	return 0;
}