package
{
	import laya.html.dom.HTMLBrElement;
	import laya.html.dom.HTMLElement;
	import laya.resource.Texture;
	import laya.utils.HTMLChar;

	public class MyUtils
	{
		public static const TIME_MOVE:int        = 400;
		
		/**
		 * 判断图片的未透明区域
		 */
		public static function checkPixes(bmd:Texture, x:int, y:int):Boolean
		{
			var c:uint;
			var arr:Array = bmd.getPixels(x, y, 1, 1);
			trace("图像数据：" + arr);
			c = arr[0];
			//			if ( c > 1) 
			//			{
			//				return true;
			//			}
			c = (c >> 24) & 0xFF;
			if ( c > 1) 
			{
				return true;							
			}
			return false;
		}
		
		/**
		 * @return [childs索引，字符索引, HTMLChar, HTMLChar, HTMLChar]
		 */
		public static function htmlIndexOf(str:String, html:HTMLElement, pre:int=0, end:int=0):Array
		{
			var index:int = -1;
			var subIndex:int = -1;
			var childs:Array = html._childs;
			var child:HTMLElement;
			var words:Vector.<HTMLChar>;
			var word:HTMLChar;
			for(var i:int=0; i<childs.length; i++)
			{
				if(!(childs[i] is HTMLBrElement))
				{
					if((childs[i] is HTMLElement))
					{
						child = childs[i];
						if(!child.text)
						{
							htmlIndexOf(str, child, pre, end);
						}
						else
						{
							subIndex = child.text.indexOf(str);
							if(subIndex != -1)
							{
								words = child._getWords();
								word = words[subIndex];
								return [i, subIndex, word, words[subIndex-pre], words[subIndex+end]];
							}
							if(child._childs.length)
							{
								var child2:*;
								for(var j:int=0; j<child._childs.length; j++)
								{
									child2 = child._childs[j];
									if(child2 is HTMLElement && child2.text)
									{
										subIndex = child2.text.indexOf(str);
										if(subIndex != -1)
										{
											words = child2._getWords();
											word = words[subIndex];
											return [j, subIndex, word, words[subIndex-pre], words[subIndex+end]];
										}
									}
								}
							}
						}
					}
				}
			}
			return null;
		}
		
	}
}