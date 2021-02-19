# OCR Template Tool

When you design an OCR system for forms, you may need to record the bounding boxes of the form fields. 

This tool lets you draw boxes over form fields, tag them, and format the coordinates and tags into a list you can copy and paste into your code.

# How to use

Drag and drop an image file onto the dropzone, then drag rectangles over the form fields, writing an optional tag. You can change the format in the format box, using the variables: `$tag`, `$w`, `$h`, `$x1`, `$y1`, `$x2`, `$y2`.

For example, if you want to format it as JSON, this is one format you could use: `"$tag": [$x1, $x2, $y1, $y2]`.

You can copy the formatted record of each box or all at once.

# How to run
```
npm install
npm start
```