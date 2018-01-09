package
{
	import laya.events.Event;
	import laya.net.Loader;
	import laya.ui.Image;
	import laya.utils.Handler;

	public class PixesTest
	{
		public function PixesTest()
		{
			Laya.loader.load("WelcomePanel.png", Handler.create(this, onCompleted), null, Loader.IMAGE);
		}
		private var img:Image;
		private function onCompleted(e:*=null):void
		{
			img = new Image();
			img.texture = e;
			Laya.stage.addChild(img);
			img.mouseEnabled = true;
			
			Laya.stage.on(Event.MOUSE_MOVE, this, onMouseMove);
		}
		private function onMouseMove(e:Event):void
		{
			var flag:Boolean = MyUtils.checkPixes(img.texture, img.mouseX, img.mouseY);
//			trace("伦敦上空是" + flag);
		}
		
	}
}