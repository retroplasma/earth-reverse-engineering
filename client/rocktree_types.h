#include <SDL_opengl.h>

enum dl_state : int {
	dl_state_stub = 1,
	dl_state_downloading = 2,
	dl_state_downloaded = 4,	
};

struct rocktree_t {
	enum texture_format : int {
		texture_format_rgb = 1,
		texture_format_dxt1 = 2,
	};
	struct bulk_t;
	struct node_t {
		NodeDataRequest request;
		bool can_have_data;
		std::atomic<dl_state> dl_state;
		bulk_t* parent;

		void setNotDownloadedYet() {
			dl_state = dl_state_stub;
		}

		void setStartedDownloading() {
			if (parent) parent->busy_ctr++;
			dl_state = dl_state_downloading;
		}

		void setFinishedDownloading() {
			dl_state = dl_state_downloaded;
		}

		void setFailedDownloading() {
			dl_state = dl_state_stub;
			if (parent) parent->busy_ctr--;
		}

		void setDeleted() {
			dl_state = dl_state_stub;
			if (parent) parent->busy_ctr--;
		}

		float meters_per_texel;
		OrientedBoundingBox obb;

		std::unique_ptr<NodeData> _data;

		Matrix4d matrix_globe_from_mesh;
		struct mesh_t {
			std::vector<uint8_t> vertices;
			std::vector<uint16_t> indices;
			Vector2f uv_offset;
			Vector2f uv_scale;
			
			std::vector<uint8_t> texture;
			texture_format texture_format;
			int texture_width;
			int texture_height;

			GLuint vertex_buffer;
			GLuint index_buffer;
			GLuint texture_buffer;
			bool buffered;
		};
		std::vector<mesh_t> meshes;
	};
	
	struct bulk_t {
		BulkMetadataRequest request;
		std::atomic<dl_state> dl_state;
		bulk_t* parent;

		void setNotDownloadedYet() {
			dl_state = dl_state_stub;
		}

		void setStartedDownloading() {
			if (parent) parent->busy_ctr++;
			dl_state = dl_state_downloading;
		}

		void setFinishedDownloading() {
			dl_state = dl_state_downloaded;
		}

		void setFailedDownloading() {
			dl_state = dl_state_stub;
			if (parent) parent->busy_ctr--;
		}

		void setDeleted() {
			dl_state = dl_state_stub;
			if (parent) parent->busy_ctr--;
		}

		Vector3f head_node_center;
		
		std::unique_ptr<BulkMetadata> _metadata;
		std::atomic<int> busy_ctr;

		std::map<std::string, std::unique_ptr<node_t>> nodes;
		std::map<std::string, std::unique_ptr<bulk_t>> bulks;
	};
	float radius;
	bulk_t *root_bulk;
	std::unique_ptr<PlanetoidMetadata> _metadata;
	std::atomic<bool> downloaded;
};