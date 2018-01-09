package app
{
	import laya.display.Sprite;
	import laya.net.Loader;
	import laya.utils.Handler;
	
	public class Slice extends Sprite
	{
		public static var TEXTURES:Object = {};
		private var _row:int;
		private var _col:int;
		private var _res:String;
		public var isLoaded:Boolean = false;
		
		public function Slice(row:int, col:int){
			super();
			this._row = row;
			this._col = col;
		}
		public function setpos(posx:int, posy:int):void{
			this.x = posx;
			this.y = posy;
		}
		public function loadImg():void{
			isLoaded = true;
			this._res = "res/map/103/"+this._row+"-"+this._col+".jpg";
			if(TEXTURES[this._res]){
				this.updateTT();
			}
			else{
				this.loadImage(this._res, 0, 0, 0, 0, Handler.create(this, this.onLoaded));
			}
//			console.log(":::::" + this._res);
		}
		private function onLoaded():void{
			var t:* = Loader.getRes(this._res);
			TEXTURES[this._res] = t;
			
			this.updateTT();
		}
		private function updateTT():void{
			this.texture = TEXTURES[this._res];
		}
		public function show(ctn:Sprite):void{
			if(!this.parent){
				ctn.addChild(this);
			}
		}
		public function hide():void{
			if(this.parent){
				this.removeSelf();
			}
		}
	}
}