package tankGame
{
	import laya.display.Sprite;

	public class BaseTank extends Sprite
	{
		private var _bg:Sprite;
		private var _shenti:Sprite;
		private var _dapao:Sprite;
		
		private const W:int = 200;
		private const H:int = 200;
		private const SHENTI_W:int = 90;
		private const SHENTI_H:int = 134;
		private const DAPAO_W:int = 100;
		private const DAPAO_H:int = 6;
		private const DEFUALT_ANGLE:int = 90;
		
		private var _angleSpeed:int = 2;
		private var _moveSpeed:int = 5;
		private var _angle:int = 90;
		private var _moveFlag:Boolean = false;
		
		public function set moveFlag(value:Boolean):void
		{
			_moveFlag = value;
		}
		public function get moveFlag():Boolean
		{
			return _moveFlag;
		}
		public function set angleSpeed(value:int):void
		{
			_angleSpeed = value;
		}
		public function get angleSpeed():int
		{
			return _angleSpeed;
		}
		public function set moveSpeed(value:int):void
		{
			_moveSpeed = value;
		}
		public function get moveSpeed():int
		{
			return _moveSpeed;
		}
		public function set angle(value:int):void
		{
			_angle = value;
			
			_angle = _angle % 360;
			this.rotation = _angle;
		}
		public function get angle():int
		{
			return _angle;
		}
		public function BaseTank()
		{
			this.pivotX = W >> 1;
			this.pivotY = H >> 1;
			
			_bg = new Sprite();
			_bg.graphics.drawRect(0, 0, W, H, "#ff0000");
			_bg.alpha = 0.1;
			addChild(_bg);
			
			_shenti  =  new Sprite();
			_shenti.pivotX = SHENTI_W >> 1;
			_shenti.pivotY = SHENTI_H >> 1;
			_shenti.graphics.drawRect(0, 0, SHENTI_W, SHENTI_H, "#00ff00");
			_shenti.x = W >> 1;
			_shenti.y = H >> 1;
			addChild(_shenti);
			_shenti.rotation = -90;
			
			var tou:Sprite  =  new Sprite();
			tou.graphics.drawRect(0, 0, 20, 3, "#0000ff");
			tou.x = SHENTI_W - 20 >> 1;
			tou.y = 0;
			_shenti.addChild(tou);
			
			_dapao  =  new Sprite();
			_dapao.pivotX = 0;
			_dapao.pivotY = DAPAO_H >> 1;
			_dapao.graphics.drawRect(0, 0, DAPAO_W, DAPAO_H, "#000000");
			_dapao.x = W >> 1;
			_dapao.y = H >> 1;
			addChild(_dapao);
			_dapao.rotation = 180;
			
			this.angle = DEFUALT_ANGLE;
		}
	}
}