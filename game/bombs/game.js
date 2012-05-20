/****
 * javascript game.js 
 *  iphone
 *   w : 320
 *   h : 356 or 416(hide addrss bar)
 */

window.onload = function(){

    var SCREEN_WIDTH = 320;
    var SCREEN_HEIGHT = 416;

    sol.preload("images/bom.png", "images/base.png");

    sol.ready( function(){
        
        var field = new sol.field( SCREEN_WIDTH , SCREEN_HEIGHT , { border:"1px solid #ccc"});

        var start_surface = new sol.surface(SCREEN_WIDTH,SCREEN_HEIGHT);
        var game_surface = new sol.surface(SCREEN_WIDTH,SCREEN_HEIGHT);
        var end_surface = new sol.surface(SCREEN_WIDTH,SCREEN_HEIGHT);
        
        // Menu bar
        var Menubar = sol.class(
            sol.base,
            {style:{border_radius:5,z_index:20,background_color:'black',color:'white',x:0,y:0,width:320,height:30,border:'1px solid #ddd'}});
        var menu_bar = new Menubar();

        var title = new sol.label('BOMBS' , 5 , 5 ) ;
        var score = new sol.label('score:' , 120 , 5 );
        var score_number = new sol.label( '0' , 160 , 5 );
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

        // start surface
        var HR = sol.class(sol.label,{style:{font_size:30}});
        var HR2 = sol.class(sol.label,{style:{font_size:12}});

        var start_title = new HR('BOMBS', 100 , 100 );
        var start_expression = new HR2('爆弾をすっ飛ばせ',110,140);
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

        // game core
        var score = 0;
        var Ball = sol.class( 
            sol.sprite , 
            {
            image:"images/bom.png",
                    style:{
                width:32,height:32,z_index:10,opacity:0.8
                        },
                    init:function(){
                    this.style.x = sol.util.random( 1, 300 );
                    this.style.y = sol.util.random( 10, 12 );
                    this.spriteInitialize();

                    this.setCellMotion([0,1,2] , 3 );

                    this.scale( 2 );

                    this.dropped = false;
                    this.onTouch( function(){
                        this.hackFrame({
                            init:function(){},
                            action:function(life){
                                if( life < 20 ){
                                    this.rotate( 20 );
                                    this.scale( -0.1 );
                                    return true;
                                }else{
                                    return false;
                                }
                            },
                            finish:function(){
                                score += 10;
                                this.parent.freezed++;
                                return false;
                            }
                        });
                        this.hackFrame({
                            init:function(){},
                            action:function(life){
                                if( life < 5 ){
                                    console.log( 3 ); 
                                    this.scale( +5 );
                                    this.opacity( +20 );
                                    return true;
                                }
                                return false;
                            },
                            finish:function(){
                                this.remove();
                                return false;
                            }
                        });
                    });
                },
                    frame:function(){
                    var dx = 0,dy = 0;
                    var pos = this.getCenter();
                    if( this.css( 'y' ) < 416 ){
                        dy = 1;
                    }

                    this.move( dx , dy );

                    if( this.css( 'y' ) >=  416 && this.dropped == false ){
                        this.parent.dropped++;
                        this.dropped = true;
                        this.remove();
                        this.freeze();
                    }
                },
                    });

        var Balls = sol.class(
            sol.base,
            {
            style:{
                width:320,height:416,x:0,y:0,
                        },
                    freezed:0,
                    dropped:0,
                    frame:function(t){
                    if( t % 20 == 0 && this.getChildrenCount() < 10 ){
                        this.has( new Ball() );
                    }
                    if( ( this.freezed + this.dropped ) >= 100 ){
                        end_score.setText("score<br />"+score);
                        field.changeSurface( "end" );
                    }
                },
                    });

        var Map = sol.class(
            sol.map,
            {
            cell:{width:16,height:16},
                    full:{width:320,height:640},
                    style:{x:0,y:0},
                    image:'images/base.png',
                    layers:['layer1'],
                    struct:{
                'layer1':[
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                          ],
                        },
                    });

        var load_map = new Map();
        var balls_controller = new Balls();
        game_surface.prepare( load_map );
        game_surface.prepare( balls_controller );

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
            if( sol.preloaded ){
                menu_bar.loop(t);
                field.loop(t);
            }
        });
        sol.start();
    });
};
