#include <SDL_opengl.h>

struct gl_ctx_t {
	GLuint program;
	GLint transform_loc;
	GLint uv_offset_loc;
	GLint uv_scale_loc;
	GLint octant_mask_loc;
	GLint texture_loc;
	GLint position_loc;
	GLint octant_loc;
	GLint texcoords_loc;
};

void meshTexImage2d(const rocktree_t::node_t::mesh_t &mesh) {
	switch (mesh.texture_format) {
	case rocktree_t::texture_format_rgb:
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, mesh.texture_width, mesh.texture_height, 0, GL_RGB, GL_UNSIGNED_BYTE, mesh.texture.data());
		break;
	case rocktree_t::texture_format_dxt1:
		glCompressedTexImage2D(GL_TEXTURE_2D, 0, GL_COMPRESSED_RGB_S3TC_DXT1_EXT, mesh.texture_width, mesh.texture_height, 0, mesh.texture.size(), mesh.texture.data());
		break;
	default:
		fprintf(stderr, "unsupported texture format: %d\n", mesh.texture_format);
		abort();
	}	
}

void bufferMesh(rocktree_t::node_t::mesh_t &mesh) {
	if (mesh.buffered) fprintf(stderr, "mesh already buffered\n"), abort();

	glGenBuffers(1, &mesh.vertex_buffer);						
	glBindBuffer(GL_ARRAY_BUFFER, mesh.vertex_buffer);
	glBufferData(GL_ARRAY_BUFFER, mesh.vertices.size() * sizeof(unsigned char), mesh.vertices.data(), GL_STATIC_DRAW);
	glGenBuffers(1, &mesh.index_buffer);
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.index_buffer);
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, mesh.indices.size() * sizeof(unsigned short), mesh.indices.data(), GL_STATIC_DRAW);			

	glGenTextures(1, &mesh.texture_buffer);
	glBindTexture(GL_TEXTURE_2D, mesh.texture_buffer);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR); // GL_NEAREST
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

	meshTexImage2d(mesh);

	mesh.buffered = true;
}

void bindAndDrawMesh(const rocktree_t::node_t::mesh_t &mesh, uint8_t octant_mask, const gl_ctx_t &ctx) {
	glUniform2fv(ctx.uv_offset_loc, 1, mesh.uv_offset.data());
	glUniform2fv(ctx.uv_scale_loc, 1, mesh.uv_scale.data());
	int v[8] = { 
		(octant_mask >> 0) & 1, (octant_mask >> 1) & 1, (octant_mask >> 2) & 1, (octant_mask >> 3) & 1,
		(octant_mask >> 4) & 1, (octant_mask >> 5) & 1, (octant_mask >> 6) & 1, (octant_mask >> 7) & 1
	};
	glUniform1iv(ctx.octant_mask_loc, 8, v);
	glUniform1i(ctx.texture_loc, 0);
	glBindTexture(GL_TEXTURE_2D, mesh.texture_buffer);
	glBindBuffer(GL_ARRAY_BUFFER, mesh.vertex_buffer);
	
	glVertexAttribPointer(ctx.position_loc, 3, GL_UNSIGNED_BYTE, GL_FALSE, 8, (void*)0);
	glVertexAttribPointer(ctx.octant_loc, 1, GL_UNSIGNED_BYTE, GL_FALSE, 8, (void*)3);
	glVertexAttribPointer(ctx.texcoords_loc, 2, GL_UNSIGNED_SHORT, GL_FALSE, 8, (void*)4);
	
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.index_buffer);
	glDrawElements(GL_TRIANGLE_STRIP, mesh.indices.size(), GL_UNSIGNED_SHORT, NULL);
}

void unbufferMesh(rocktree_t::node_t::mesh_t &mesh) {
	if (!mesh.buffered) fprintf(stderr, "mesh isn't buffered\n"), abort();

	mesh.buffered = false;
	
	glDeleteTextures(1, &mesh.texture_buffer); // auto: glBindTexture(GL_TEXTURE_2D, 0);
	glDeleteBuffers(1, &mesh.index_buffer); // auto: glBindBuffer(GL_ARRAY_BUFFER, 0);
	glDeleteBuffers(1, &mesh.vertex_buffer); // auto: glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
}

void checkCompileShaderError(GLuint shader) {
	GLint is_compiled = 0;
	glGetShaderiv(shader, GL_COMPILE_STATUS, &is_compiled);
	if(is_compiled == GL_TRUE) return;
	GLint max_len = 0;
	glGetShaderiv(shader, GL_INFO_LOG_LENGTH, &max_len);
	std::vector<GLchar> error_log(max_len);
	glGetShaderInfoLog(shader, max_len, &max_len, &error_log[0]);
	std::cout << &error_log[0] << std::endl;
	glDeleteShader(shader);
	abort();
}

GLuint makeShader(const char* vert_src, const char* frag_src) {
	GLuint vert_shader = glCreateShader(GL_VERTEX_SHADER);
	glShaderSource(vert_shader, 1, &vert_src, NULL);
	glCompileShader(vert_shader);
	checkCompileShaderError(vert_shader);
	GLuint frag_shader = glCreateShader(GL_FRAGMENT_SHADER);
	glShaderSource(frag_shader, 1, &frag_src, NULL);
	glCompileShader(frag_shader);
	checkCompileShaderError(frag_shader);
	GLuint program = glCreateProgram();
	glAttachShader(program, vert_shader);
	glAttachShader(program, frag_shader);
	glLinkProgram(program);
	glDetachShader(program, vert_shader);
	glDetachShader(program, frag_shader);
	glDeleteShader(vert_shader);
	glDeleteShader(frag_shader);
	return program;
}