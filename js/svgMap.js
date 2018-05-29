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
			'markerLayer' :document.createElementNS('http://www.w3.org/2000/svg', 'g'),
			'polyLineLayer' :document.createElementNS('http://www.w3.org/2000/svg', 'g'),
			'tooltipBox' :document.createElement('div'),
			'infoWindow' :document.createElement('div'),
			'startX':0,
			'startY':0,
			'translateX':0,
			'translateY':0,
			'scale' : 1,
			'translateXt' :0,
			'translateYt' :0,
			'scaleUnit':.5,
			'mc':0,
			'mvInterval':null
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
			clearTimeout(param.mvInterval);
			param.mvInterval = setTimeout(function(){mvcallback(event);}, 30);
		}
		let mvcallback=function(event){
			param.translateXt=(param.translateX-param.startX+event.clientX);
			param.translateYt=(param.translateY-param.startY+event.clientY);
			param.zoomLayer.setAttribute('transform','translate('+param.translateXt+','+param.translateYt+') scale('+param.scale+')');
			for (let node of param.infoWindow.children) {
				var image=document.querySelector('#marker_'+node.dataset.markerMapping);
				node.style.left=image.getBoundingClientRect().x+'px';
				node.style.top=image.getBoundingClientRect().y-node.offsetHeight+'px';
			}
		}
    	this.init= function(){
			me.initImage();
			me.initMapEvent();
    	}
		this.initImage=function(){
			let image = document.createElementNS('http://www.w3.org/2000/svg','image');
			param.map.setAttribute('viewBox', '0 0 '+me.option.width+' '+me.option.height);
			param.map.setAttribute('id', 'svgMap_'+me.option.target);
			param.zoomLayer.setAttribute('transform', 'translate(0,0) scale(1)');
			param.zoomLayer.setAttribute('id', 'svgLayer_'+me.option.target);
			image.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', me.option.url);
			image.style.width=me.option.width;
			image.style.height=me.option.height;
			image.setAttribute('width', me.option.width); //for safari
			image.setAttribute('height', me.option.height);
			param.zoomLayer.appendChild(image);
			param.zoomLayer.appendChild(param.markerLayer);
			param.zoomLayer.appendChild(param.polyLineLayer);
			param.map.appendChild(param.zoomLayer);
			param.tooltipBox.setAttribute('class','svgMap_tooltip svgMap_hidden');
			param.targer.appendChild(param.tooltipBox);
			param.targer.appendChild(param.infoWindow);
			param.targer.appendChild(param.map);
		}
		this.initMapEvent=function(){
			me.zoomEventOn();
			me.dragEventOn();
		}
		this.setMarker=function(markerOpt){
			let image = document.createElementNS('http://www.w3.org/2000/svg','image');
			let mc=param.mc+=1;
			let node;
			image.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', markerOpt.icon);
			image.style.width=markerOpt.width;
			image.style.height=markerOpt.height;
			image.setAttribute('width', markerOpt.width); //for safari
			image.setAttribute('height', markerOpt.height);
			image.addEventListener("mouseenter", function(event){
				param.tooltipBox.innerHTML =markerOpt.tooltip;
				param.tooltipBox.setAttribute('class','svgMap_tooltip');
				param.tooltipBox.style.left=image.getBoundingClientRect().x+'px';
				param.tooltipBox.style.top=image.getBoundingClientRect().y+image.getBoundingClientRect().height+'px';
			});
			image.addEventListener("mouseout", function(event){
				param.tooltipBox.setAttribute('class','svgMap_tooltip svgMap_hidden');
				while (param.tooltipBox.hasChildNodes()) {
					param.tooltipBox.removeChild(param.tooltipBox.lastChild);
				}
			});
			image.addEventListener("mousedown", function(event){
				if (!param.infoWindow.contains(node)){
					node = document.createElement("div");
					node.innerHTML += markerOpt.infoWindow;
					node.setAttribute('class','svgMap_infowindow');
					
					node.dataset.markerMapping=mc;
					param.infoWindow.appendChild(node);
					let close = document.createElement("span");
					close.setAttribute('class','svgMap_close');
					close.addEventListener("click", function(event){
						node.remove();
					});
					node.prepend(close);
					node.style.left=image.getBoundingClientRect().x+'px';
					node.style.top=image.getBoundingClientRect().y-node.offsetHeight+'px';
				}
			});
			image.setAttribute('id', 'marker_'+mc);
			image.setAttribute('transform', 'translate('+markerOpt.x+','+markerOpt.y+')');
			param.markerLayer.appendChild(image);
			return image;
		}
		this.removeMarker=function(marker){
			marker.remove();
		}
		this.panTo=function(position){
			while (param.infoWindow.hasChildNodes()) {
				param.infoWindow.removeChild(param.infoWindow.lastChild);
			}
			param.translateX=position.x;
			param.translateY=position.y;
			param.zoomLayer.setAttribute('transform','translate('+param.translateX+','+param.translateY+') scale('+param.scale+')');
		}
		this.zoomTo=function(scale){
			while (param.infoWindow.hasChildNodes()) {
				param.infoWindow.removeChild(param.infoWindow.lastChild);
			}
			param.scale=scale;
			param.zoomLayer.setAttribute('transform','translate('+param.translateX+','+param.translateY+') scale('+param.scale+')');
		}
		this.setPolyLine=function(option){
			let polyLine = document.createElementNS('http://www.w3.org/2000/svg','polyline');
			let path=[];
			if(!option.positions.length){
				return;
			}
			option.positions.forEach(function(p) {
				path.push(p.x+","+p.y);
			});
			polyLine.setAttributeNS(null, "points", path.join(" "));
			polyLine.setAttributeNS(null, "fill", option.color);
			polyLine.setAttributeNS(null, "stroke", option.color);
			param.polyLineLayer.appendChild(polyLine);
			return polyLine;
		}
		svgMap.prototype.dragEventOn = function () {
			param.map.addEventListener("mousedown", function(event){
				param.startX=event.clientX;
				param.startY=event.clientY;
				param.map.addEventListener("mouseleave", mouseout);
				param.map.addEventListener("mouseup", mouseup);
				param.map.addEventListener("mousemove", mousemove);
				console.info("position:"+param.startX+","+param.startY);
			});
		}
		svgMap.prototype.zoomEventOn = function () {
			param.map.addEventListener("wheel", function(event){
				while (param.infoWindow.hasChildNodes()) {
					param.infoWindow.removeChild(param.infoWindow.lastChild);
				}
				event.preventDefault();
				if(event.deltaY>0){
					if(param.scale-param.scaleUnit<=0){
						return;
					}
					param.scale-=param.scaleUnit;
				} else{
					param.scale+=param.scaleUnit;
				}
				const p=me.getSvgPosition(event.clientX,event.clientY);
				param.translateXt=(-1*p.x*param.scale)+(event.clientX-param.targer.offsetLeft+document.documentElement.scrollLeft)/(param.targer.clientWidth/me.option.width);
				param.translateYt=(-1*p.y*param.scale)+(event.clientY-param.targer.offsetTop+document.documentElement.scrollTop)/(param.targer.clientWidth/me.option.width);
				param.translateX=param.translateXt;
				param.translateY=param.translateYt;
				param.zoomLayer.setAttribute('transform','translate('+param.translateXt+','+param.translateYt+') scale('+param.scale+')');

			});
		}
		svgMap.prototype.zoomEventOff = function () {
			param.map.removeEventListener("mouseleave", mouseout);
			param.map.removeEventListener("mouseup", mouseup);
			param.map.removeEventListener("mousemove",  mousemove);
		}
		svgMap.prototype.getSvgPosition= function(clientX, clientY) {
			let m = document.querySelector("#svgLayer_"+me.option.target).getScreenCTM();
			let map = document.querySelector("#svgMap_"+me.option.target);
			let p = map.createSVGPoint();
			p.x = clientX;
			p.y = clientY;
			p = p.matrixTransform(m.inverse());
			return ({
				x : p.x,
				y : p.y
			});
		}
		me.init();
	});
    return svgMap;
}));