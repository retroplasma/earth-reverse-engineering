#include <stddef.h>
#include <cstring>
#include <stdint.h>
#include "crn_decomp.h"

extern "C" {
  unsigned int crn_get_decompressed_size(const void *src, unsigned int src_size, unsigned int level_index);
  void crn_decompress(const void *src, unsigned int src_size, void *dst, unsigned int dst_size, unsigned int level_index);
}

unsigned int crn_get_decompressed_size(const void *src, unsigned int src_size, unsigned int level_index) {
  crnd::crn_texture_info tex_info;
  crnd::crnd_get_texture_info(static_cast<const crn_uint8*>(src), src_size, &tex_info);
  const crn_uint32 width = tex_info.m_width >> level_index;
  const crn_uint32 height = tex_info.m_height >> level_index;
  const crn_uint32 blocks_x = (width + 3) >> 2;
  const crn_uint32 blocks_y = (height + 3) >> 2;
  const crn_uint32 row_pitch = blocks_x * crnd::crnd_get_bytes_per_dxt_block(tex_info.m_format);
  const crn_uint32 total_face_size = row_pitch * blocks_y;
  return total_face_size;
}

void crn_decompress(const void *src, unsigned int src_size, void *dst, unsigned int dst_size, unsigned int level_index) {
  crnd::crn_texture_info tex_info;
  crnd::crnd_get_texture_info(static_cast<const crn_uint8*>(src), src_size, &tex_info);
  const crn_uint32 width = tex_info.m_width >> level_index;
  const crn_uint32 height = tex_info.m_height >> level_index;
  const crn_uint32 blocks_x = (width + 3) >> 2;
  const crn_uint32 blocks_y = (height + 3) >> 2;
  const crn_uint32 row_pitch = blocks_x * crnd::crnd_get_bytes_per_dxt_block(tex_info.m_format);
  crnd::crnd_unpack_context pContext = crnd::crnd_unpack_begin(static_cast<const crn_uint8*>(src), src_size);
  void *pDecomp_images[1];
  pDecomp_images[0] = dst;
  crnd::crnd_unpack_level(pContext, pDecomp_images, dst_size, row_pitch, level_index);
  crnd::crnd_unpack_end(pContext);
}
