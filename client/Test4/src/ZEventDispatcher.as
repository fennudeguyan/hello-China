package
{
	import laya.events.EventDispatcher;
	
	public class ZEventDispatcher extends EventDispatcher
	{
		public function ZEventDispatcher()
		{
			super();
		}
		public function dispatcher(type:*, data:*=null):void
		{
			this.event(type.toString(), data);
		}
		public function addEvent(type:*, caller:*, listener:Function, args:Array = null):void
		{
			this.on(type.toString(), caller, listener, args);
		}
		public function removeEvent(type:*, caller:*, listener:Function, onceOnly:Boolean = false):void
		{
			this.off(type.toString(), caller, listener, onceOnly);
		}
	}
}