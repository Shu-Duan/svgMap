# svgMap

## Introduce
svgMap is developed by javascipt with html's svg tag and it's very light. You can expand it easily.
If you don't want to choose the third-party map library to develop your custom map which is 
including tunnel, campus, factory and so on, svgMap is your another choice.

## Examples
You will see how to use this lib in example.html. Here is the first one to get you started:

* Initialize
```js
const svg=new svgMap(
	{
		target:'svg',// dom element
		url:'image/world-map.jpg'// background image location
	}
);
```
Then, you can set marker, remove marker, zoom in, zoom out, move to location where you want to go and draw line by svgMap object.
* Set Marker
```js
const icon=svg.setMarker({
	icon:'image/plane.png',
	x:300,
	y:300,
	width:15,
	height:15,
	tooltip:'test',
	infoWindow:'test'
});
```
* Remove Marker
```js
svg.removeMarker(icon);
```	
* Pan To
```js
svg.panTo({
	x:-300,
	y:-200
});
```
* Zoom in / Zoom out
```js
svg.zoomTo(2);
```
* Draw Line
```js
svg.setPolyLine({
	positions:[{x:515,y:305},{x:600,y:270}],
	color:'#68b6e2'
})
```
