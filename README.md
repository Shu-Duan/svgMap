# svgMap

svgMap is developed by javascipt with html's svg tag and it's very light. You can expand it easily.
If you don't want to choose the third-party map library to develop your custom map in special area
including tunnel, campus, factory and so on, svgMap is your another choice.

You will see how to use this lib in example.html. First, to initialize is necessary, like following code:

const svg=new svgMap(
	{
		target:'svg',// dom element
		url:'image/world-map.jpg'// background image location
	}
);

Then, you can zoom in, zoom out, set marker, move to center, move to marker by svgMap object.

svg.setMarker(
	{
		icon:'image/plane.jpg',
		x:500,// icon x-coordinate
		y:300,// icon y-coordinate
		width:30,// icon width
		height:30// icon height
	}
);
