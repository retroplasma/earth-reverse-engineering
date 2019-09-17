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

void createDir(const char* path) {
#ifdef _WIN32
	_mkdir(path);
#else
	mkdir(path, (mode_t)0755);
#endif
}

bool readFile(const char* file_path, unsigned char** data, size_t* len) {
	FILE* file = fopen(file_path, "rb");
	if (!file) return false;
	fseek(file, 0, SEEK_END);
	*len = ftell(file);
	*data = (unsigned char*)malloc(*len);
	fseek(file, 0, SEEK_SET);
	fread(*data, *len, 1, file);
	fclose(file);
	return true;
}

void writeFile(const char* file_path, unsigned char* data, size_t len) {
	FILE* file = fopen(file_path, "wb");
	if (!file) return;
	fwrite(data, len, 1, file);
	fclose(file);
}

void imageHalve(unsigned char* pixels, int width, int height, int comp, unsigned char* out) {
	assert(width > 1 && height > 1);
	int half_width  = width  / 2;
	int half_height = height / 2;
	for (int y = 0; y < half_height; y++) {
		for (int x = 0; x < half_width; x++) {
			for (int ci = 0; ci < comp; ci++) {
				int c = (int)(pixels[comp * (width * (2 * y + 0) + (2 * x + 0)) + ci]
							+ pixels[comp * (width * (2 * y + 0) + (2 * x + 1)) + ci]
							+ pixels[comp * (width * (2 * y + 1) + (2 * x + 0)) + ci]
							+ pixels[comp * (width * (2 * y + 1) + (2 * x + 1)) + ci]);
				out[comp * (half_width * y + x) + ci] = (unsigned char)(c / 4);
			}
		}
	}
}

void imageHalveHorizontally(unsigned char* pixels, int width, int height, int comp, unsigned char* out) {
	assert(width > 1);
	int half_width = width  / 2;
	for (int y = 0; y < height; y++) {
		for (int x = 0; x < half_width; x++) {
			for (int ci = 0; ci < comp; ci++) {
				int c = (int)(pixels[comp * (width * y + 2 * x + 0) + ci]
							+ pixels[comp * (width * y + 2 * x + 1) + ci]);
				out[comp * (half_width * y + x) + ci] = (unsigned char)(c / 2);
			}
		}
	}
}

void imageHalveVertically(unsigned char* pixels, int width, int height, int comp, unsigned char* out) {
	assert(height > 1);
	int half_height = height / 2;
	for (int y = 0; y < half_height; y++) {
		for (int x = 0; x < width; x++) {
			for (int ci = 0; ci < comp; ci++) {
				int c = (int)(pixels[comp * (width * (2 * y + 0) + x) + ci]
							+ pixels[comp * (width * (2 * y + 1) + x) + ci]);
				out[comp * (width * y + x) + ci] = (unsigned char)(c / 2);
			}
		}
	}
}

bool intersectRaySphere(vec3_t ro, vec3_t rd, vec3_t s, float r, float* t) {
	vec3_t m;
	VectorSubtract(ro, s, m);
	float b = DotProduct(m, rd);
	float c = DotProduct(m, m) - r * r;
	if (c > 0.0f && b > 0.0f) return false;
	float discr = b * b - c;
	if (discr < 0.0f) return false;
	*t = -b - sqrtf(discr);
	return true;
}
