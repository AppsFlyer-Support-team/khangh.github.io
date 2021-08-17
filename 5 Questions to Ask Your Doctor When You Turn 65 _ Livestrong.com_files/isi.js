 // ___ __, _, _ __, _,   _, ___ __,   _  _, _
 //  |  |_  |\/| |_) |   /_\  |  |_    | (_  |
 //  |  |   |  | |   | , | |  |  |     | , ) |
 //  ~  ~~~ ~  ~ ~   ~~~ ~ ~  ~  ~~~   ~  ~  ~
//	 scroller 3.1  May 2020 
//	 Author: Gabriel aguilar 
//	 gabriel.aguilar@havasmagma.com

function Scroller(props){

	var container=document.querySelector(props.container),
		content=document.querySelector(props.content),
		specificWord=props.specificWord || false,
		range,
		rail,
		width=props.width,
		height=props.height,
		autoscroll=props.autoscroll || false,
		arrows=props.arrows  || false,
		calculateHeigth=props.calculate || false,
		normalizedPosition=0,
		contentPosition,
		scroller,
		topPosition,
		speed=props.speed || 5,
		delay=props.delay || 0,
		auto,
		ui=false,
		dragged=false,
		y_pos=0,
		y_elem=0,
		version=3.0;


	var create= function(){

		range=document.createElement('div');
		range.className='scroller-container';

		scroller=document.createElement('div');
		scroller.className='knob';

		rail=document.createElement('div');
		rail.className='knob-arrange';

		container.appendChild(range);
		range.appendChild(rail);
		range.appendChild(scroller);

		setTimeout(function(){
			content.scrollTop=0;
		},100)
	}

	var createListener= function(){

		scroller.addEventListener('mousedown',startDrag);
		scroller.addEventListener('mouseup',stopDrag);
		scroller.addEventListener('mouseleave',stopDrag);
		content.addEventListener('scroll', moveScroller);
		scroller.addEventListener('mousemove',knobSroll);

		/// destroyers
		content.addEventListener('touchmove', destroy);
		content.addEventListener('mousewheel', destroy);
		content.addEventListener('DOMMouseScroll', destroy);
		content.addEventListener('click', destroy);
	}

	var destroy = function(){
		if(auto!='') tl_scroll.pause();
		ui =true;
	}

	var startDrag=function(e){
		e.preventDefault();
		normalizedPosition=e.pageY;
		contentPosition=content.scrollTop;
		dragged=true;
		destroy();

		y_elem = y_pos - e.target.offsetTop;
	}

	var stopDrag=function(){
		dragged=false;
	}

	var knobSroll =function(e){
		y_pos = e.pageY;

		var areaTodrag=rail.offsetHeight-scroller.offsetHeight,
			mouseDiff=y_pos-y_elem, 
			percent =scroller.offsetTop/areaTodrag;

		if(dragged){
			
			if((mouseDiff)<0){
				scroller.style.top=0;
			}else if((mouseDiff)>(areaTodrag)){
				scroller.style.top=areaTodrag+"px";
			}else{
				scroller.style.top=mouseDiff+"px";
			}
								
			content.scrollTop= (content.scrollHeight-container.offsetHeight)*percent;
		}

	}

	var moveScroller =function(e){

		var percent = e.target.scrollHeight/range.offsetHeight;
 		var proportional = (e.target.scrollTop/percent);

		if(!dragged) (e.target.scrollTop==0) ? scroller.style.top=0 : scroller.style.top = proportional+"px";
		
	}

	this.autoscroll = function(speedParam){
		!ui ? autoscroll=true : autoscroll=false;
		speed=speedParam;
		autoscrolling();
	}

	var autoscrolling = function(){
		if(autoscroll){
			tl_scroll.to(content,speed,{scrollTo:{y:'max'},ease:Power0.easeNone,delay:delay});
			var frequency = content.scrollHeight-content.clientHeight;
			if(content.scrollTop == frequency){
				scroller.style.top=range.offsetHeight-scroller.clientHeight;
				tl_scroll.pause();
			}
			
		}
	}

	this.expanding = function (){
		content.style.overflowX = 'initial';
		container.style.overflow = 'initial';
		var newHeigth = (document.querySelector('.banner').offsetHeight+content.scrollHeight-content.offsetHeight)+20; 
		
		document.querySelector('.banner').style.height = newHeigth+'px';
		document.querySelector('#isi-container').style.height = newHeigth+'px';
		
		document.querySelector('#animation_container').style.height = newHeigth+'px';
		//document.querySelector('#canvas').style.height = newHeigth+'px';
		document.querySelector('#dom_overlay_container').style.height = newHeigth+'px';
		
		
	}

	this.autoCorret = function(){
	 
	    var changed = content.innerHTML.replace(/[a-zA-Z]+\-[a-zA-Z]+\-[a-zA-Z]+/gi,function(x){
	    	
	    	// finds words like with word-word-word' //
	        return '<span class="nobr">'+x+'</span>';
	    }).replace(/[a-zA-Z]+(-|—)[a-zA-Z]+/gi,function(x){
	    	
	    	// finds words like with word-word' //
	        return '<span class="nobr">'+x+'</span>';
	    }).replace(/(\([0-9]+\)|[0-9]+).([0-9]+|[a-zA-Z]+).([0-9]+|[a-zA-Z]+)\-[0-9]+(\-[0-9]+|)+/gi,function(x){
	    	
	    	// finds words number like 1-800-FDA-4447' //
	    	let c = x.replace(/-/g,'nohyp')
	        return '<span class="nobr">'+c+'</span>';
	    }).replace(/[0-9]+(-|—)[a-zA-Z]+/gi,function(x){
	    	
	    	// finds words like with number-word' //
	    	let d = x.replace(/-/g,'nohyp')
	        return '<span class="nobr">'+d+'</span>';
	    }).replace(/(([1-9](-|))+\s[a-zA-Z]*s)\b/gim,function(x){
	    	
	    	// finds words like number space word ending s  example: 12 months' //
	    	let e = x.replace(/-/g,'nohyp')
	        return '<span class="nobr">'+e+'</span>';
	    }).replace(/option+\s+[0-9]/gi,function(x){
	    	
	    	// finds expression like option space number' //
	        return '<span class="nobr">'+x+'</span>';
	    }).replace(/\s+one+\s+\w+/gi,function(x){
	    	
	    	// finds words like one space word example: one day' //
	        return '<span class="nobr">'+x+'</span>';
	    }).replace(/[(]+\d*\.?\d+%+\s?(vs)+\s\d*\.?\d+%+[)]/gm,function(x){
	    	// finds like (60% vs 42%)
	    	return '<span class="nobr">'+x+'</span>';
	    }).replace(/[(]+[<|>|≥|≤]+\d*\.?\d+%+[)]|[(]+\d*\.?\d+%+[)]|[<|>|≥|≤]+\d*\.?\d+%|\d*\.?\d+%/gmi,function(x){

	    	// finds like ≥12%' or like (≥12%) or like (12%)' or like 12%' //
	        return '<span class="nobr">'+x+'</span>';
	    }).replace(/(\d*\.?\d+)\s?(mg)/gi,function(x){

	    	// finds words like 12 mg' //
	        return '<span class="nobr">'+x+'</span>';
	    }).replace(/®|™+/gi,function(x){

	    	// finds ®|™ to add sup class' //
	        return '<span class="sup">'+x+'</span>';
	    }).replace(/nohyp/gi,function(x){
	    	// replace sign to ASCII code' //
	    	console.log('no hyp')
	    	return '-';	        
	    })
	 	
	    content.innerHTML = changed;
	    //console.log(changed);
	}

	this.specificWord = function(){

		var changed;
		if(specificWord){
			specificWord.forEach(function(el,i){
				var word=el;
				var regexp = new RegExp(word, "gi");
				changed = content.innerHTML.replace(regexp,function(x){
					//console.log(x);
					return '<span class="nobr">'+x+'</span>';
				});
				content.innerHTML = changed;
			})
		}
		
	}

	this.getOS = function(){

		var userAgent = window.navigator.userAgent.toLowerCase(),

	      platform = window.navigator.platform,
	      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
	      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
	      iosPlatforms = ['iPhone', 'iPad', 'iPod'];

	    if (macosPlatforms.indexOf(platform) !== -1) {
	        if(userAgent.indexOf('firefox') > -1) document.querySelector('#isi').classList.add('ff-mac');

	        if (userAgent.indexOf('safari') != -1) { 
	         	(userAgent.indexOf('chrome') > -1) ? document.querySelector('#isi').classList.add('chrome-mac') : document.querySelector('#isi').classList.add('safari-mac')
	        }

	    } else if (iosPlatforms.indexOf(platform) !== -1){
			document.querySelector('#isi').classList.add('iphoneIpad');

	    } else if (windowsPlatforms.indexOf(platform) !== -1) {

			document.querySelector('#isi').classList.add('pc-all');

			console.log(userAgent.indexOf('ie-10'))
			console.log(userAgent.indexOf('ie-11'))

	        if(userAgent.indexOf('firefox') > -1) document.querySelector('#isi').classList.add('ff-pc');	    
			if(userAgent.indexOf('msie ') > 0) document.querySelector('#isi').classList.add('ie-10');
			if(userAgent.indexOf('trident/ ') > 0) document.querySelector('#isi').classList.add('ie-11');
			if(userAgent.indexOf('edge/ ') > 0) document.querySelector('#isi').classList.add('ie-edge');

	        if (userAgent.indexOf('safari') != -1) { 
	          (userAgent.indexOf('chrome') > -1) ? document.querySelector('#isi').classList.add('chrome-pc') : document.querySelector('#isi').classList.add('safari-pc')
	        }

	    } else if(/android/.test(userAgent)) {
	        document.querySelector('#isi').classList.add('android');
	    } 

	}

	this.getVersion= function(){
		return version;
	}

	create();
	createListener();
	setTimeout(autoscrolling,1000);
	this.autoCorret();
	this.specificWord();
	this.getOS();
}

