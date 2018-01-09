package
{
	import app.TLByteArray;
	
	import laya.events.Event;
	import laya.net.Socket;
	import laya.utils.Browser;

	public class WSTest
	{
		private var ProtoBuf:* = Browser.window.protobuf;
		
		public static var HeadId:*;
		public static var HelloReq:*;
		public static var _this:WSTest;
		
		public function WSTest()
		{
			_this = this;
			
			ProtoBuf.load("helloworld.proto", onAssetsLoaded);
		}
		private function createUI():void
		{
			
		}
		private function onAssetsLoaded(err:*, root:*):void
		{
			if (err)
				throw err;
			
			// Obtain a message type
			HelloReq = root.lookup("cover.helloworld.helloCoverReq");
			HeadId = root.lookup("cover.HeadId");
			
//			var buffer = HelloReq.encode(
//				{
//					name: "AwesomeString"
//				}).finish();
			
			var s:Socket = new Socket();
			s.on(Event.OPEN, _this, _this.onOpen);
			s.on(Event.MESSAGE, _this, _this.onMessage);
			s.on(Event.CLOSE, _this, _this.onClose);
			s.on(Event.ERROR, _this, _this.onError);
			s.connect("127.0.0.1", 8181);
		}
		private function onOpen(e:*=null):void
		{
			trace("onOpen");
		}
		private function onMessage(e:*=null):void
		{
			var bt:TLByteArray = new TLByteArray();//:Byte = new Byte();
			bt.writeArrayBuffer(e);
			bt.pos = 0;
			var id:* = bt.readInt();
			bt.pos = 4;
			var u8:Uint8Array = bt.getUint8Array(4, bt.length-4);
			var message:* = HelloReq.decode(u8);
			
			trace("onMessage: id=" + id + " " + message);
		}
		private function onClose(e:*=null):void
		{
			trace("onClose");
		}
		private function onError(e:*=null):void
		{
			trace("onError");
		}
	}
}