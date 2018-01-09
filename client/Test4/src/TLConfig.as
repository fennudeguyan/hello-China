package 
{
	import laya.display.Stage;
	import laya.utils.Browser;
	import laya.webgl.atlas.AtlasResourceManager;

	public class TLConfig
	{
		/**针对移动端预设的屏幕宽、高**/
		public static const SCREEN_WIDTH:int = 960;
		
		public static const SCREEN_HEIGHT:int = 540;
		
		public static var gameIP:String = "192.168.2.25";//"192.168.2.235";
		
		private static var _gamePort:int = 8081;
		public static function get gamePort():int{
			return _gamePort;
		}
		public static function set gamePort(port:int):void{
			_gamePort = port;
		}
		
		private static var _resPath:String = "res/";
		public static function get resPath():String{
			return _resPath;
		}
		public static function set resPath(path:String):void{
			_resPath = path;
		}
		
		/**获取舞台宽度，统一使用此接口**/
		public static function get stageWidth():int{
			return Laya.stage.width;
		}
		
		/**获取舞台高度，统一使用此接口**/
		public static function get stageHeight():int{
			return Laya.stage.height;
		}
		
		public static const GRID_WIDTH:int = 48;//地图格子宽、高
		
		public static const GRID_HEIGHT:int = 32;
		
		public static const SLICE_WIDTH:int = 192;//地图切片宽、高
		
		public static const SLICE_HEIGHT:int = 192;
		
		/**是否进入了休眠模式**/
		public static var isSleep:Boolean = false;
		
		public static function get curFrame():Number{
			return 60;
		}
		
		public static function dateTime():Number
		{
			return new Date().getTime();
		}
		
		public static function initAtlasResMan():void
		{
			AtlasResourceManager.maxTextureCount = 22;
			AtlasResourceManager.instance.setAtlasParam(2048, 2048, 16, 22);
		}
		
		private static var _currentTime:Number = 0;
		public static function get currentTime():Number{
			if(_currentTime == 0)
			{
				_currentTime = Laya.timer.currTimer - 500;
			}
			return Laya.timer.currTimer - _currentTime;
		}
		
		public static var _mobileDebug:Boolean = false;
		public static function get mobileDebug():Boolean
		{
			return _mobileDebug;
		}
		/**设置为手机调试，在电脑上运行手机模式**/
		public static function set mobileDebug(v:Boolean):void
		{
			_mobileDebug = v;
			if(!v){
				Laya.stage.scaleMode = Stage.SCALE_FULL;
//				mytrace("电脑");
			}
			else
			{	
//				mytrace("手机");
				Laya.stage.scaleMode = Stage.SCALE_FIXED_WIDTH;
//				Laya.stage.scaleMode = Stage.SCALE_FIXED_HEIGHT;
				Laya.stage.screenMode = Stage.SCREEN_HORIZONTAL;
			}
		}
		public static function get onPC():Boolean
		{
			if(mobileDebug)
			{
				return false;
			}
			return (Browser.onPC);
		}
		public static function get onMobile():Boolean
		{
			if(mobileDebug)
			{
				return true;
			}
			return (Browser.onMobile);
		}

	}
}