#include <SDL_opengl.h>

struct rocktree_t {
	enum texture_format : int {
		texture_format_rgb = 1,
		texture_format_dxt1 = 2,
	};
	struct bulk_t;
	struct node_t {
		NodeDataRequest request;
		bool can_have_data;
		std::atomic<bool> downloaded;
		std::atomic<bool> downloading;
		bulk_t* parent;

		void setNotDownloadedYet() {
			downloaded = false;
			downloading = false;			
		}

		void setStartedDownloading() {
			if (parent) parent->downloading_ctr++;
			downloading = true;
		}

		void setFinishedDownloading() {
			downloaded = true;
			if (parent) parent->downloaded_ctr++;
			downloading = false;
			if (parent) parent->downloading_ctr--;
		}

		void setFailedDownloading() {
			downloading = false;
			if (parent) parent->downloading_ctr--;
		}

		void setDeleted() {
			downloaded = false;			
			if (parent) parent->downloaded_ctr--;
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
		std::atomic<bool> downloaded;
		std::atomic<bool> downloading;
		bulk_t* parent;

		void setNotDownloadedYet() {
			downloaded = false;
			downloading = false;			
		}

		void setStartedDownloading() {
			if (parent) parent->downloading_ctr++;
			downloading = true;
		}

		void setFinishedDownloading() {
			downloaded = true;
			if (parent) parent->downloaded_ctr++;
			downloading = false;
			if (parent) parent->downloading_ctr--;
		}

		void setFailedDownloading() {
			downloading = false;
			if (parent) parent->downloading_ctr--;
		}

		void setDeleted() {
			downloaded = false;
			if (parent) parent->downloaded_ctr--;
		}

		Vector3f head_node_center;
		
		std::unique_ptr<BulkMetadata> _metadata;

		std::atomic<int> downloading_ctr;
		std::atomic<int> downloaded_ctr;

		std::map<std::string, std::unique_ptr<node_t>> nodes;
		std::map<std::string, std::unique_ptr<bulk_t>> bulks;
	};
	float radius;
	bulk_t *root_bulk;
	std::unique_ptr<PlanetoidMetadata> _metadata;
	std::atomic<bool> downloaded;
};