// plugin autoscroll
var tl_scroll= new TimelineMax();
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";var a=document.documentElement,b=window,c=function(c,d){var e="x"===d?"Width":"Height",f="scroll"+e,g="client"+e,h=document.body;return c===b||c===a||c===h?Math.max(a[f],h[f])-(b["inner"+e]||a[g]||h[g]):c[f]-c["offset"+e]},d=_gsScope._gsDefine.plugin({propName:"scrollTo",API:2,version:"1.7.6",init:function(a,d,e){return this._wdw=a===b,this._target=a,this._tween=e,"object"!=typeof d&&(d={y:d}),this.vars=d,this._autoKill=d.autoKill!==!1,this.x=this.xPrev=this.getX(),this.y=this.yPrev=this.getY(),null!=d.x?(this._addTween(this,"x",this.x,"max"===d.x?c(a,"x"):d.x,"scrollTo_x",!0),this._overwriteProps.push("scrollTo_x")):this.skipX=!0,null!=d.y?(this._addTween(this,"y",this.y,"max"===d.y?c(a,"y"):d.y,"scrollTo_y",!0),this._overwriteProps.push("scrollTo_y")):this.skipY=!0,!0},set:function(a){this._super.setRatio.call(this,a);var d=this._wdw||!this.skipX?this.getX():this.xPrev,e=this._wdw||!this.skipY?this.getY():this.yPrev,f=e-this.yPrev,g=d-this.xPrev;this.x<0&&(this.x=0),this.y<0&&(this.y=0),this._autoKill&&(!this.skipX&&(g>7||-7>g)&&d<c(this._target,"x")&&(this.skipX=!0),!this.skipY&&(f>7||-7>f)&&e<c(this._target,"y")&&(this.skipY=!0),this.skipX&&this.skipY&&(this._tween.kill(),this.vars.onAutoKill&&this.vars.onAutoKill.apply(this.vars.onAutoKillScope||this._tween,this.vars.onAutoKillParams||[]))),this._wdw?b.scrollTo(this.skipX?d:this.x,this.skipY?e:this.y):(this.skipY||(this._target.scrollTop=this.y),this.skipX||(this._target.scrollLeft=this.x)),this.xPrev=this.x,this.yPrev=this.y}}),e=d.prototype;d.max=c,e.getX=function(){return this._wdw?null!=b.pageXOffset?b.pageXOffset:null!=a.scrollLeft?a.scrollLeft:document.body.scrollLeft:this._target.scrollLeft},e.getY=function(){return this._wdw?null!=b.pageYOffset?b.pageYOffset:null!=a.scrollTop?a.scrollTop:document.body.scrollTop:this._target.scrollTop},e._kill=function(a){return a.scrollTo_x&&(this.skipX=!0),a.scrollTo_y&&(this.skipY=!0),this._super._kill.call(this,a)}}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()();

