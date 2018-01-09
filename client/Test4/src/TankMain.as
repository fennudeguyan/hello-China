package
{
	import laya.display.Stage;
	import laya.events.Event;
	import laya.events.Keyboard;
	import laya.webgl.WebGL;
	
	import tankGame.BaseTank;
	import tankGame.NetConnection;
	import tankGame.NetProtol;
	
	public class TankMain
	{
		private var _net:NetConnection;
		
		private var _self:BaseTank;
		private var _players:Vector.<BaseTank>;
		
		private const SPEED:int = 5;
		
		public function TankMain()
		{
			Laya.init(TLConfig.SCREEN_WIDTH, TLConfig.SCREEN_HEIGHT, WebGL);
			
			if(TLConfig.onPC){
				Laya.stage.scaleMode = Stage.SCALE_FULL;
			}
			else
			{	
				Laya.stage.scaleMode = Stage.SCALE_FIXED_WIDTH;
				Laya.stage.screenMode = Stage.SCREEN_HORIZONTAL;
			}
			
			_players = new Vector.<BaseTank>();
			
			_net = new NetConnection();
			
			Laya.stage.on(Event.KEY_DOWN, this, onKeyDown);
			Laya.stage.on(Event.KEY_UP, this, onKeyUp);
			Laya.timer.frameLoop(1, this, frameEvent);
			_net.addEvent(NetProtol.INIT_TANKE, this, netInitTank);
		}
		private function netInitTank(data:*):void
		{
			var player:BaseTank = new BaseTank();
//			required int32 angle = 1;
//			required int32 moveSpeed = 2;
//			required int32 angleSpeed = 3;
//			required int32 posX = 4;
//			required int32 posY = 5;
			player.x = data.posX;
			player.y = data.posY;
			player.angle = data.angle;
			player.moveSpeed = data.moveSpeed;
			player.angleSpeed = data.angleSpeed;
			_players.push(player);
			Laya.stage.addChild(player);
			
			_self = player;
		}
		private function frameEvent():void
		{
			if(!_self) return;
			
			var angle:int = 2;
			if(_leftFlag)
			{
				_self.angle -= _self.angleSpeed;
			}
			if(_rightFlag)
			{
				_self.angle += _self.angleSpeed;
			}
			
			var sin:Number;
			var cos:Number;
			if(_upFlag)
			{
				cos = -1 * SPEED * Math.sin((90-_self.angle) * Math.PI / 180);
				sin = -1 * SPEED * Math.sin(_self.angle * Math.PI / 180);
				_self.x += cos;
				_self.y += sin;
			}
			if(_downFlag)
			{
				cos = SPEED * Math.sin((90-_self.angle) * Math.PI / 180);
				sin = SPEED * Math.sin(_self.angle * Math.PI / 180);
				_self.x += cos;
				_self.y += sin;
			}
			
		}
		private var _upFlag:Boolean;
		private var _downFlag:Boolean;
		private var _leftFlag:Boolean;
		private var _rightFlag:Boolean;
		private function onKeyUp(e:Event):void
		{
			switch(e.keyCode)
			{
				case Keyboard.UP:
					_upFlag = false;
					break;
				case Keyboard.DOWN:
					_downFlag = false;
					break;
				case Keyboard.LEFT:
					_leftFlag = false;
					break;
				case Keyboard.RIGHT:
					_rightFlag = false;
					break;
			}
		}
		private function onKeyDown(e:Event):void
		{
			var dir:int = -1;
			
			var angle:int = 2;
			var sin:Number;
			var cos:Number;
			switch(e.keyCode)
			{
				case Keyboard.LEFT:
					_leftFlag = true;
//					dir = -1;
//					_totalAngle -= angle;
//					cos = dir * SPEED * Math.sin((90-_totalAngle) * Math.PI / 180);
//					sin = dir * SPEED * Math.sin(_totalAngle * Math.PI / 180);
					break;
				case Keyboard.RIGHT:
					_rightFlag = true;
//					dir = -1;
//					_totalAngle += angle;
//					cos = SPEED * Math.sin((90-_totalAngle) * Math.PI / 180);
//					sin = SPEED * Math.sin(_totalAngle * Math.PI / 180);
					break;
				case Keyboard.UP:
					_upFlag = true;
//					cos = dir * SPEED * Math.sin((90-_totalAngle) * Math.PI / 180);
//					sin = dir * SPEED * Math.sin(_totalAngle * Math.PI / 180);
					break;
				case Keyboard.DOWN:
					_downFlag = true;
//					cos = SPEED * Math.sin((90-_totalAngle) * Math.PI / 180);
//					sin = SPEED * Math.sin(_totalAngle * Math.PI / 180);
					break;
			}
			
			
//			_self.rotation = _totalAngle;
//			_self.x += cos;
//			_self.y += sin;
			
			
			
			trace("旋转：" + _self.rotation);
		}
	}
}