We can use Blender to see if it worked:

- File -> Import -> Wavefront (.obj)
- Nothing appears? It should be somewhere outside the viewport. Select a "planet" object from the list and move view to selection center like this:
  ![select object](https://user-images.githubusercontent.com/46618410/51100320-6878ea00-17cd-11e9-82f8-fbf6deff5609.jpg)
- Add "Hemi" lamp
- Set "Viewport Shading" to "Rendered"

Blender Script for correct texture extension:
```
bpy.data.textures["Kd.002"].extension = 'EXTEND'
for x in bpy.data.textures: x.extension = 'EXTEND'
```

Everything jitters? Try [bash scale_move_obj.sh](scale_move_obj.sh) and then open `model.2.obj` instead of `model.obj`.
