#ifdef EMSCRIPTEN
#include <emscripten/fetch.h>

struct x {
	int i;
	void (*thunk)(int i, int error, uint8_t *d, size_t l);
};

// if you want to retain the data you need to copy it
void downloadSucceeded(emscripten_fetch_t *fetch) {
  auto xx = (x*)(fetch->userData);
  xx->thunk(xx->i, 0, (uint8_t*)fetch->data, (size_t)fetch->numBytes);
  delete xx;
  emscripten_fetch_close(fetch);
}

void downloadFailed(emscripten_fetch_t *fetch) {
  //fprintf(stderr, "Downloading %s failed, HTTP failure status code: %d.\n", fetch->url, fetch->status);  
  auto xx = (x*)(fetch->userData);
  xx->thunk(xx->i, 1, NULL, 0);
  delete xx;
  emscripten_fetch_close(fetch);
}

void fetchData(const char* path, int i, void (*thunk)(int i, int error, uint8_t *d, size_t l)) {
	const char* base_url = "https://kh.google.com/rt/earth/";
	char* url = (char*)malloc(strlen(base_url) + strlen(path) + 1);
	strcpy(url, base_url); strcat(url, path);

	emscripten_fetch_attr_t attr;
	emscripten_fetch_attr_init(&attr);

	auto xx = new x();
	xx->i = i;
	xx->thunk = thunk;
	attr.userData = (void*)xx;

	strcpy(attr.requestMethod, "GET");
	attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
	attr.onsuccess = downloadSucceeded;
	attr.onerror = downloadFailed;
	emscripten_fetch(&attr, url);
	return;	
}
#else

#define HTTP_IMPLEMENTATION
#include "http.h"

std::once_flag cache_init_once_flag;

static const auto cache_pfx = "cache/";
static const auto cache_pfx_len = strlen(cache_pfx); // without 0
void createDir(const char* path);
bool readFile(const char* file_path, unsigned char** data, size_t* len);
void writeFile(const char* file_path, unsigned char* data, size_t len);

void fetchData(const char* path, int i, void (*thunk)(int i, int error, uint8_t *d, size_t l)) {
	
	std::call_once(cache_init_once_flag, [](){		
		createDir(cache_pfx);
		createDir((std::string(cache_pfx) + "BulkMetadata").c_str());
		createDir((std::string(cache_pfx) + "NodeData").c_str());
	});

	auto use_cache = path[0] != 'P'; // don't cache planetoid

	char *cache_path = (char*)malloc(cache_pfx_len + strlen(path) + 1);
	sprintf(cache_path, "%s%s", cache_pfx, path);
	{
		unsigned char* data; size_t len;
		if (use_cache && readFile(cache_path, &data, &len)) {
			thunk(i, 0, data, len);
			free(data);
			free(cache_path);
			return;
		}	
	}
	
	const char* base_url = "http://kh.google.com/rt/earth/";
	char* url = (char*)malloc(strlen(base_url) + strlen(path) + 1);
	strcpy(url, base_url); strcat(url, path);	

	//printf("GET %s\n", url);
	http_t* request = http_get(url, NULL); 
	free(url);
	if (!request) {
		thunk(i, 1, NULL, 0);
		free(cache_path);
		return;
	}
	
	http_status_t status;
	do {
		status = http_process(request);
		SDL_Delay(1);
	} while (status == HTTP_STATUS_PENDING);

	if (status == HTTP_STATUS_FAILED) {
		http_release(request);
		thunk(i, 1, NULL, 0);
		free(cache_path);
		return;
	}

	auto data = (unsigned char*)malloc(request->response_size);
	auto len = request->response_size;
	memcpy(data, request->response_data, len);
	
	http_release(request);
	thunk(i, 0, data, len);

	if (use_cache) {
		writeFile(cache_path, data, len);
	}
	free(data);
	free(cache_path);
}

void createDir(const char* path) {
#ifdef _WIN32
	_mkdir(path);
#else
	mkdir(path, (mode_t)0755);
#endif
}

bool readFile(const char* file_path, unsigned char** data, size_t* len) {
	return false;
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
	return;
	FILE* file = fopen(file_path, "wb");
	if (!file) return;
	fwrite(data, len, 1, file);
	fclose(file);
}
#endif