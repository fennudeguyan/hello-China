package app
{
	import laya.display.Animation;
	import laya.utils.Handler;
	
	public class Player extends Animation
	{
		private var _url1:String;
		
		public function Player(){
			super();
		}
		public function setUrl(url1:String):void{
			this._url1 = url1;
			if(Animation.framesMap[url1]){
				this.onMyLoaded();
			}
			else{
				this.loadAtlas(url1, Handler.create(this, this.onMyLoaded), url1);
			}
		}
		private function onMyLoaded():void{
			this.play(0, true, this._url1);
			
			this.pivotX = 45;
			this.pivotY = 100;
		}
	}
}