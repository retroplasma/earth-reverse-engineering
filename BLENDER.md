The obj files aren't centered or resized per default. This Node.js script takes care of that and produces `model.2.obj` from `model.obj`:
```
node center_scale_obj.js
```

We can use Blender to see how it looks:
- File -> Import -> Wavefront (.obj) -> `./downloaded_files/obj/.../model.2.obj`
- Add "Hemi" lamp:
![hemi lamp](https://user-images.githubusercontent.com/46618410/51717795-4c314480-203a-11e9-8f53-1ba1c9d0cace.png "hemi lamp")
- Set "Viewport Shading" to "Rendered":
![viewport shading](https://user-images.githubusercontent.com/46618410/51717879-9d413880-203a-11e9-98dd-954136d9a962.png "viewport shading")

Textures look weird? Try this Blender Script for correct texture extension:
```
for x in bpy.data.textures: x.extension = 'EXTEND'
```
It removes the "tearing" on the edges of meshes. Before and after example:
![weird textures](https://user-images.githubusercontent.com/46618410/51794380-9f85cd00-21c9-11e9-87ba-f77d691efaea.png "weird textures")

Here's how to open the script console:
![python console](https://user-images.githubusercontent.com/46618410/51717769-2c9a1c00-203a-11e9-833b-20752f30a736.png "python console")

The result (octant 20527061605273514, max-level 20) should look like this:
![example](example.jpg "example")
