# &lt;geocreator-map&gt;
A web component that displays an interactive map.

## Properties
`src` - A string representing the URL of the map source.

`allowplacingmarker` - A boolean that determines if the user can place markers on the map. Default is `false`.

## Methods
`placeMarkerLink(x: number, y: number, callback?: Function)` - A method that places a marker on the map and calls an optional callback function when the marker is clicked.

## Example

```html
<geocreator-map src="./img/image.png"></geocreator-map>
```

![alt text](.readme/example.png)