We can use Blender to see if it worked:

- File -> Import -> Wavefront (.obj)
- Nothing appears? It should be somewhere outside the viewport. Select a "planet" object from the list and move view to selection center like this:
  ![select object](https://user-images.githubusercontent.com/46618410/51100320-6878ea00-17cd-11e9-82f8-fbf6deff5609.jpg)
- Add "Hemi" lamp
- Set "Viewport Shading" to "Rendered"

Textures look weird? Try this Blender Script for correct texture extension:
```
for x in bpy.data.textures: x.extension = 'EXTEND'
```

Everything jitters? Try to scale and move the model. You can use this node.js script and then open `model.2.obj` instead of `model.obj` (constants for scaling/moving are inside the script):
```
node scale_move_obj.js
``` 

Here's how the result (octant 20527061605273514, max-level 20) should look like:
![example](example.jpg "example")
