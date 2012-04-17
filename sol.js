/**
 * sol.js
 *  Language:Javascript
 *  Category:Game Engine
 *  Authour:Ippei Sato(Ipp)
 *  License:THE MIT LICENSE
 *  Package:sol
 *  Update:2012.03
 *  Url:http://www.sol-js.com
 *  File: core
 *  Javascript Ver: ECMA script 262 5th ~ 
 *  Version: 0.5.2
 *  
 * 
 *  This is Game Engine for Javascript.
 *  
 *  Version 0.5  for webkit ONLY.
 * 
 *  SUPPORT:
 *   iOS safari(webkit)
 *   safari(webkit)
 * 
 *  TODO:
 *   continuos map class
 *   accelerration
 */

// ---------
//   CORE
// ---------
(function(){
    var doc = window.document;
    var _fps = 20;
/*
    var requestAnimFrame = (function(){ return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame 
                                        || window.oRequestAnimationFrame || window.msRequestAnimationFrame 
                                        || function( callback, element){ window.setTimeout(callback, 1000 / 60); };})(),
 */      
    var requestAnimFrame = ( function(){ return function( callback , element ){ setTimeout( callback , _fps ); } } )(),
        // functions
        _fn = {
            setFps:function(fps){
                _fps = ps;
            },
            log:function(){ 
                if(typeof console !== 'undefined' ){ 
                    for( var i = 0 , l = arguments.length ; i < l ; ++i ){ 
                        console.log( arguments[i] ); 
                    } 
                }
            },
            id:function(id){ 
                return doc.getElementById(id); 
            },
            name:function(name){ 
                return doc.getElementsByClassName(name); 
            },
            createElement:function(node){ 
                return doc.createElement(node); 
            },
            appendChild:function(parent,child){ 
                parent.appendChild(child); 
                return parent;
            },
            removeMe:function(myself){ 
                if( myself !== null && myself.parentNode !== null ){
                    myself.parentNode.removeChild( myself );
                }
            },
            addEventListener:function(ele,name,fn,b){ 
                ele.addEventListener(name,fn,b); return ele; 
            },
            getComputedStyle:function(ele,select){ 
                return doc.defaultView.getComputedStyle(ele,select); 
            },
            getStyle:function(ele){ 
                return _fn.getComputedStyle(ele); 
            },
            getProperty:function(ele,name){
                if( name == 'x' ){
                    name = 'left';
                }else if( name == 'y'){
                    name = 'top';
                }
                return _fn.getStyle(ele)[_fn.camelCase( name )]; 
            },
            setProperty:function(ele,name,val){ 
                if( name == 'x' ){
                    name = 'left';
                }else if( name == 'y'){
                    name = 'top';
                }
                ele.style[_fn.camelCase(name)] = val; 
                return ele
            },
            setProperties:function(ele , list){
                list.each( function( k , v ){
                    _fn.setProperty( ele , k , v );
                });
            },
            defineConst:function(obj , name , val ){
                Object.defineProperty( 
                    obj , 
                    name , 
                    { value : val , writable : false , enumerable: true } );
            },
            defineUnenum:function(obj , name , val ){
                Object.defineProperty( obj , name , { value : val  } );
            },
            clone:function(o){ 
                var f = function(){};  
                f.prototype = o; 
                return new f(); 
            },  
            class:function(){
                var len = _fn.slice( arguments ).length;
                if( len == 1 ){
                    return _fn.createClass( arguments[0] );
                }else if( len == 2 ){
                    return _fn.extendClass( arguments[0] , arguments[1] );
                }
            },
            createClass:function(o){
                var f = function(){
                    _fn.mixin( this , o );
                    _fn.defineUnenum( this , "extend" , function(child){
                        if( typeof this == 'function' ){
                            var t = new this();
                        }else{
                            var t = this;
                        }
                        return _fn._extend( t , child );
                    });
                };
                f.prototype = o;
                return f;
            },
            extendClass:function( kl , child ){
                return _fn._extend( new kl() , child );
            },
            _extend:function( parent , child ){
                var f = function(){
                    _fn.mixin( this , child );
                    if( typeof this.init == 'function' ){
                        this.init.apply( this , arguments );
                    }
                };
                f.prototype = parent ;
                return f;
            },
            mixin:function(target,child){
                child.each( function(k,v){
                    target[k] = v;
                });
                return target;
            },
            upperCase:function(s){ 
                return s.charAt(0).toUpperCase()+s.slice(1); 
            },
            camelCase:function(str){ 
                var t = 0,ret = ''; 
                str.each( function(k,v){
                    if( v == '-' || v == "_" ){ t = 1; }
                    else if( t == 1 ){ ret += v.toUpperCase(); t = 0;}
                    else{ ret += v; }
                });
                return ret;
            },
            isInt:function(n){
                return !n.match( /[^0-9\.]/g );
            },
            px2int:function(s){
                if( typeof s == 'string' && s != '' ){
                    s = s.replace('px','');
                    if( _fn.isInt(s) ){
                        return parseInt( s );
                    }
                }
                return s;
            },
            trim:function(s){
                if( s !== "" && typeof s !== "undefined" ){
                    return s.replace(/^[\s　]+|[\s　]+$/g, '');                
                }else{
                    return "";
                }
            },
            isBeginningOf:function(s,n){
                return s.indexOf( n ) == 0 ;
            },
            slice:function(l,s,e){ 
                return Array.prototype.slice.apply( l , [s,e] ); 
            },
            frame2position:function(frame,w,h,tw,th){
                return [ -1*(( frame % ~~(tw/w) ) * w), -1*(~~( frame / ~~(tw/w) ) * h) ] ;
            },
            position2frame:function(x,y,w,tw){
                return x + (y*(~~(tw/w)));
            },
        };

    _fn.defineUnenum( Object.prototype , "each" , function( callback , thisobj ){
        var ret = [];
        for( var e in this ){
            //ret.push( callback.call( thisobj , e , this[e] ) );
            ret[ret.length] = callback.call( thisobj, e , this[e] );
        }
        return ret;
    } );
    _fn.defineUnenum( Array.prototype , "each"  , function( callback , thisobj ){
        var ret = [];
        for( var i = 0 , l = this.length ; i < l ; ++i ){
            //ret.push( callback.call( thisobj , this[i] , i  ) );
            ret[ret.length] = callback.call( thisobj , this[i] , i );
        }
        return ret;
    });

    var _time = 0, _touched = false ,  _moving = false,
        _point_x = null, _point_y = null , _point_dx = null , _point_dy = null,

        // implements
        im = {
            empty:function(){},
            mixin:function( child ){
                _fn.mixin( this , child );
            },
            onFrame:function(f){
                ( typeof f == "function" ) && ( this._on_frames[this._on_frames.length] = f );
            },
            onTouch:function(f){
                ( typeof f == "function" ) && ( this._on_pushes[this._on_pushes.length] = f );
            },
            onRelease:function(f){
                ( typeof f == "function" ) && ( this._on_releases[this._on_releases.length] = f );
            },
            prepareFrames:function(){ 
                this._on_frames = [];
                this._on_pushes = [];
                this._on_releases = [];
                this._hacking_frame = null;
                this._ref = [];
                this.touched = false;
                this._touched = false;
                this._remove_flg = false;
                this._removed_flg = false;
            },
            loop:function(ln){
                this._frame(ln);
            },
            _frame:function(ln){
                if( this.counter !== ln && this._freeze == false ){
                    this.counter = ln ;
                    this.lifetime++;
                    var me = this;
                    this._on_frames.each( function(v){
                        v.call(me , ln);
                    });
                    if( this.touched == true ){
                        this.touched = false;
                        this._on_pushes.each( function(v){
                            v.call(me,ln);
                        });
                    }

                    /* onRelease, do not neeed?
                    if( this.touched == false  && this._touched == true ){
                        this._touched = false;
                        this._on_releases.each( function(v){
                            v.call(me,ln);
                        });
                    }
                     */

                    if( this._hacking_frame == null ){
                        this.frame(ln);
                    }else{
                        if( this._hacking_frame[4] == 0 ){
                            this._hacking_frame[1].call(me);
                            this._hacking_frame[4]++;
                        }else if (this._hacking_frame[4] === this._hacking_frame[0] ){
                            var finalize = this._hacking_frame[3];
                            this._hacking_frame = null;
                            finalize.call(me);
                        }else{
                            this._hacking_frame[2].call( me , this._hacking_frame[4] );
                            this._hacking_frame[4]++;
                        }
                    }
                    
                    this._ref.each( function(v){
                        (typeof v !== "undefined" ) && (typeof v["_frame"] !== "undefined" ) && (v._frame(ln));
                    });
                }
            },
            chainTo:function(parent){
                ( typeof parent._frame == 'function')
                    && ( typeof this._frame == 'function')
                    && ( parent._ref[parent._ref.length] = this )
                    && ( this.parent = parent );
            },
            css:function( name , value ){
                if( typeof value == 'undefined' ){ // get
                    if( typeof this._style_cache[name] == 'undefined' ){
                        if( typeof this.style[name] !== "undefined" ){
                            // if no cache, need original value.
                            this._style_cache[name] = this.style[name];
                        }else{
                            // if need original , then... get computed value from original css
                            this._style_cache[name] = _fn.px2int( _fn.getProperty( this._e , name ) );
                        }
                    }
                    return this._style_cache[name];
                }else{ // set
                    if( typeof value == 'object'){ 
                        _fn.setProperties( this._e , value);
                    }else{
                        // no touch to original value
                        _fn.setProperty( this._e , name , value );
                        this._style_cache[name] = value;
                    }
                }
            },
            move:function(x,y){
                if( typeof x !== "undefined" || x !== null ){
                    this.css('x' , this.css('x') + x );
                }
                if( typeof y !== "undefined" || y !== null ){
                    this.css('y' , this.css('y') + y );
                }
            },
            getTransform:function(index){
                var transform = this.css('webkit_transform');
                var transforms = _fn.trim( transform ).split(' ');
                if( typeof index !== "undefined" ){
                    var ret = null;
                    transforms.each( function(v){
                        if( _fn.isBeginningOf( v , index) ){
                            ret = v;
                        }
                    });
                    if( ret !== null ){
                        return ret.replace(index+'(' , '').replace(')','');
                    }else{
                        return null;
                    }
                }else{
                    return transforms;
                }
            },
            setTransform:function(index, value){
                var transforms = this.getTransform();
                var ret = [], not_have = true;
                transforms.each( function( v ){
                    if( _fn.isBeginningOf( v , index ) ){
                        ret[ ret.length ] = index + '(' + value + ')';
                        not_have = false;
                    }else{
                        ret[ ret.length ] = v;
                    }
                });
                if( not_have ){
                    ret[ ret.length ] = index + '(' + value + ')';
                }
                this.css( 'webkit_transform' , ret.join(' ') );
            },
            rotate:function(r){
                if( typeof r == "undefined" ){
                    var rotation = this.getTransform( 'rotate' );
                    if( typeof rotation == "undefined" || rotation == null || rotation == "" ){
                        return 0;
                    }else{
                        return + this.getTransform('rotate').replace('deg','');
                    }
                }else{
                    var sum = this.rotate() + r ;
                    if( sum > 360 ){
                        sum -= 360;
                    }
                    this.setTransform( 'rotate' , sum + 'deg');
                }
            },
            scale:function(s){
                if( typeof s == "undefined" ){
                    var scale = + this.getTransform( 'scale' );
                    if( typeof scale == "undefined" || scale == null || scale == "" ){
                        return 0;
                    }else{
                        return scale;
                    }
                }else{
                    var sum = this.scale() + s;
                    if( sum < 0 ){
                        sum = 0 ;
                    }
                    this.setTransform( 'scale' , sum );
                }
            },
            setReflection:function(direction){
                this.setTransform( 'matrix' , '-1, 0, 0, 1, 0, 0');
            },
            opacity:function(o){
                if( typeof o == "undefined" ){
                    var opacity = this.css( 'opacity' );
                    if( typeof opacity == "undefined" || opacity == null || opacity == "" ){
                        return 0;
                    }else{
                        return Math.floor(this.css('opacity')*100);
                    }
                }else{
                    var opacity = ( + this.opacity() );
                    opacity += o;
                    if( opacity > 100 ){
                        opacity = 100;
                    }else if( opacity < 0 ){
                        opacity = 0;
                    }
                    if( opacity != 0 ){
                        this.css( 'opacity' , opacity/100 );
                    }else{
                        this.css( 'opacity' , 0 );
                    }
                }
            },
            hackFrame:function( lifetime , initialize , frame , finalize ){
                if( this._hacking_frame == null ){
                    this._hacking_frame = [ lifetime , initialize , frame , finalize , 0 ];
                }
            },
            isHacking:function(){
                return this._hacking_frame !== null;
            },
            createElement:function( node_name ){
                this._e = _fn.createElement( node_name );
            },
            applyStyles:function(){
                 if( this.style ){
                    _fn.setProperties( this._e , this.style );
                }
            },
            appendTo:function(parent){
                ( typeof parent._e != "undefined" && parent._e != null )
                    && ( typeof this._e != "undefined" && this._e != null )
                    && ( _fn.appendChild( parent._e , this._e ));
            },
            setEvents:function(){
                var target = this;
                if( this._e ){
                    _fn.addEventListener( this._e , "touchstart" , function(e){
                        if( this._hacking_frame == null ){
                            target.touched = true;
                        }
                    });
                    _fn.addEventListener( this._e , "touchend" , function(e){
                        if( this._hacking_frame == null ){
                            target.touched = false;
                        }
                    });
                    _fn.addEventListener( this._e , "mousedown" , function(e){
                        if( this._hacking_frame == null ){
                            target.touched = true;
                        }
                    });
                    _fn.addEventListener( this._e , "mouseup" , function(e){
                        if( this._hacking_frame == null ){
                            target.touched = false;
                        }
                    });
                }
            },
            setFieldEvents:function(){
                _fn.addEventListener( this._e , "touchstart" , function(e){
                    _touched = true;
                    _point_x = e.touches[0].pageX, _point_y = e.touches[0].pageY;
                    e.preventDefault();
                });
                _fn.addEventListener( this._e , "touchmove" , function(e){
                    _moving = true;
                    _point_dx = e.touches[0].pageX - _point_x , _point_dy = e.touches[0].pageY - _point_y;
                    e.preventDefault();
                });
                _fn.addEventListener( this._e , "touchend" , function(e){
                    _touched = _moving = false;
                    e.preventDefault();
                });
                _fn.addEventListener( this._e , "mousedown" , function(e){
                    _touched = true;
                    _point_x = e.pageX, _point_y = e.pageY;
                });
                _fn.addEventListener( this._e , "mousemove" , function(e){
                    if( _touched ){
                        _moving = true;
                        _point_dx = e.pageX - _point_x , _point_dy = e.pageY - _point_y;
                        //console.log( _touched , _point_dx , _point_dy );
                    }
                });
                _fn.addEventListener( this._e , "mouseup" , function(e){
                    _touched = _moving = false;
                });
            },
            getCenter:function(){
                return [this.css('x') + this.style.width/2,this.css('y') + this.style.height/2 ];
            },
        },
        _system = function(){
            this.mixin = im.mixin,
            this.init = im.empty,

            // frames
            this.counter = 0,
            this._on_frames = [],
            this._on_pushes = [],
            this._on_releases = [],
            this._ref = [],
            this.onFrame = im.onFrame,
            this.onTouch = im.onTouch,
            //this.onRelease = im.onRelease,
            this.prepareFrames = im.prepareFrames;
            this.loop = im.loop;
            this._frame = im._frame;
            this.chainTo = im.chainTo;
            this.frame = im.empty;

            // styles
            this.style = {},
            this._e = null,
            this.css = im.css;
            this.move = im.move;
            this.rotate = im.rotate;
            this.scale = im.scale;
            this.opacity = im.opacity;
            this.hackFrame = im.hackFrame;
            this.isHacking = im.isHacking;
            this.getTransform = im.getTransform;
            this.setTransform = im.setTransform;
            this.createElement = im.createElement;
            this.applyStyles = im.applyStyles;
            this.appendTo = im.appendTo;
            this.setReflection = im.setReflection;
            // events
            this.setEvents = im.setEvents;
            // field_events
            this.setFieldEvents = im.setFieldEvents;
            this.getCenter = im.getCenter;
        };
        // classes
    var __class = _fn.class( new _system() ),

        _field_class = _fn.class(
            __class,
            {
                style:{},
                orientation:"portrate",
                init:function(w,h,s){
                    if( typeof s == 'object'){
                        this.style = _fn.mixin( this.style , s );
                    }
                    this.style.width = w, this.style.height = h;
                    this.initialize();
                    setTimeout( scrollTo , 100 , 0 , 1 );
                    doc.body.appendChild( this._e );
                },
                setFieldLandscape:function(){
                    if( this.orientation !== "landscapce" ){
                        this.orientation = "landscapce";
                        this.rotate(90); 
                        if( this.style.height > this.style.width ){
                            var x_diff = (this.style.height - this.style.width)/2;
                            this.css('x',~~(this.css('x')) + x_diff);
                            this.css('y',~~(this.css('y')) - x_diff);
                        }else{
                            var y_diff = (this.style.width - this.style.height)/2;
                            this.css('x',~~(this.css('x')) - y_diff);
                            this.css('y',~~(this.css('y')) + y_diff);
                        }
                    }
                },
                initialize:function(){
                    this.createElement( "div" );
                    this.style.position = 'absolute';
                    this.style.opacity = 1;
                    this.applyStyles();
                    this.setFieldEvents();
                    this.prepareFrames();
                    this._surfaces = [];
                    this._pre_surfaces = {};
                    this._style_cache = {};
                    this._surface_name = "start";
                    this._inited_surfaces = {};
                    this.rotate(0);
                },
                has:function(e){
                    e.chainTo( this );
                    e.appendTo( this );
                },
                
                frame:function(){},
                loop:function(ln){
                    var target = this;
                    if( typeof this._pre_surfaces[ this._surface_name] !== "undefined" ){
                        if( typeof this._inited_surfaces[this._surface_name] == "undefined"){
                            this.has( this._pre_surfaces[this._surface_name] );
                            this._inited_surfaces[this._surface_name] = 1;
                            this._surfaces[this._surfaces.length]  = this._pre_surfaces[this._surface_name];
                        }
                    }
                    this._surfaces.each( function(v){
                        if( v._go_flg ){
                            v.loop( ln );
                        }
                    });
                },
                addSurface:function(l){
                    var target = this;
                    l.each( function( k , v ){
                        target._pre_surfaces[k] = v;
                    });
                },
                setStartSurface:function(name){
                    this._surface_name = name;
                },
                changeSurface:function(name){
                    this._surface_name = name;
                },
            }),
        _base_class = _fn.class(
            __class,
            {
                style:{},
                init:function(){
                    this.initialize();
                },
                initialize:function(){
                    if( typeof this.node == "undefined" ){
                        this.createElement( "div" );
                    }else{
                        this.createElement( this.node );
                    }
                    this.style.position = 'absolute';
                    this.style.opacity = 1;
                    this._style_cache = {};
                    this._destory_flg = false;
                    this.lifetime = 0;
                    this._freeze = false;
                    this.applyStyles();
                    this.setEvents();
                    this.prepareFrames();
                    this.rotate(0);
                },
                freeze:function(){
                    this._freeze = true;
                },
                frozen:function(){
                    return this._freeze;
                },
                melt:function(){
                    this._freeze = false;
                },
                has:function(e){
                    e.chainTo( this );
                    e.appendTo( this );
                },
                frame:function(){},
                remove:function(){
                    for( var i = 0 , l = this._ref.length ; i < l ; ++i ){
                        this._ref[i].remove();
                        delete this._ref[i];
                    }
                    _fn.removeMe( this._e );
                },
                removeAllChildren:function(){
                    for( var i = 0 , l = this._ref.length ; i < l ; ++i ){
                        this._ref[i].remove();
                        delete this._ref[i];
                    }
                    this._ref = [];
                },
                getChildrenCount:function(){
                    return this._ref.length;

                },
                ref:function(n){
                    return this._ref[n];
                },
            }),

        _label_class = _fn.class( 
            _base_class,
            {
                style:{},
                strings:"",
                node:"div",
                init:function(text,x,y){
                    this.style.x = x;
                    this.style.y = y;
                    this.initialize();
                    this._e.innerHTML = text;
                },
                setText:function(text){
                    this._e.innerHTML = text;
                    return this;
                },
                setPosition:function(x , y ){
                    this.css( 'x' , x );
                    this.css( 'y' , y );
                    return this;
                },
            }),

        _button_class = _fn.class( 
            _label_class,
            {
                style:{},
                init:function( str , css , fn ){
                    (typeof css == 'object' ) && ( this.style = sol.mixin( this.style , css ));
                    this.initialize();
                    this.setText( str );
                    (typeof fn == 'function' ) && (this.onTouch(fn));
                },
            }),

        _surface_class = _fn.class(
            _base_class,
            {
                style:{overflow:'hidden'},
                init:function(w,h,x,y,z){
                    this.style.width = w,
                    this.style.height = h,
                    this.style.x = x,
                    this.style.y = y;
                    this.style.z_index = z;
                    this.initialize();
                    this._elements = [];
                    this._inited = false;
                    this._go_flg = true;
                },
                prepare:function(e){
                    this._elements[this._elements.length] = e;
                },
                loop:function(ln){
                    if( this._inited == false ){
                        var target = this;
                        this._elements.each( function(v){
                            target.has( v );
                        });
                        this._inited = true;
                    }
                    this._frame(ln);
                },
                hide:function(){
                    this.css( 'display' , 'none' );
                },
                show:function(){
                    this.css( 'display' , 'block' );
                },
                stop:function(){
                    this._go_flg = false;
                },
                go:function(){
                    this._go_flg = true;
                },
            }),

        _sprite_class = _fn.class(
            _base_class,
            {
                frames:[],
                image:null,
                spriteInitialize:function(){
                    this.initialize();
                    this._errorMessage = "";
                    this._frames;
                    this._nf = 0;
                    this._interval = 2;
                    this._repeat;
                    if( this.image !== null ){
                        this._image = _images[this.image];
                        this.setCellImage( this._image.src );
                    }
                    this.onFrame( function(){
                        if( this._interval == 0 ){
                            return true;
                        }
                        if( this.lifetime % this._interval == 0 ){
                            this.setCellFrame( this._frames[this._nf] );
                            this._nf++;
                            if( this._nf >= this._frames.length ){
                                this._nf = 0;
                            }
                        }
                    });
                },
                setCellImage:function( path ){
                    this.css('background_image' , 'url('+path+')');
                },
                setCellFrame:function( frame ){
                    var pos = _fn.frame2position( frame , this.style.width , this.style.height , this._image.width , this._image.height );
                    this.setCellPosition( pos[0] , pos[1] );
                },
                setCellPosition:function( x , y ){
                    this.css('background_position', x+'px '+y+'px');
                },
                setCellMotion:function(frames, interval , repeat){
                    this._frames = frames;
                    this._interval = interval;
                    this._nf = 0 ;
                },
                setCellNoMotion:function(){
                    this._interval = 0;
                },
            }),

        _canvas_class = _fn.class(
            _base_class,
            {
                node:'canvas',
                style:{x:0,y:0},
                cell:{width:16,height:16},
                full:{width:16,height:16},
                init:function(width, height){
                    this.full.width = width;
                    this.full.height = height;
                    this.canvasInitialize();
                },
                canvasInitialize:function(){
                    this.initialize();
                    this._e.width = this.full.width;
                    this._e.height = this.full.height;
                    this._ctx = this._e.getContext('2d');
                    this.ctx = this._ctx;
                },
                drawImage:function( name , frame , x , y ){
                    var image = _images[name];
                    var pos = _fn.frame2position( frame , this.cell.width , this.cell.height , image.width , image.height );
                    this._ctx.drawImage( image , pos[0]*-1, pos[1]*-1 , this.cell.width , this.cell.height , x , y , this.cell.width , this.cell.height );
                },
                clearAll:function(){
                    this.ctx.beginPath();
                    this.ctx.clearRect(0,0,this.full.width,this.full.height);
                },
            }),

        _map_class = _fn.class(
            _canvas_class,
            {
                cell:{width:16,height:16},
                full:{width:320,height:640},
                style:{x:0,y:0},
                image:'',
                collision:'',
                layers:['layer1'],
                struct:{'layer1':[]},
                init:function(){
                    this.mapInitialize();
                },
                mapInitialize:function(){
                    this.canvasInitialize();
                    this._image = _images[this.image];
                    var me = this;
                    this.layers.each( function(v){
                        me.fillTile( me.struct[v] );
                    });
                },
                fillTile:function( list ){
                    var xx = 0 , yy = 0 , me = this;
                    list.each( function(v){
                        me.setTile( v , xx , yy );
                        xx+=me.cell.width;
                        if( xx == me.full.width ){
                            xx = 0;
                            yy += me.cell.height;
                        }
                    });
                },
                setTile:function( frame , x , y ){
                    if( frame >= 0 ){
                        this.drawImage( this.image , frame , x , y );
                    }
                },
                hasCollision:function(x,y){
                    if( !this.collision ){
                        return false;
                    }
                    var _x = ( this._style_cache.x )? this._style_cache.x : ( this.css('x') ),
                        _y = ( this._style_cache.y )? this._style_cache.y : ( this.css('y') ),
                        xx = x - _x,
                        yy = y - _y,
                        pos_x = ~~( xx / this.cell.width ),
                        pos_y = ~~( yy / this.cell.height );
                    if( pos_x < 0 || pos_y < 0 ){
                        return false;
                    }
                    var frame = _fn.position2frame( pos_x , pos_y , this.cell.width , this._image.width );
                    if( this.struct[this.collision][frame] == 1 ){
                        return true;
                    }
                    return false;
                },
                pickInfo:function(){
                    
                },
            }),
    
        _scripter_class = _fn.class(
            _base_class,
            {
                _background:null,
                line:1,
                scripterInitialize:function(has_background){
                    (typeof has_background == "undefined" ) && ( has_background = true );
                    this.initialize();
                    this.css( 'overflow' , 'hidden' );
                    if( has_background ){
                        this._background = new sol.base();
                        this._background.css('width',this.style.width);
                        this._background.css('height',this.style.height);
                        this._background.css('x',0);
                        this._background.css('y',0);
                        this._background.css('border_radius',this.style.border_radius);
                        this._background.css('background_color','#ccc');
                        this._background.opacity( -80 );
                        this.has( this._background );
                    }
                    this._scripter = new sol.base();
                    var padding_left = 10,
                        padding_right = 10;
                    this._scripter.css('width',this.style.width-(padding_left+padding_right));
                    this._scripter.css('height',this.style.height);
                    this._scripter.css('padding-left',padding_left);
                    this._scripter.css('padding-right',padding_right);
                    this._scripter.css('x',0);
                    this._scripter.css('y',0);
                    this._scripter.css('color','white');
                    this._scripter.css('overflow','hidden');
                    this._scripter.css('line_height' , '16px' );
                    this.has( this._scripter );
                },
                addText:function(text,speed){ // append text
                    var len = text.length;
                    var texter = null;
                    this.hackFrame( (len+1) , 
                                  function(){
                                      texter = _util.createTextChara( text );
                                  },
                                  function(t){
                                      var charas = texter();                                      
                                      if( charas !== false ){
                                          this.appendText( charas );
                                      }
                                  },
                                  function(){

                                  });
                },
                addNewLine:function(){
                    var font_size = this._scripter.css('font-size'),
                        height = this.css('height'),
                        line_height = this._scripter.css('line-height'),
                        diff = font_size + ((line_height - font_size) / 2),
                        max_line = ~~( height/line_height );
                    this.line++;
                    if( max_line < this.line ){
                        this._scripter.css('margin-top' , -1*(line_height*(this.line-max_line)));
                        this._scripter.css('height' , height+(line_height*(this.line-max_line)));
                    }
                    this.appendText('<br />');
                },
                clearText:function(){ // clear field
                    this._scripter._e.innerHTML = "";
                },
                appendText:function(text){
                    this._scripter._e.innerHTML = this._scripter._e.innerHTML + text ;
                },
                setTextAlign:function(pos){
                    this._scripter.css('text-align',pos);
                },
            }),

        _ajaxProcess = function(s,e,_x){ 
            return function(){
                if( _x.readyState == 4 ){
                    if( _x.status == 200 || _x.status == 201 ){
                        var data = eval( "("+_x.responseText+")" );
                        s(data);
                    }else{
                        e(_x.status,_x.statusText);
                    }
                }
            };
        };


        // utilities
    
        _util = {
            redirect:function(url){
                location.href = url;
            },
            callback:function(url,data){
                
            },
            reload:function(){
                location.reload();
            },
            random : function( s , e ){ 
                return s + Math.floor( Math.random() * e );
            },
            interval :function( interval ){ 
                return _time % interval == 0 ;
            },
            pos2xy:function( position , width ){ // position -> x,y 
                if( position >= 0 ){
                    return [ position % width , ~~(position/width) ];
                }else{
                    position = position*-1;
                    return [ (width - (position%width)) , ~~(position/width)*-1];
                }
            },
            createCounter:function(){
                return {
                    data:{},
                    count:function(id){
                        if( typeof this.data[id] == "undefined" ){
                            this.data[id] = 1;
                        }else{
                            this.data[id]++;
                        }
                        return this.data[id];
                    },
                    get:function(id){
                        if( typeof this.data[id] == "undefined" ){
                            return 0;
                        }else{
                            return this.data[id];
                        }
                    },
                    filter:function(fn){
                        var ret = [];
                        this.data.each( function(k,v){
                            if( fn(k,v) ){
                                ret[ret.length] = k;
                            }
                        });
                        return ret;
                    },
                };
            },
            xy2pos:function( x,y,width ){
                return x + ( y * width );
            },
            rotateRightAngle:function( x , y , r ){ // r is +1 or -1 ( + is to right )
                return [ y*(-1*r) , x*r ];
            },
            getRad : function( x , y ){ 
                return Math.atan2( y , x );
            },
            rad2deg :function( rad ){ 
                return rad * (180/Math.PI);
            },
            deg2rad :function( deg ){ 
                return deg * (Math.PI / 180 );
            },
            getDegree :function( x , y ){
                var res = Math.round( _util.rad2deg( _util.getRad( x , y ) ) );
                if( res < 0 ){ res = 360 + res; }
                return res;
            },
            rad2xy:function( rad  , v ){
                return [Math.round( Math.sin( rad ) * v ) , Math.round( Math.cos( rad ) * v ) ];
            },
            get:function( url , data , s , e ){
                if( url.indexOf('?') == -1 ){
                    url+='?';
                }else{
                    url+='&';
                }
                var _x = new XMLHttpRequest();
                _x.onreadystatechange = _ajaxProcess(s,e,_x);
                _x.open( 'GET' , url+_util.buildquery(data) , true );
                _x.send(null);
            },
            buildquery:function(list){
                var ret = [];
                list.each( function(k,v){
                    ret[ret.length] = k + "=" + v ;
                });
                return ret.join('&');
            },
            post:function(url , data , s , e){
                var _x = new XMLHttpRequest();
                _x.open( 'post' , url , true );
                _x.onreadystatechange = _ajaxProcess(s,e,_x);
                _x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                _x.send(_util.buildquery(data));
            },
            getParams:function(){ // get GET , hash
                var ret = {
                    'hash':location.hash.replace('#' , ''),
                };
                var querys = location.search.replace('?' , '').split('&');
                var params = {};
                querys.each( function(v){
                    var param = v.split('=');
                    params[param[0]] = param[1];
                });
                ret.params = params;
                return ret;
            },
            getBack:function(url,callback_url,data,method){
                (typeof method == "undefined" ) && ( method = 'post' );
                var form = _fn.createElement('form');

                var input = []; 

                form.setAttribute( 'action' , url );
                form.setAttribute( 'method' , method );

                (typeof data == "undefined" ) && ( data = [] );
 
                data.push( {name:'callback_url' , value: callback_url } );

                data.each( function(v,i){
                    input[i] = _fn.createElement('input');
                    input[i].setAttribute( 'type' , 'hidden' );
                    input[i].setAttribute( 'name' , v['name'] );
                    input[i].setAttribute( 'value' , v['value'] );
                    form.appendChild( input[i] );
                });
                form.submit();
            },
            getLocal:function(name,def){
                if( typeof localStorage[name] == "undefined" ){
                    return def;
                }else{
                    return localStorage[name];
                }
            },
            setLocal:function(name,value){
                localStorage[name] = value;
            },
            incrementLocal:function(name){
                var n = _util.getLocal( name , 0 );
                n++;
                _util.setLocal( name , n );
            },
            createStorage:function(name){ // need json2.js
                var ret = {
                    s:{},
                    get:function(name,def){
                        if( typeof this.s[name] == "undefined" ){
                            return def;
                        }else{
                            return this.s[name];
                        }
                    },
                    set:function(name,value){
                        this.s[name] = value;
                    },
                    increment:function(name){
                        var n = this.get(name,0);
                        n++;
                        this.set( name , n );
                    },
                    save:function(){
                        _util.setLocal( name , JSON.stringify(this.s) );
                    },
                    clear:function(){
                        this.s = {};
                    },
                };
                var now =  _util.getLocal(name, false);
                if( now !== false ){
                    ret.s = JSON.parse( now );
                }
                return ret;
            },
            /* on testing
            connectSocket:function(url,data,recieve){
                var s = new WebSocket(url);
                s.onopen = function(){
                    console.log( 'connected' );
                    s.send( data );
                    console.log( 'send' );
                };
                s.onmessage = function(e){
                    recieve(e.data);
                };
                s.onerror = function(){
                    console.log( 'web socket error' );
                };
                s.onclose = function(){
                    console.log( 'disconnected' );
                    console.debug( s );
                };
                s.send();
            },
             */
            inRange:function( val , min , max ){ 
                return ( min <= val ) && ( val <= max );
            },
            createTextLine:function( str ){
                var c = 0, len = str.length;
                return function(){
                    if( (c+1) > len ){  return false; }
                    c++;
                    return str.substring( 0 , c );
                };
            },
            createTextChara : function( str ){
                var c = -1 , len = str.length;
                return function(){
                    if( (c+1) > len ){  return false; }
                    c++;
                    return str.substring( c , c+1 );
                };
            },
            removeDangerText :function( text ){
                var text2 = text.replace( /</g , '' ).replace( />/g , '' ).replace(/"/g , '').replace( /'/g ,"").replace(/=/g,'').replace( /\\/g,'').replace(/\//g,'');
                return text2;
            },
        };
    
    var _loop_body = function(){};
    var _ready_body = function(){};
    var _ready = false ;

    var _ready_waiting = function(){
        if( _pre_loading == _pre_loaded && _ready == false ){
            _ready_body();
            _ready = true;
            //console.log( _pre_loaded + '/' + _pre_loading );
        }else{
            setTimeout( _ready_waiting , 100 );
        }
    };

    sol = {};
    _fn.mixin( sol , _fn );

    sol.loop = function(f){
        _loop_body = function(){
            f(_time);
            _time++;
            requestAnimFrame( _loop_body );
        };
    };

    sol.start = function(){
        _loop_body();
    };
    
    var _images = {},
        _pre_loading = 0,
        _pre_loaded = 0;

    sol.preload = function(){
        var pre_loads = _fn.slice( arguments );
        pre_loads.each( function(v){
            _pre_loading++;
            _images[v] = new Image();
            _images[v].onload = function(){ _pre_loaded++; };
            _images[v].src = v;
        });
    };
    sol.preloaded = function(){
        return ( _pre_loading == _pre_loaded );
    };
    sol.ready = function(fn){
        _ready_body = fn;
        _ready_waiting();
    },

    sol.getImage = function(name){
        if( sol.preloaded() && typeof _images[name] != "undefined"){
            return _images[name];
        }
        return false;
    };

    sol.f = _fn;
    sol.field = _field_class;
    sol.base = _base_class;
    sol.sprite = _sprite_class;
    sol.canvas = _canvas_class;
    sol.label = _label_class;
    sol.button = _button_class;
    sol.surface = _surface_class;
    sol.map = _map_class;
    sol.scripter = _scripter_class;
    sol.images = _images;
    sol.util = _util;
    sol.u = _util;
})();


