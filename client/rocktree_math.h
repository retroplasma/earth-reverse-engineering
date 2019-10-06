#include <array>

// based on @fabioarnold's impl of "https://fgiesen.wordpress.com/2012/08/31/frustum-planes-from-the-projection-matrix/"
auto getFrustumPlanes(Matrix4d projection) {
	std::array<Vector4d, 6> planes;
	for (int i = 0; i < 3; ++i) {
		planes[i + 0] = projection.row(3) + projection.row(i);
		planes[i + 3] = projection.row(3) - projection.row(i);
	}
	return planes;
}

enum obb_frustum : int {
	obb_frustum_inside = -1,
	obb_frustum_intersect = 0,
	obb_frustum_outside = 1,
};

// based on @fabioarnold's impl of "Real-Time Collision Detection 5.2.3 Testing Box Against Plane"
auto classifyObbFrustum(OrientedBoundingBox* obb, std::array<Vector4d, 6> planes) {
	auto result = obb_frustum_inside;
	auto obb_orientation_t = obb->orientation;
	obb_orientation_t.transposeInPlace();
	for (int i = 0; i < 6; i++) {		
		auto plane4 = planes[i];
		auto plane3 = Vector3d(plane4.data());
		Vector3d abs_plane = (obb_orientation_t * plane3).cwiseAbs();

		auto r = obb->extents.dot(abs_plane);
		auto d = obb->center.dot(plane3) + plane4[3];

		if (fabs(d) < r) result = obb_frustum_intersect;
		if (d + r < 0.0f) return obb_frustum_outside;
	}
	return result;
}

Matrix4d perspective (double fov_rad, double aspect_ratio, double near, double far)
{
    assert(aspect_ratio > 0);
    assert(far > near);
	
    auto tan_half_fovy = tan(fov_rad / 2.0);

    Matrix4d res = Matrix4d::Zero();
    res(0,0) = 1.0 / (aspect_ratio * tan_half_fovy);
    res(1,1) = 1.0 / (tan_half_fovy);
    res(2,2) = - (far + near) / (far - near);
    res(3,2) = - 1.0;
    res(2,3) = - (2.0 * far * near) / (far - near);
    return res;
}

Matrix4d lookAt(Vector3d eye, Vector3d center, Vector3d up) {

    auto f = (center - eye).normalized();
    auto u = up.normalized();
    auto s = f.cross(u).normalized();
    u = s.cross(f);

    Matrix4d res;
    res << s.x(),s.y(),s.z(),-s.dot(eye),
           u.x(),u.y(),u.z(),-u.dot(eye),
           -f.x(),-f.y(),-f.z(),f.dot(eye),
           0,0,0,1;

    return res;
}
