/*
target
url
center
zoom
// TODO
px percentage drag event problem
*/
/*
setmarker(tooltip)(infowindow)
setpolyline
setpolygan
setchart
setcontextmenu
removemarker
zoomto
panto
*/
'use strict';
(function(root, factory) {
	root.svgMap = factory(root);
}(typeof window !== 'undefined' ? window : this, function(win) {
    let svgMap = (function(option) {
		let me=this;
		me.option=option;
		let param={
			'targer':document.querySelector('#'+me.option.target),
			'map' :document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
			'zoomLayer' :document.createElementNS('http://www.w3.org/2000/svg', 'g'),
			'startX':0,
			'startY':0,
			'translateX':0,
			'translateY':0,
			'scale' : 1,
			'translateXt' :0,
			'translateYt' :0,
			'scaleUnit':.5
		};
		let mouseup=function(event){
			me.zoomEventOff();
			param.translateXt=(param.translateX-param.startX+event.clientX);
			param.translateYt=(param.translateY-param.startY+event.clientY);
			param.translateX=param.translateXt;
			param.translateY=param.translateYt;
		}
		let mouseout=function(event){
			me.zoomEventOff();
			param.translateXt=(param.translateX-param.startX+event.clientX);
			param.translateYt=(param.translateY-param.startY+event.clientY);
			param.translateX=param.translateXt;
			param.translateY=param.translateYt;
		}
		let mousemove=function(event){
			param.translateXt=(param.translateX-param.startX+event.clientX);
			param.translateYt=(param.translateY-param.startY+event.clientY);
			param.zoomLayer.setAttribute('transform','translate('+param.translateXt+','+param.translateYt+') scale('+param.scale+')');
		}
    	this.init= function(){
			me.initImage();
			me.initMapEvent();
    	}
		this.initImage=function(){
			let image = document.createElementNS('http://www.w3.org/2000/svg','image');
			param.map.setAttribute('viewBox', '0 0 '+param.targer.clientWidth+' '+param.targer.clientHeight);
			param.zoomLayer.setAttribute('transform', 'translate(0,0) scale(1)');
			image.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', me.option.url);
			image.style.width=param.targer.clientWidth;
			image.style.height=param.targer.clientHeight;
			param.zoomLayer.appendChild(image);
			param.map.appendChild(param.zoomLayer);
			param.targer.appendChild(param.map);
		}
		this.initMapEvent=function(){
			me.zoomEventOn();
			me.dragEventOn();
		}
		this.setMarker=function(markerOpt){
			let image = document.createElementNS('http://www.w3.org/2000/svg','image');
			let imageParent = document.createElementNS('http://www.w3.org/2000/svg','g');
			image.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', markerOpt.icon);
			image.style.width=markerOpt.width;
			image.style.height=markerOpt.height;
			markerOpt.infoWindow;
			image.setAttribute('transform', 'translate('+markerOpt.x+','+markerOpt.y+')');
			imageParent.appendChild(image);
			param.zoomLayer.appendChild(imageParent);
		}
		svgMap.prototype.dragEventOn = function () {
			param.map.addEventListener("mousedown", function(event){
				param.startX=event.clientX;
				param.startY=event.clientY;
				param.map.addEventListener("mouseleave", mouseout);
				param.map.addEventListener("mouseup", mouseup);
				param.map.addEventListener("mousemove", mousemove);
			});
		}
		svgMap.prototype.zoomEventOn = function () {
			param.map.addEventListener("wheel", function(event){
				event.preventDefault();
				if(event.deltaY>0){
					if(param.scale-param.scaleUnit<=0){
						return;
					}
					param.scale-=param.scaleUnit;
				} else{
					param.scale+=param.scaleUnit;
				}
				//param.translateXt=(param.translateX);
				//param.translateYt=(param.translateY);
				param.zoomLayer.setAttribute('transform','translate('+param.translateXt+','+param.translateYt+') scale('+param.scale+')');
			});
		}
		svgMap.prototype.zoomEventOff = function () {
			param.map.removeEventListener("mouseleave", mouseout);
			param.map.removeEventListener("mouseup", mouseup);
			param.map.removeEventListener("mousemove",  mousemove);
		}
		me.init();
	});
    return svgMap;
}));