#include <SDL_opengl.h>

struct rocktree_t {
	enum texture_format : int {
		texture_format_rgb = 1,
		texture_format_dxt1 = 2,
	};
	struct node_t {
		NodeDataRequest request;
		bool can_have_data;
		std::atomic<bool> downloaded;
		std::atomic<bool> downloading;

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

		Vector3f head_node_center;
		
		std::unique_ptr<BulkMetadata> _metadata;
		std::map<std::string, node_t *> nodes;
		std::map<std::string, bulk_t *> bulks;
	};
	float radius;
	bulk_t *root_bulk;
	std::unique_ptr<PlanetoidMetadata> _metadata;
	std::atomic<bool> downloaded;
};