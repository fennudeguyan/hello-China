package
{
	import app.ByteArray;
	
	import laya.webgl.WebGL;
	
//	import laya.flash.Window;
	
	
	public class Main// extends Sprite
	{
		public function Main()
		{
//			Window.start(this, Test4);
			
			Laya.init(1000, 800, WebGL);
			
//			var bt:ByteArray = new ByteArray();
//			bt.writeByte(254);
//			bt.writeByte(253);
//			bt.pos = 0;
//			console.log("length:" + bt.length + " tostring:" + bt.toString());
		}
	}
}