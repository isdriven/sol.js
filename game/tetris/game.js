/****
 * javascript game.js 
 *  iphone
 *   w : 320
 *   h : 356 or 416(hide addrss bar)
 */

window.onload = function(){

    ///
    /// size
    /// (iphone size)
    ///

    var SCREEN_WIDTH = 320;
    var SCREEN_HEIGHT = 416;

    ///
    /// preload images
    ///

    sol.preload('images/arrows_lined.png');

    ///
    /// ready
    ///

    sol.ready( function(){
        //
        // create field
        //
        var field = new sol.field( SCREEN_WIDTH , SCREEN_HEIGHT , { border:"1px solid #ccc"});

        //
        // create sufrace ( scene )
        //
        var start_surface = new sol.surface(SCREEN_WIDTH,SCREEN_HEIGHT);
        var game_surface = new sol.surface(SCREEN_WIDTH,SCREEN_HEIGHT);
        var end_surface = new sol.surface(SCREEN_WIDTH,SCREEN_HEIGHT);
        
        // -*
        // Menu bar ( score bar )
        // -*
        SCORE = 0;
        var Menubar = sol.class( sol.base,{style:{border_radius:5,z_index:20,background_color:'black',color:'white',x:0,y:0,width:320,height:30,border:'1px solid #ddd'}});
        var menu_bar = new Menubar();
        var title = new sol.label('TETRIS' , 5 , 5 ) ;
        var score = new sol.label('score:' , 120 , 5 );
        var score_number = new sol.label( SCORE , 160 , 5 );
        var now_level = new sol.label('level:1',65 , 5 );
        var push_button = new sol.button( "reload" ,
                                          { background_color:'black', color:'white',x:270,y:0,border_radius:3, padding:5, z_index:100,border:'1px solid #ddd'}, 
                                          function(){
                                              sol.util.reload();
                                          });
        menu_bar.has( push_button );
        menu_bar.has( title );
        menu_bar.has( score );
        menu_bar.has( score_number );
        menu_bar.has( now_level );

        // -*
        // start surface
        // -*
        var HR = sol.class(sol.label,{style:{font_size:30}});
        var HR2 = sol.class(sol.label,{style:{font_size:12}});

        var start_title = new HR('TETRIS', 100 , 100 );
        var start_expression = new HR2('テトリスのような落ちゲーム',80,140);
        var start_button = new sol.button( "START" , 
                                           { background_color:'#ccc',color:'black',x:110,y:200,border_radius:10,padding:5,
                                             z_index:100,border:'1px solid black',padding_left:20,padding_right:20,},
                                           function(){
                                               start_surface.hide();
                                               field.changeSurface( "game" );
                                           });
        
        start_surface.prepare( start_title );
        start_surface.prepare( start_expression );
        start_surface.prepare( start_button );

        // -*
        // game core
        // -*

        // CELL INFO 
        var CELL = {width:15,height:15};

        // FIELD INFO
        var FIELD_CELL = {width:10,height:20}
        
        // kinds of blocks
        var BLOCK_LINE       = 0,
            BLOCK_GROUND     = 1,
            BLOCK_HOOK_LEFT  = 2,
            BLOCK_HOOK_RIGHT = 3,
            BLOCK_KEY_LEFT   = 4,
            BLOCK_KEY_RIGHT  = 5,
            BLOCK_RECTANGLE  = 6,
            BLOCK_TEST       = 7;

        // blocks
        // ([ x,y ])
        var BLOCKS_SHAPE = [
            [[0,1],[0,-1],[0,-2]],
            [[1,0],[-1,0],[0,-1]],
            [[-1,0],[0,1],[0,2]],
            [[1,0],[0,1],[0,2]],
            [[0,-1],[1,0],[1,1]],
            [[0,-1],[-1,0],[-1,1]],
            [[1,0],[0,1],[1,1]],
            
            [[0,1],[1,1]] // test
        ];

        for( var i = 0 , l = BLOCKS_SHAPE.length ; i < l ; ++i ){
            BLOCKS_SHAPE[i].push( [0,0] ); // 原点を追加
        }

        function getShapeColor( code ){
            return code + 2 ;
        }
        
        function getColorCode(code){
            switch(code){
            case -1 :
                return null
                break;
            case 1 :
                return 'gray';
                break;
            case 2:
                return 'blue';
                break;
            case 3:
                return 'orange';
                break;
            case 4:
                return 'green';
                break;
            case 5:
                return 'hotpink';
                break;
            case 6:
                return 'crimson';
                break;
            case 7:
                return 'gold';
                break;
            case 8:
                return 'darkviolet';
                break;
            case 9:
                return 'brown';
                break;
            default:
                return null;
                break;
            }
        }


        // -*
        // BLOCK DATA
        // -*

        var SPEED = 20;

        // -*
        // Game Board ( game field )
        // -*
        var GameBoard = new sol.class(
            sol.base,
            {
                style:{x:5,y:45,border:'1px solid skyblue',overflow:'hidden'},
                has_block:false,
                center:-32,
                init:function(){
                    this.style.width = CELL.width * FIELD_CELL.width;
                    this.style.height = CELL.height * (FIELD_CELL.height+1);
                    this.initialize();
                    this.stack = new StackBox();
                    this.moving = new Moving();
                    
                    this.has( this.stack );
                    this.has( this.moving );
                },
                frame:function(){
                    this.stack.isGameOver();
                    this.stack.checkLines();
                    if( this.has_block == false ){
                        this.moving.createNew(sol.util.random(0,7),this.center);
                        this.has_block = true;
                    }else{
                        if( this.lifetime % SPEED == 0 ){
                            this.moving.moveDown();
                        }
                    }

                },
            });

        // -*
        // Blocks
        // -*n
        var Buffer = new sol.class(
            sol.canvas,
            {
                style:{background_color:''},
                full:{},
                fields:{},
                bufferInitialize:function(frame){
                    this.full.width = CELL.width * (FIELD_CELL.width+2);
                    this.full.height = CELL.height * (FIELD_CELL.height+1);
                    this.style.x = CELL.width*1*-1;
                    this.style.y = 0
                    this.canvasInitialize();
                    this.fields_size = 0;
                    for( var i = 0 , l = ( (FIELD_CELL.width+2) * (FIELD_CELL.height+1) ); i < l ; ++i ){
                        if(( (i % (FIELD_CELL.width+2)) == 0 ) || (((i+1)%(FIELD_CELL.width+2)) == 0 ) ){
                            this.fields[i] = -1
                        }else if( ( i > (l - (FIELD_CELL.width+2)))){ 
                            this.fields[i] = 1;
                        }else{
                            this.fields[i] = 0;
                        }
                        this.fields_size++;
                    }
                },
                drawBlock:function( x , y , color ){
                    if( !color ){
                        return ;
                    }
                    this.ctx.save();
                    this.ctx.strokeStyle = "#ddd";
                    this.ctx.fillStyle = color;
                    this.ctx.beginPath();
                    this.ctx.fillRect( x , y , CELL.width, CELL.height );
                    this.ctx.strokeRect( x , y , CELL.width, CELL.height );
                    this.ctx.restore();
                },
                drawFields:function(){
                    var me = this;
                    this.fields.each( function(k,v){
                        if( v !== false ){
                            var pos = sol.util.pos2xy( k , FIELD_CELL.width+2);
                            me.drawBlock( pos[0]*CELL.width , pos[1]*CELL.height , getColorCode( v ));
                        }
                    });
                },
            });

        var StackBox = new sol.class(
            Buffer,
            {
                fields:{},
                init:function(){
                    this.bufferInitialize();
                    f = this.fields;
                    this.drawFields();
                },
                copyBlocks:function( center , data , colorCode ){
                    var me = this;
                    data.each( function(v){
                        var pos = me.parent.moving.getXy( v[0] , v[1] );
                        me.fields[ pos[0] + ( pos[1] * ( FIELD_CELL.width+2 ) ) ] = colorCode;
                    });
                    this.drawFields();
                },
                isGameOver:function(){ // もしゲームオーバーならば、その処理を行う
                    if( this.fields[4] == 0 ){
                        return false;
                    }
                    // ゲームオーバー処理
                    // フレーム処理を奪う
                    this.parent.hackFrame( ((FIELD_CELL.height+1)*(FIELD_CELL.width+2)) , 
                                           function(){},
                                           function(t){
                                               this.stack.fields[((FIELD_CELL.height+1)*(FIELD_CELL.width+2)) - t ] = 1;
                                               this.stack.drawFields();
                                           },
                                           function(){this.stack.freeze();this.freeze();this.moving.clearAll();});
                },
                checkLines:function(){
                    var l = (FIELD_CELL.height+1)*(FIELD_CELL.width+2);
                    counter = sol.util.createCounter();
                    var lines = [];
                    for( var i = 0 ; i < l ; ++i ){
                        if( this.fields[i] > 1 ){
                            var y = ~~(i/(FIELD_CELL.width+2));
                            counter.count( y );
                        }
                    }
                    lines = counter.filter( function(k,v){ return v == 10 ; } );
                    if( lines.length > 0 ){
                        this.deleteLines( lines );
                    }
                },
                deleteLines:function(lines){
                    if( lines.length == 0 ){
                        return false;
                    }
                    me = this;
                    lines.each( function(v){
                        me.deleteLine(v);
                    });
                    this.clearAll();
                    this.drawFields();
                },
                deleteLine:function(line){
                    line = ~~( line );
                    var exp1 = (line * (FIELD_CELL.width+2)),
                        exp2 = (line+1)*(FIELD_CELL.width+2)-1;
                    newf = {};
                    this.pushNewLine(newf);
                    var me = this;
                    var s = (FIELD_CELL.width+2);
                    this.fields.each( function(k,v){
                        if( k < exp1 || exp2 < k ){
                            newf[s] = v;
                            s++;
                        }
                    });
                    this.fields = newf;
                    SCORE++;
                    score_number.setText( SCORE );
                },
                pushNewLine:function(f){
                    for( var i = 0 , l = (FIELD_CELL.width+2) ; i < l ; ++i ){
                        if( i == 0 || i == 11 ){
                            f[i] = -1;
                        }else{
                            f[i] = 0;
                        }
                    }
                },
            });

        var Moving = new sol.class(
            Buffer,
            {
                fields:{},
                has_block:false,
                data:[],
                center:[],
                init:function(){ 
                    this.bufferInitialize();
                },
                createNew:function( type, center ){
                    this.data = []; // 初期化
                    this.data = BLOCKS_SHAPE[type];
                    this.center = center;
                    this.color = getShapeColor( type );
                    this.drawBlocks();
                    this.has_block = true;
                },
                drawBlocks:function(color){
                    this.clearAll();
                    var me = this;
                    this.data.each( function(v){
                        var pos = me.getXy( v[0] , v[1] );
                        me.drawBlock( pos[0] * CELL.width , pos[1] * CELL.height , getColorCode( me.color ));
                    });
                },
                getCenterXy:function(){
                    return sol.util.pos2xy( this.center , FIELD_CELL.width+2 );
                },
                getXy:function(diffx , diffy){
                    var pos = this.getCenterXy();
                    return [ pos[0] + diffx , pos[1] + diffy ];
                },
                isBlockHere:function(x,y){
                    var frame = x + (FIELD_CELL.width+2)*y;
                    if( typeof this.parent.stack.fields[frame] == "undefined" ){
                        return false;
                    }
                    return this.parent.stack.fields[frame] !== 0;
                },
                rotateRight:function(){
                    this.rotate( 1 );
                },
                rotate:function(direction){
                    if( this.has_block == false ){
                        return false;
                    }
                    var me = this;
                    var data = [];
                    var frame = [];
                    var pos = [];
                    var j = true;
                    this.data.each( function(v){
                        frame = sol.util.rotateRightAngle( v[0] , v[1] , direction );
                        pos = me.getXy( frame[0] , frame[1] );
                        if( me.isBlockHere( pos[0] , pos[1] ) ){
                            j = false;
                        }
                        data[data.length] = frame;
                    });
                    if( j ){
                        this.data = data;
                    }
                    this.drawBlocks();
                },
                moveRight:function(){
                    this.moveBlock( 1 , 0 );
                },
                moveLeft:function(){
                    this.moveBlock( -1 , 0 );
                },
                moveDown:function(){
                    var ret = this.moveBlock( 0 , 1 );
                    if( ret == false ){
                        this.parent.stack.copyBlocks( this.center , this.data , this.color );
                        this.finishMe();
                    }
                },
                moveBlock:function( x , y ){ // +1 is right , -1 is left
                    (typeof x == "undefined" ) && ( x = 0 );
                    (typeof y == "undefined" ) && ( y = 0 );
                    if( this.has_block == false ){
                        return false;
                    }
                    var me = this;
                    var data = [];
                    var frame = [];
                    var pos = [];
                    var j = true;
                    this.data.each( function(v){
                        frame = [ v[0]+x , v[1]+y ];
                        pos = me.getXy( frame[0] , frame[1] );
                        if( me.isBlockHere( pos[0] , pos[1] ) ){
                            j = false;
                        }
                        data[data.length] = frame;
                    });
                    if( j ){
                        this.center += ( x + (y*(FIELD_CELL.width+2)));
                    }else{
                        return false;
                    }
                    this.drawBlocks();
                    return true;
                },
                finishMe:function(){
                    this.clearAll();
                    this.parent.has_block = false;
                },
                getDiffPosition:function(){
                    
                },
            });

        var ControllerButton = sol.class(
            sol.sprite,
            {
                image:"images/arrows_lined.png",
                style:{ width:26,height:26,z_index:10},
                init:function(x,y,px,py,rotate){
                    this.style.x = x;
                    this.style.y = y;
                    this.spriteInitialize();
                    this.setCellNoMotion();
                    this.setCellPosition(px , py);
                    this.rotate( rotate );
                    this.scale( 1.5 );
                },
            });
        
        var game_field = new GameBoard();

        var con_turn = new ControllerButton( 220, 200 , 0 , 0 , 0);
        var con_right = new ControllerButton( 270 , 260 , 26 , 0 , 90 );
        var con_bottom = new ControllerButton( 220, 280 , 26 , 0 , 180 );
        var con_left = new ControllerButton( 170 , 260 , 26 , 0 , -90 );

        con_turn.onTouch(function(){
            game_field.moving.rotateRight();
        });
        con_right.onTouch(function(){
            game_field.moving.moveRight();
        });
        con_bottom.onTouch(function(){
            game_field.moving.moveDown();
        });
        con_left.onTouch(function(){
            game_field.moving.moveLeft();
        });
        
        game_surface.prepare( con_turn );
        game_surface.prepare( con_right );
        game_surface.prepare( con_bottom );
        game_surface.prepare( con_left );
        game_surface.prepare( game_field );

        // end surface
        var end_score = new HR("score<br />" , 125,100 );
        var next_button = new sol.button( "NEXT LEVEL" , 
                                          { background_color:'#ccc',color:'black',x:105,y:200,border_radius:10,
                                            z_index:100,border:'1px solid black',padding_left:20,padding_right:20,},
                                          function(){
                                              sol.util.redirect("http://test.ipsleoz.com/sol_game1/index.html?l=2");
                                          });

        end_score.css('z_index',200);
        end_surface.prepare( end_score );
        end_surface.prepare( next_button );
        // ---

        field.has(menu_bar);
        field.addSurface({ "start":start_surface , "game":game_surface , "end":end_surface });
        field.setStartSurface("start");

        sol.loop( function(t){
            menu_bar.loop(t);
            field.loop(t);
        });
        sol.start();
    });
};
