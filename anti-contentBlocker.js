/** anti-contentBlocker.js ver 0.30
       last modified at Apr 10 2016
    For details , visit http://freefielder.jp/acb/ (Japanese)
                       http://freefielder.jp/acb/en/ (English)
  (c)2016 tyz@freefielder.jp
	This script is distributed under MIT license. https://opensource.org/licenses/mit-license.php
  ** Don't remove this copyright message ** */


var __acb = {
	version : '0.30' ,
	
	lastUpdate : 'Apr 13 2016',
	
	force_enable : false,	/* for debug. Setting this value true, the warning message is always displayed. */
	force_disable: false,	/* set this value true to disable anti-contentBlocker.*/
	
	trigger : [ 'mousemove', 'wheel', 'scroll', 'keydown', 'touchstart' ],	/* event to listen */
	
	targetClassName : 'adsbygoogle',	
	targetElement : 'IFRAME',	
	threshold : 0,	
	
	myURL : (function() {	
		/* path to anti-contentBlocker folder */
								var src = '';
								if (document.currentScript) {
										src = document.currentScript.src;
								} else {
										var scripts = document.getElementsByTagName('script'),
										script = scripts[scripts.length-1];
										if (script.src) {
												src = script.src;
										}
								}
								var parts = (src.split('/'));
								src = '';
								for( var i = 0 ; i < parts.length-1 ; i++ ){
									src += parts[i] + '/';
								}
								return src;
						})(),
						
	isJA : (function(){
		/* browser locale */
						var lang =  (window.navigator.languages && window.navigator.languages[0]) ||
						 window.navigator.language ||
							window.navigator.userLanguage ||
							window.navigator.browserLanguage ;
						
						return /ja/.test( lang );
					})(),
	
	detectBlocker : function( ){
		/* detectBlocker( ) : detect adBlock software enabled. */
		
		if( __acb.force_disable )return;
		
		if( __acb.force_enable ){
			__acb.showScreen();
		}else{
			var ad = document.getElementsByClassName( __acb.targetClassName );
			if ( ad.length == 0 )return ;
			
			if( ad[0].getElementsByTagName( __acb.targetElement ).length <= __acb.threshold )__acb.applyEvt();
		}	
	},
		
	applyEvt : function(){
		var i,
				e = __acb.trigger;
		for( i = 0 ; i < e.length ; i++ ){
			window.addEventListener( e[i] , __acb.showScreen,false );
		}
	},
	
	removeEvt : function(){
		var i,
				e = __acb.trigger;
		for( i = 0 ; i < e.length ; i++ ){
			window.removeEventListener( e[i] , __acb.showScreen,false );
		}	
	},
		
	showScreen : function(evt){
		/* showScreen() shows the masking screen and waring message. */
		if( !__acb.force_enable ){
			__acb.removeEvt();
			evt.preventDefault();
		}
		
		var warningMsg = document.createElement('DIV');
		warningMsg.id = 'acb-warningMsg';
		warningMsg.style.minHeight = window.innerHeight + 'px';
		warningMsg.style.height = document.body.scrollHeight + 'px';

		var msg = __acb.isJA ?
					'広告ブロック機能を無効にして再読込してください。' : 
					'You must DISABLE contentBlocker to visit this webpage. ';
					
		var linkAbout_ja = 'http://freefielder.jp/acb/',
		    linkAbout_en = 'http://freefielder.jp/acb/en/';
								
		var linkInner = __acb.isJA ? 
										'<li id="instruct">広告ブロック / コンテンツブロックをオフにするには</li>' +
										'<li><a href="' + linkAbout_ja + '" target="_blank">anti-contentBlocker</a> について</li>' :
										'<li id="instruct">How to disable your blocker.</li>' +
										'<li>About <a href="' + linkAbout_en + '" target="_blank">anti-contentBlocker</a></li>' ;
								
		var link = '<div id="acb-warningMsg-linkContainer">' +
								'<ul>' +
								linkInner +
								'</ul>' +
								'</div>';
										
		
		warningMsg.innerHTML =  '<div id="acb-container"><div id="msgContainer"><div id="urlContainer">' + location.href + '</div>' + msg + '</div>' + link + '</div>' ;
		document.body.appendChild( warningMsg );
		
		setTimeout(function(){window.scrollTo(0,0);		warningMsg.style.opacity = 1;});
		
		document.getElementById('instruct').addEventListener('click',__acb.showInstruct,false);

	},
		
	showInstruct : function(){
		var ua = navigator.userAgent.toLowerCase(),
				isIOS = /iphone|ipad|ipod/.test(ua),
				isAndroid = /android/.test(ua),
				en = __acb.isJA ? '' : 'en/';
		
		var iframe = document.createElement('iframe');
		iframe.id="instructFrame";
		iframe.style.height = 'calc('+window.innerHeight + 'px - 30px)';
		
		iframe.src = isIOS ? __acb.myURL + "resources/iframes/" + en + "ios.html" :
									( isAndroid ? __acb.myURL + "resources/iframes/" + en + "android.html" : 
												 __acb.myURL + "resources/iframes/" + en + "pc.html" );
		document.getElementById('acb-warningMsg').appendChild(iframe);
		
		setTimeout(function(){window.scrollTo(0,0);});

	}
}