/****
 * javascript game.js 
 *  iphone
 *   w : 320
 *   h : 356 or 416(hide addrss bar)
 */

window.onload = function(){
    // iphone size
    var SCREEN_WIDTH = 320;
    var SCREEN_HEIGHT = 416;
    //sol.preload();
    sol.ready( function(){
        // create field
        var field = new sol.field( SCREEN_WIDTH , SCREEN_HEIGHT , { border:"1px solid #ccc" , background_color:'green'});
        // create sufrace ( scene )
        var start_surface = new sol.surface(SCREEN_WIDTH,SCREEN_HEIGHT);
        var game_surface = new sol.surface(SCREEN_WIDTH,SCREEN_HEIGHT);
        var end_surface = new sol.surface(SCREEN_WIDTH,SCREEN_HEIGHT);
        
        // Menu bar ( score bar )
        var Menubar = sol.class(
            sol.base,
            {style:{border_radius:5,z_index:20,background_color:'black',color:'white',x:0,y:0,width:320,height:30,border:'1px solid #ddd'}});
        var menu_bar = new Menubar();
        var title = new sol.label('REVERSE' , 5 , 5 ) ;
        var push_button = new sol.button( "reload" ,
                                          { background_color:'black', color:'white',x:270,y:0,border_radius:3, padding:5, z_index:100,border:'1px solid #ddd'}, 
                                          function(){
                                              sol.util.reload();
                                          });
        menu_bar.has( push_button );
        menu_bar.has( title );

        // start surface
        var HR = sol.class(sol.label,{style:{font_size:30}});
        var HR2 = sol.class(sol.label,{style:{font_size:12}});

        var start_title = new HR('REVERSE', 80 , 100 );
        var start_expression = new HR2('二人でやるリバーシ',95,140);
        var start_button = new sol.button( "START" , 
                                           { background_color:'#ccc',color:'black',x:110,y:200,border_radius:10,
                                             z_index:100,border:'1px solid black',padding_left:20,padding_right:20,},
                                           function(){
                                               start_surface.hide();
                                               field.changeSurface( "game" );
                                           });
        
        start_surface.prepare( start_title );
        start_surface.prepare( start_expression );
        start_surface.prepare( start_button );

        ///
        /// game core
        ///

        // cell or not
        var NOT_CELL = -1,
            CELL = 1;

        // colors
        var NONE = 0,
            WHITE = 1,
            BLACK = -1;
        // directions
        var TOP_RIGHT    = 1,
            TOP          = 2,
            TOP_LEFT     = 4,
            LEFT         = 8,
            BOTTOM_LEFT  = 16,
            BOTTOM       = 32,
            BOTTOM_RIGHT = 64,
            RIGHT        = 128;

        var Cell = sol.class(
            sol.base,
            {
                style:{
                    border:"1px solid skyblue" , border_radius : 10 , width: 30 , height : 30,
                },
                init:function(x,y){
                    this.style.x = x ;
                    this.style.y = y ;
                    this.initialize();
                    this.color = NONE;
                    this.onTouch( function(t){
                        this.parent.pressed( this.number );
                    });
                },
                change:function(color){
                    if( color == WHITE ){
                        this.css('background_color' , 'black' );
                        this.color = BLACK;
                    }else{
                        this.css('background_color' , 'white' );
                        this.color = WHITE;
                    }
                },
                put:function(color){
                    if( color == WHITE ){
                        this.css('background_color' , 'white' );
                        this.color = WHITE;
                    }else{
                        this.css('background_color' , 'black' );
                        this.color = BLACK;
                    }
                },
                getCellNumber:function(direction){
                    var t_number = -1;
                    switch( direction ){
                    case TOP_RIGHT:
                        if( this.number < 8 || ( this.number % 8 ) == 0 ){
                            return NOT_CELL;
                        }
                        t_number = this.number - 9;
                        break;
                    case TOP:
                        if( this.number < 8 ){
                            return NOT_CELL;
                        }
                        t_number = this.number - 8;
                        break;
                    case TOP_LEFT:
                        if( this.number < 8 || ( ((this.number+1) % 8 ) == 0 )){
                            return NOT_CELL;
                        }
                        t_number = this.number - 7;
                        break
                    case LEFT:
                        if( ( this.number+1 ) % 8 == 0 ){
                            return NOT_CELL;
                        }
                        t_number = this.number + 1;
                        break;
                    case BOTTOM_LEFT:
                        if( this.number > 55 || ((this.number+1) % 8 == 0 )){
                            return NOT_CELL;
                        }
                        t_number = this.number + 9;
                        break;
                    case BOTTOM:
                        if( this.number > 55 ){
                            return NOT_CELL;
                        }
                        t_number = this.number + 8;
                        break;
                    case BOTTOM_RIGHT:
                        if( this.number > 55 || ((this.number+1)%8 == 0 )){
                            return NOT_CELL;
                        }
                        t_number = this.number + 7;
                        break;
                    case RIGHT:
                        if( this.number == 0 || this.number % 8 == 0 ){
                            return NOT_CELL;
                        }
                        t_number = this.number -1;
                        break;
                    }
                    if( t_number < 0 || t_number > 63 ){
                        return NOT_CELL;
                    }else{
                        return t_number;
                    }
                },
            });
        
        var Board = sol.class(
            sol.base,
            {
                style:{ x : 20 , y : 90 },
                init:function(){
                    this.initialize();
                    
                    for( var i = 0 ; i < 64 ; ++i ){
                        this.has( new Cell( (i%8)*35 , parseInt(i/8)*35 ) );
                        this.ref(i).number = i;
                    }
                    this.ref(27).put( WHITE );
                    this.ref(36).put( WHITE );
                    this.ref(28).put( BLACK );
                    this.ref(35).put( BLACK );
                    this.turns = BLACK;
                },
                pressed:function(number){
                    var dir = this.checkMobility(number , this.turns);
                    if( dir == 0 ){
                        return false;
                    }
                    this.ref(number).put( this.turns );
                    this.changeAll( number , dir , this.turns );
                    this.turns = -1*this.turns;
                    var count = this.countAll();
                    whitelabel.setText( count[0] );
                    blacklabel.setText( count[1] );
                    pointlabel.setColor( this.turns );

                    if( !this.hasMorePoint( this.turns ) ){
                        field.changeSurface( "end" );
                    }
                    if( count[0] > count[1] ){
                        end_score.setText( 'WHITE WIN' );
                        end_score.css('x' , 78 );
                    }else if( count[0] < count[1] ){
                        end_score.setText( 'BLACK WIN' );
                        end_score.css('x' , 78 );
                    }else{
                        end_score.setText( 'DRAW' );
                        end_score.css('x' , 115 );
                    }
                },
                checkMobility:function( number , turn ){
                    if( this.ref(number).color != NONE ){
                        return false;
                    }

                    var dir = 0;
                    if( this._checkDirection( number , TOP_RIGHT , turn ) ){
                        dir |= TOP_RIGHT;
                    }
                    if( this._checkDirection( number , TOP , turn ) ){
                        dir |= TOP;
                    }
                    if( this._checkDirection( number , TOP_LEFT , turn ) ){
                        dir |= TOP_LEFT;
                    }
                    if( this._checkDirection( number , LEFT , turn ) ){
                        dir |= LEFT;
                    }
                    if( this._checkDirection( number , BOTTOM_LEFT , turn ) ){
                        dir |= BOTTOM_LEFT;
                    }
                    if( this._checkDirection( number , BOTTOM , turn ) ){
                        dir |= BOTTOM;
                    }
                    if( this._checkDirection( number , BOTTOM_RIGHT , turn ) ){
                        dir |= BOTTOM_RIGHT;
                    }
                    if( this._checkDirection( number , RIGHT , turn ) ){
                        dir |= RIGHT;
                    }
                    return dir;
                },
                _checkDirection:function( number , direction , color ){
                    var next = this.ref(number).getCellNumber( direction );
                    do{
                        number = this.ref(number).getCellNumber( direction );
                        if( number < 0 ){
                            return false;
                        }
                    }while(this.ref(number).color == -1 *  color );
                    if( number == next ){
                        return false;
                    }
                    return this.ref(number).color == color;
                },
                changeAll:function( number , dir , color ){
                    if( (dir & TOP_RIGHT ) !== 0 ){
                        this._changeDirection( number , TOP_RIGHT , color );
                    }
                    if( (dir & TOP ) !== 0 ){
                        this._changeDirection( number , TOP , color );
                    }
                    if( (dir & TOP_LEFT ) !== 0 ){
                        this._changeDirection( number , TOP_LEFT , color );
                    }
                    if( (dir & LEFT ) !== 0 ){
                        this._changeDirection( number , LEFT , color );
                    }
                    if( (dir & BOTTOM_LEFT ) !== 0 ){
                        this._changeDirection( number , BOTTOM_LEFT , color );
                    }
                    if( (dir & BOTTOM ) !== 0 ){
                        this._changeDirection( number , BOTTOM , color );
                    }
                    if( (dir & BOTTOM_RIGHT ) !== 0 ){
                        this._changeDirection( number , BOTTOM_RIGHT , color );
                    }
                    if( (dir & RIGHT ) !== 0 ){
                        this._changeDirection( number , RIGHT , color );
                    }
                },
                _changeDirection:function( number , direction , color ){
                    var next = this.ref(number).getCellNumber( direction );
                    number = this.ref(number).getCellNumber( direction );
                    while( this.ref(number).color !== color ){
                        this.ref(number).change( -1*color );
                        number =  this.ref(number).getCellNumber( direction );
                    }
                },
                countAll:function(){
                    var ref = this._ref;
                    var white = 0,
                        black = 0;
                    for( var i = 0 , l = ref.length ; i < l ; ++i ){
                        if( ref[i].color == WHITE ){
                            white++;
                        }else if( ref[i].color == BLACK ){
                            black++;
                        }
                    }
                    return [ white , black ];
                },
                hasMorePoint:function( turn ){
                    var ref = this._ref;
                    for( var i = 0 , l = ref.length ; i < l ; ++i ){
                        if( this.checkMobility( i , turn ) != 0 ){
                            return true;
                        }
                    }
                    return false;
                },
            });

        var ScoreBoard = sol.class(
            sol.base,
            {
                style:{width:300,height:30,x:10,y:43,border_radius:10,border:"1px solid skyblue"}
            });
        
        var scoreboard = new ScoreBoard();

        var BlackIcon = sol.class(
            sol.base,
            {
                style:{width:25,height:25,x:25,y:2,border_radius:10,border:"1px solid skyblue",background_color:"black"}
            });

        var WhiteIcon = sol.class(
            sol.base,
            {
                style:{width:25,height:25,x:165,y:2,border_radius:10,border:"1px solid skyblue",background_color:"white"}
            });

        var PointLabel = sol.class( sol.label , { style:{font_size:15,color:'red'}} );
        var pointlabel = new PointLabel( '▲' , 5 , 4 );
        pointlabel.rotate( 90 );
        pointlabel.setColor = function(color){
            switch( color ){
            case WHITE:
                this.css('x' , 146 );
                break;
            case BLACK:
                this.css('x' , 5 );
                break;
            }
        };

        var WhiteLabel = sol.class( sol.label , {style:{font_size:15}});
        var whitelabel = new WhiteLabel( 2 , 205 , 4 );
        var BlackLabel = sol.class( sol.label , {style:{font_size:15}});
        var blacklabel = new BlackLabel( 2 , 70 , 4 );

        scoreboard.has( new BlackIcon() );
        scoreboard.has( new WhiteIcon() );
        scoreboard.has( whitelabel );
        scoreboard.has( blacklabel );
        scoreboard.has( pointlabel );

        game_surface.prepare( new Board() );
        game_surface.prepare( scoreboard );

        // end surface
        var GreenBoard = sol.class(
            sol.base,
            {
                style:{width:200,height:100,background_color:'green',border:'1px solid skyblue',x:60,y:160,border_radius:10},
            });
        var green_board = new GreenBoard();
        var end_score = new HR("" , 125,185 );

        end_score.css('z_index',200);
        end_surface.prepare( end_score );
        end_surface.prepare( green_board );
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
