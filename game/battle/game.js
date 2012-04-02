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
    sol.preload("images/forest.jpg","images/bom.png","images/attack.png");
    sol.ready( function(){
        // create field
        var field = new sol.field( SCREEN_WIDTH , SCREEN_HEIGHT , { border:"1px solid white",background_color:'#ccc'});
        // create sufrace ( scene )
        var start_surface = new sol.surface(SCREEN_WIDTH,SCREEN_HEIGHT);
        var game_surface = new sol.surface(SCREEN_WIDTH,SCREEN_HEIGHT);
        var end_surface = new sol.surface(SCREEN_WIDTH,SCREEN_HEIGHT);
        
        // Menu bar ( score bar )
        var Menubar = sol.class(
            sol.base,
            {style:{border_radius:5,z_index:20,background_color:'black',color:'white',x:0,y:0,width:320,height:30,border:'1px solid #ddd'}});
        var menu_bar = new Menubar();

        var title = new sol.label('BATTLE' , 5 , 5 ) ;
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

        var start_title = new HR('BATTLE', 96 , 100 );
        var start_expression = new HR2('ボス戦闘デモ',115,140);
        var start_button = new sol.button( "START" , 
                                           { background_color:'#ccc',color:'black',x:110,y:200,border_radius:10,padding:5,
                                             z_index:100,border:'1px solid black',padding_left:20,padding_right:20},
                                           function(){
                                               start_surface.hide();
                                               field.changeSurface( "game" );
                                           });
        
        start_surface.prepare( start_title );
        start_surface.prepare( start_expression );
        start_surface.prepare( start_button );

        // game core

        var Battlebackground = sol.class(
            sol.base,
            {
                style:{x:0,y:100,width:SCREEN_WIDTH,height:200,background_image:'url('+sol.images['images/forest.jpg'].src+')'}
            });

        var battle_background = new Battlebackground();

        var LinedField = sol.class(
            sol.label,
            {
                style:{border:'1px solid blue',border_radius:5,text_align:'left',font_size:10,padding_left:2},
                init:function(text,w,h,x,y){
                    this.style.width = w,
                    this.style.height = h,
                    this.style.x = x,
                    this.style.y = y;
                    this.initialize();
                    this.setText( text );
                },
            });
        var NoLinedField = sol.class(
            sol.label,
            {
                style:{border_radius:5,text_align:'left',font_size:10},
                init:function(text,x,y,align,w,h){
                    this.style.text_align = align;
                    this.style.x = x,
                    this.style.y = y;
                    this.style.width = w;
                    this.style.height = h;
                    this.initialize();
                    this.setText( text );
                },
            });

        var character1 = new LinedField( "" , 100 , 60 , 20 , 35 );
        character1.has( new NoLinedField( "エルス" , 4, 2 ,'left') );
        character1.has( new NoLinedField( "HP:" , 8, 15 ,'left') );
        character1.has( new NoLinedField( "MP:" , 8, 25 ,'left') );
        character1.has( new NoLinedField( "120/345" , 35, 15 ,'right' , 60 , 10 ) );
        character1.has( new NoLinedField( "34/56" , 35, 25 ,'right' , 60 , 10 ) );
        character1.has( new NoLinedField( "損傷" , 8, 35 ,'left') );
        character1.has( new NoLinedField( "火傷" , 8, 45 ,'left') );

        var FireButton = sol.class( 
            sol.button,
            {
                style:{ color:'white',x:110,y:200,border_radius:10,
                        border_top: "1px solid",
                        //background: "#65a9d7",
                        background: "-webkit-gradient(linear, left top, left bottom, from(#3e779d), to(#65a9d7))",
                        //background: "-webkit-linear-gradient(top, #3e779d, #65a9d7)",
                        width:100,
                        padding_top:10,padding_bottom:10,
                        "-webkit-box-shadow": "rgba(0,0,0,1) 0 1px 0",
                        "box-shadow": "rgba(0,0,0,1) 0 1px 0",
                        "text-shadow": "rgba(0,0,0,.4) 0 1px 0",
                        font_size: "14",
                        "font-family": "Georgia, serif",
                        "text-decoration": "none",
                        "vertical-align": "middle",
                        "z_index":10,
                        }
            });

        var fire1 = new FireButton( "攻撃1" , 
                                    { x:5,y:305 },
                                    function(){
                                        attack.attack1();
                                        commentary.addText('エルスの攻撃1!');
                                        commentary.addNewLine();
                                    });
        var fire2 = new FireButton( "攻撃2" , 
                                    { x:110,y:305 },
                                    function(){
                                        attack.attack2();
                                        commentary.addText('エルスの攻撃2!');
                                        commentary.addNewLine();
                                    });
        var fire3 = new FireButton( "攻撃3" , 
                                    { x:215,y:305 },
                                    function(){
                                        attack.attack3();
                                        commentary.addText('エルスの攻撃3!');
                                        commentary.addNewLine();
                                    });

        var Commentary = sol.class(
            sol.scripter,
            {
                style:{
                    border:'1px solid #ccc',border_radius:5,width:310,height:50,x:5,y:240
                },
                n:0,
                init:function(){
                    this.scripterInitialize();
                    this.setTextAlign('left');
                    this.addText( 'ボスが現れた!' );
                },
            });
        
        var commentary = new Commentary();


        var Boss = new sol.class(
            sol.sprite,
            {
                image:"images/bom.png",
                style:{
                    width:32,height:32,z_index:10,
                },
                init:function(){
                    this.style.x = 140;
                    this.style.y = 160;
                    this.spriteInitialize();
                    this.setCellMotion([0,1,2] , 3 );
                    this.scale( 3 );
                },
            });
        
        var Attack = new sol.class(
            sol.sprite,
            {
                image:"images/attack.png",
                style:{
                    width:190,height:190,z_index:20,
                },
                init:function(){
                    this.style.x = 60;
                    this.style.y = 80;
                    this.spriteInitialize();
                    this.setCellNoMotion();
                    this.css('display','none');
                },
                attack1:function(){
                    this.hackFrame( 15 , 
                                    function(){
                                        this.css('display','block');
                                        this.setCellMotion([0,1,2,3,4] , 3 );
                                    },
                                    function(){},
                                    function(){
                                        this.setCellNoMotion();
                                        this.css('display','none');
                                    });
                },
                attack2:function(){
                    this.hackFrame( 15 , 
                                    function(){
                                        this.css('display','block');
                                        this.setCellMotion([10,11,12,13,14] , 3 );
                                    },
                                    function(){},
                                    function(){
                                        this.setCellNoMotion();
                                        this.css('display','none');
                                    });
                },
                attack3:function(){
                    this.hackFrame( 15 , 
                                    function(){
                                        this.css('display','block');
                                        this.setCellMotion([15,16,17,18,19] , 3 );
                                    },
                                    function(){},
                                    function(){
                                        this.setCellNoMotion();
                                        this.css('display','none');
                                    });
                },
            });
        
        var boss = new Boss();
        var attack = new Attack();

        game_surface.prepare( fire1 );
        game_surface.prepare( fire2 );
        game_surface.prepare( fire3 );
        game_surface.prepare( character1 );
        game_surface.prepare( battle_background );
        game_surface.prepare( boss );
        game_surface.prepare( attack );
        game_surface.prepare( commentary );

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
