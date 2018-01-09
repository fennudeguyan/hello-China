//class app.TLByteArray
//纯粹的bytearray，去除了中文字符的解码编码

	var TLByteArray=function(){
		this.classDic={};
		this._length=0;
		this._objectEncoding_=0;
		this._position_=0;
		this._allocated_=8;
		this._data_=null;
		this._littleEndian_=false;
		this._byteView_=null;
		this._strTable=null;
		this._objTable=null;
		this._traitsTable=null;
		this.___resizeBuffer(this._allocated_);
	}
	

		var __proto=TLByteArray.prototype;
		__proto.clear=function(){
			this._strTable=[];
			this._objTable=[];
			this._traitsTable=[];
			this._position_=0;
			this.setlength(0);
		}

		__proto.ensureWrite=function(lengthToEnsure){
			if (this._length < lengthToEnsure)this.setlength(lengthToEnsure);
		}

		__proto.readBoolean=function(){
			return (this.readByte ()!=0);
		}

		__proto.readByte=function(){
			return this._data_.getInt8 (this._position_++);
		}

		__proto.readBytes=function(bytes,offset,length){
			(offset===void 0)&& (offset=0);
			(length===void 0)&& (length=0);
			if (offset < 0 || length < 0){
				throw "Read error - Out of bounds";
			}
			if (length==0)length=this._length-this._position_;
			bytes.ensureWrite (offset+length);
			bytes._byteView_.set (this._byteView_.subarray(this._position_,this._position_+length),offset);
			bytes.setpos(offset);
			this._position_+=length;
			if (bytes.pos()+length > bytes.length())bytes.setlength(bytes.pos()+length);
		}

		__proto.readDouble=function(){
			var double=this._data_.getFloat64 (this._position_,this._littleEndian_);
			this._position_+=8;
			return double;
		}

		__proto.readFloat=function(){
			var float=this._data_.getFloat32 (this._position_,this._littleEndian_);
			this._position_+=4;
			return float;
		}

		__proto.readFullBytes=function(bytes,pos,len){
			this.ensureWrite (len);
			for(var i=pos;i < pos+len;i++){
				this._data_.setInt8 (this._position_++,bytes.get(i));
			}
		}

		__proto.readInt=function(){
			var tInt=this._data_.getInt32 (this._position_,this._littleEndian_);
			this._position_+=4;
			return tInt;
		}

		__proto.readShort=function(){
			var short=this._data_.getInt16 (this._position_,this._littleEndian_);
			this._position_+=2;
			return short;
		}

		__proto.readUnsignedByte=function(){
			return this._data_.getUint8 (this._position_++);
		}

		__proto.readUnsignedInt=function(){
			var uInt=this._data_.getUint32 (this._position_,this._littleEndian_);
			this._position_+=4;
			return Math.floor(uInt);
		}

		//add by ch.ji 解决读取整数时读到负整数的问题
		__proto.readUnsignedShort=function(){
			var uShort=this._data_.getUint16 (this._position_,this._littleEndian_);
			this._position_+=2;
			return uShort;
		}

		__proto.readUTF=function(){
			return this.readUTFBytes (this.readUnsignedShort ());
		}

		__proto.readUnicode=function(length){
			var value="";
			var max=this._position_+length;
			var c1=0,c2=0;
			while (this._position_ < max){
				c2=this._byteView_[this._position_++];
				c1=this._byteView_[this._position_++];
				value+=String.fromCharCode(c1<<8 | c2);
			}
			return value;
		}

		__proto.readMultiByte=function(length,charSet){
			if(charSet=="UNICODE" || charSet=="unicode"){
				return this.readUnicode(length);
			}
			if(charSet=="GB2312" || charSet=="gb2312"){
				return this.readGBBytes(length);
			}
			return this.readUTFBytes (length);
		}

		__proto.readGBBytes=function(len){
			var value="";
			var max=this._position_+len;
			var c=0,c2=0;
			while (this._position_ < max){
				c=this._data_.getUint8 (this._position_++);
				if (c < 0x80){
					if (c !=0){
						value+=String.fromCharCode (c);
					}
					}else {
					c2=this._data_.getUint8 (this._position_++);
					var tmp=(c & 0xff)<< 8 | (c2 & 0xff)
					value+=String.fromCharCode (TLByteArray.gb2unicodechar[tmp]);
				}
			}
			return value;
		}

		__proto.readUTFBytes=function(len){
			(len===void 0)&& (len=-1);
			var value="";
			var max=this._position_+len;
			var c=0,c2=0,c3=0;
			while (this._position_ < max){
				c=this._data_.getUint8 (this._position_++);
				if (c < 0x80){
					if (c !=0){
						value+=String.fromCharCode (c);
					}
					}else if (c < 0xE0){
					value+=String.fromCharCode (((c & 0x3F)<< 6)| (this._data_.getUint8 (this._position_++)& 0x7F));
					}else if (c < 0xF0){
					c2=this._data_.getUint8 (this._position_++);
					value+=String.fromCharCode (((c & 0x1F)<< 12)| ((c2 & 0x7F)<< 6)| (this._data_.getUint8 (this._position_++)& 0x7F));
					}else {
					c2=this._data_.getUint8 (this._position_++);
					c3=this._data_.getUint8 (this._position_++);
					value+=String.fromCharCode (((c & 0x0F)<< 18)| ((c2 & 0x7F)<< 12)| ((c3 << 6)& 0x7F)| (this._data_.getUint8 (this._position_++)& 0x7F));
				}
			}
			return value;
		}

		// return str;
		__proto.toString=function(){
			var cachePosition=this._position_;
			this._position_=0;
			var value=this.readUTFBytes (this.length);
			this._position_=cachePosition;
			return value;
		}

		__proto.writeBoolean=function(value){
			this.writeByte (value ? 1 :0);
		}

		__proto.writeByte=function(value){
			this.ensureWrite (this._position_+1);
			this._data_.setInt8 (this._position_,value);
			this._position_+=1;
		}

		__proto.writeBytes=function(bytes,offset,length){
			(offset===void 0)&& (offset=0);
			(length===void 0)&& (length=0);
			if (offset < 0 || length < 0)throw "writeBytes error - Out of bounds";
			if(length==0)length=bytes.length-offset;
			this.ensureWrite (this._position_+length);
			this._byteView_.set(bytes._byteView_.subarray (offset,offset+length),this._position_);
			this._position_+=length;
		}

		__proto.writeArrayBuffer=function(arraybuffer,offset,length){
			(offset===void 0)&& (offset=0);
			(length===void 0)&& (length=0);
			if (offset < 0 || length < 0)throw "writeArrayBuffer error - Out of bounds";
			if(length==0)length=arraybuffer.byteLength-offset;
			this.ensureWrite (this._position_+length);
			var uint8array=new Uint8Array(arraybuffer);
			this._byteView_.set(uint8array.subarray (offset,offset+length),this._position_);
			this._position_+=length;
		}

		__proto.writeDouble=function(x){
			this.ensureWrite (this._position_+8);
			this._data_.setFloat64 (this._position_,x,this._littleEndian_);
			this._position_+=8;
		}

		__proto.writeFloat=function(x){
			this.ensureWrite (this._position_+4);
			this._data_.setFloat32 (this._position_,x,this._littleEndian_);
			this._position_+=4;
		}

		__proto.writeInt=function(value){
			this.ensureWrite (this._position_+4);
			this._data_.setInt32 (this._position_,value,this._littleEndian_);
			this._position_+=4;
		}

		__proto.writeShort=function(value){
			this.ensureWrite (this._position_+2);
			this._data_.setInt16 (this._position_,value,this._littleEndian_);
			this._position_+=2;
		}

		__proto.writeUnsignedInt=function(value){
			this.ensureWrite (this._position_+4);
			this._data_.setUint32 (this._position_,value,this._littleEndian_);
			this._position_+=4;
		}

		__proto.writeUnsignedShort=function(value){
			this.ensureWrite (this._position_+2);
			this._data_.setUint16 (this._position_,value,this._littleEndian_);
			this._position_+=2;
		}

		__proto.writeUTF=function(value){
			value=value+"";
			this.writeUnsignedShort (this._getUTFBytesCount(value));this.writeUTFBytes (value);
		}

		__proto.writeUnicode=function(value){
			value=value+"";
			this.ensureWrite (this._position_+value.length*2);
			var c=0;
			for(var i=0,sz=value.length;i<sz;i++){
				c=value.charCodeAt(i);
				this._byteView_[this._position_++]=c&0xff;
				this._byteView_[this._position_++]=c>>8;
			}
		}

		__proto.writeMultiByte=function(value,charSet){
			value=value+"";
			if(charSet=="UNICODE" || charSet=="unicode"){
				return this.writeUnicode(value);
			}
			if(charSet=="GB2312" || charSet=="gb2312"){
				this.writeGBbytes(value);
			}
			this.writeUTFBytes(value);
		}

		__proto.writeGBbytes=function(value){
			value=value+"";
			for (var i=0,sz=value.length;i < sz;i++){
				var c=value.charCodeAt(i);
				if (c <=0x7F){
					this.writeByte (c);
					}else {
					c=TLByteArray.unicodegb2char[c];
					this.writeByte (c >> 8);
					this.writeByte (c & 0xFF);
				}
			}
			this.writeByte(0);
			this.setlength(this._position_);
		}

		__proto.writeUTFBytes=function(value){
			value=value+"";
			this.ensureWrite(this._position_+value.length*4);
			for (var i=0,sz=value.length;i < sz;i++){
				var c=value.charCodeAt(i);
				if (c <=0x7F){
					this.writeByte (c);
					}else if (c <=0x7FF){
					this.writeByte (0xC0 | (c >> 6));
					this.writeByte (0x80 | (c & 63));
					}else if (c <=0xFFFF){
					this.writeByte(0xE0 | (c >> 12));
					this.writeByte(0x80 | ((c >> 6)& 63));
					this.writeByte(0x80 | (c & 63));
					}else {
					this.writeByte(0xF0 | (c >> 18));
					this.writeByte(0x80 | ((c >> 12)& 63));
					this.writeByte(0x80 | ((c >> 6)& 63));
					this.writeByte(0x80 | (c & 63));
				}
			}
			this.setlength(this._position_);
		}

		__proto.__fromBytes=function(inBytes){
			this._byteView_=new Uint8Array(inBytes.getData ());
			this.setlength(this._byteView_.length);
			this._allocated_=this.length;
		}

		__proto.__get=function(pos){
			return this._data_.getUint8(pos);
		}

		__proto._getUTFBytesCount=function(value){
			var count=0;
			value=value+"";
			for (var i=0,sz=value.length;i < sz;i++){
				var c=value.charCodeAt(i);
				if (c <=0x7F){
					count+=1;
					}else if (c <=0x7FF){
					count+=2;
					}else if (c <=0xFFFF){
					count+=3;
					}else {
					count+=4;
				}
			}
			return count;
		}

		__proto._byteAt_=function(index){
			return this._byteView_[index];
		}

		__proto._byteSet_=function(index,value){
			this.ensureWrite (index+1);
			this._byteView_[index]=value;
		}

		//this._position_+=1;
		__proto.uncompress=function(algorithm){
			(algorithm===void 0)&& (algorithm="zlib");
			var inflate=new Zlib.Inflate(this._byteView_);
			this._byteView_=inflate.decompress();
			this._data_=new DataView(this._byteView_ .buffer);;
			this._allocated_=this._length=this._byteView_.byteLength;
			this._position_=0;
		}

		__proto.compress=function(algorithm){
			(algorithm===void 0)&& (algorithm="zlib");
			var deflate=new Zlib.Deflate(this._byteView_);
			this._byteView_=deflate.compress();
			this._data_=new DataView(this._byteView_.buffer);;
			this._position_=this._allocated_=this._length=this._byteView_.byteLength;
		}

		__proto.___resizeBuffer=function(len){
			try{
				var newByteView=new Uint8Array(len);
				if (this._byteView_!=null){
					if (this._byteView_.length <=len)newByteView.set (this._byteView_);
					else newByteView.set (this._byteView_.subarray (0,len));
				}
				this._byteView_=newByteView;
				this._data_=new DataView(newByteView.buffer);
			}
			catch (err){
				throw "___resizeBuffer err:"+len;
			}
		}

		__proto.__getBuffer=function(){
			this._data_.buffer.byteLength=this.length;
			return this._data_.buffer;
		}

		__proto.__set=function(pos,v){
			this._data_.setUint8 (pos,v);
		}

		__proto.setUint8Array=function(data){
			this._byteView_=data;
			this._data_=new DataView(data.buffer);
			this._length=data.byteLength;
			this._position_=0;
		}

		/**从字节数组中读取一个以 AMF 序列化格式进行编码的对象 **/
		__proto.readObject=function(){
			this._strTable=[];
			this._objTable=[];
			this._traitsTable=[];
			return this.readObject2();
		}

		__proto.readObject2=function(){
			var type=this.readByte();
			return this.readObjectValue(type);
		}

		__proto.readObjectValue=function(type){
			var value;
			switch (type){
				case 1:
					break ;
				case 6:
					value=this.__readString();
					break ;
				case 4:
					value=this.readInterger();
					break ;
				case 2:
					value=false;
					break ;
				case 3:
					value=true;
					break ;
				case 10:
					value=this.readScriptObject();
					break ;
				case 9:
					value=this.readArray();
					break ;
				case 5:
					value=this.readDouble();
					break ;
				case 12:
					value=this.readByteArray();
					break ;
				default :
					console.log("Unknown object type tag!!!"+type);
				}
			return value;
		}

		__proto.readByteArray=function(){
			var ref=this.readUInt29();
			if ((ref & 1)==0){
				return this.getObjRef(ref >> 1);
			}
			else{
				var len=(ref >> 1);
				var ba=new TLByteArray();
				this._objTable.push(ba);
				this.readBytes(ba,0,len);
				return ba;
			}
		}

		__proto.readInterger=function(){
			var i=this.readUInt29();
			i=(i << 3)>> 3;
			return parseInt(i+"");
		}

		__proto.getStrRef=function(ref){
			return this._strTable[ref];
		}

		__proto.getObjRef=function(ref){
			return this._objTable[ref];
		}

		__proto.__readString=function(){
			var ref=this.readUInt29();
			if ((ref & 1)==0){
				return this.getStrRef(ref >> 1);
			};
			var len=(ref >> 1);
			if (0==len){
				return "";
			};
			var str=this.readUTFBytes(len);
			this._strTable.push(str);
			return str;
		}

		__proto.readTraits=function(ref){
			var ti;
			if ((ref & 3)==1){
				ti=this.getTraitReference(ref >> 2);
				return ti.propoties?ti:{obj:{}};
			}
			else{
				var externalizable=((ref & 4)==4);
				var isDynamic=((ref & 8)==8);
				var count=(ref >> 4);
				var className=this.__readString();
				ti={};
				ti.className=className;
				ti.propoties=[];
				ti.dynamic=isDynamic;
				ti.externalizable=externalizable;
				if(count>0){
					for(var i=0;i<count;i++){
						var propName=this.__readString();
						ti.propoties.push(propName);
					}
				}
				this._traitsTable.push(ti);
				return ti;
			}
		}

		__proto.readScriptObject=function(){
			var ref=this.readUInt29();
			if ((ref & 1)==0){
				return this.getObjRef(ref >> 1);
			}
			else{
				var objref=this.readTraits(ref);
				var className=objref.className;
				var externalizable=objref.externalizable;
				var obj;
				var propName;
				var pros=objref.propoties;
				if(className&&className!=""){
					var rst=ClassUtils.getRegClass(className);
					if(rst){
						obj=new rst();
						}else{
						obj={};
					}
					}else{
					obj={};
				}
				this._objTable.push(obj);
				if(pros){
					for(var d=0;d<pros.length;d++){
						obj[pros[d]]=this.readObject2();
					}
				}
				if(objref.dynamic){
					for (;;){
						propName=this.__readString();
						if (propName==null || propName.length==0)break ;
						obj[propName]=this.readObject2();
					}
				}
				return obj;
			}
		}

		__proto.readArray=function(){
			var ref=this.readUInt29();
			if ((ref & 1)==0){
				return this.getObjRef(ref >> 1);
			};
			var obj=null;
			var count=(ref >> 1);
			var propName;
			for (;;){
				propName=this.__readString();
				if (propName==null || propName.length==0)break ;
				if (obj==null){
					obj={};
					this._objTable.push(obj);
				}
				obj[propName]=this.readObject2();
			}
			if (obj==null){
				obj=[];
				this._objTable.push(obj);
				var i=0;
				for (i=0;i < count;i++){
					obj.push(this.readObject2());
				}
				}else {
				for (i=0;i < count;i++){
					obj[i.toString()]=this.readObject2();
				}
			}
			return obj;
		}

		/**
		*AMF 3 represents smaller integers with fewer bytes using the most
		*significant bit of each byte. The worst case uses 32-bits
		*to represent a 29-bit number,which is what we would have
		*done with no compression.
		*<pre>
		*0x00000000-0x0000007F :0xxxxxxx
		*0x00000080-0x00003FFF :1xxxxxxx 0xxxxxxx
		*0x00004000-0x001FFFFF :1xxxxxxx 1xxxxxxx 0xxxxxxx
		*0x00200000-0x3FFFFFFF :1xxxxxxx 1xxxxxxx 1xxxxxxx xxxxxxxx
		*0x40000000-0xFFFFFFFF :throw range exception
		*</pre>
		*
		*@return A int capable of holding an unsigned 29 bit integer.
		*@throws IOException
		*@exclude
		*/
		__proto.readUInt29=function(){
			var value=0;
			var b=this.readByte()& 0xFF;
			if (b < 128){
				return b;
			}
			value=(b & 0x7F)<< 7;
			b=this.readByte()& 0xFF;
			if (b < 128){
				return (value | b);
			}
			value=(value | (b & 0x7F))<< 7;
			b=this.readByte()& 0xFF;
			if (b < 128){
				return (value | b);
			}
			value=(value | (b & 0x7F))<< 8;
			b=this.readByte()& 0xFF;
			return (value | b);
		}

		//============================================================================================
		__proto.writeObject=function(o){
			this._strTable=[];
			this._objTable=[];
			this._traitsTable=[];
			this.writeObject2(o);
		}

		__proto.writeObject2=function(o){
			if(o==null){
				this.writeAMFNull();
				return;
			};
			var type=typeof(o);
			if("string"===type){
				this.writeAMFString(o);
			}
			else if("boolean"===type){
				this.writeAMFBoolean(o);
			}
			else if("number"===type){
				if(String(o).indexOf(".")!=-1){
					this.writeAMFDouble(o);
				}
				else{
					this.writeAMFInt(o);
				}
			}
			else if("object"===type){
				if((o instanceof Array)){
					this.writeArray(o);
				}
				else if((o instanceof TLByteArray )){
					this.writeAMTLByteArray(o);
				}
				else{
					this.writeCustomObject(o);
				}
			}
		}

		__proto.writeAMFNull=function(){
			this.writeByte(1);
		}

		__proto.writeAMFString=function(s){
			this.writeByte(6);
			this.writeStringWithoutType(s);
		}

		__proto.writeStringWithoutType=function(s){
			if (s.length==0){
				this.writeUInt29(1);
				return;
			};
			var ref=this._strTable.indexOf(s);
			if(ref>=0){
				this.writeUInt29(ref << 1);
				}else{
				var utflen=this._getUTFBytesCount(s);
				this.writeUInt29((utflen << 1)| 1);
				this.writeUTFBytes(s);
				this._strTable.push(s);
			}
		}

		__proto.writeAMFInt=function(i){
			if (i >=TLByteArray.INT28_MIN_VALUE && i <=0x0FFFFFFF){
				i=i & 0x1FFFFFFF;
				this.writeByte(4);
				this.writeUInt29(i);
				}else {
				this.writeAMFDouble(i);
			}
		}

		__proto.writeAMFDouble=function(d){
			this.writeByte(5);
			this.writeDouble(d);
		}

		__proto.writeAMFBoolean=function(b){
			if (b)
				this.writeByte(3);
			else
			this.writeByte(2);
		}

		__proto.writeCustomObject=function(o){
			this.writeByte(10);
			var refNum=this._objTable.indexOf(o);
			if(refNum!=-1){
				this.writeUInt29(refNum << 1);
			}
			else{
				this._objTable.push(o);
				var traitsInfo=new Object();
				traitsInfo.className=this.getAliasByObj(o);
				traitsInfo.dynamic=false;
				traitsInfo.externalizable=false;
				traitsInfo.properties=[];
				for(var prop in o){
					if((typeof (o[prop])=='function'))continue ;
					traitsInfo.properties.push(prop);
					traitsInfo.properties.sort();
				};
				var tRef=TLByteArray.getTraitsInfoRef(this._traitsTable,traitsInfo);
				var count=traitsInfo.properties.length;
				var i=0;
				if(tRef>=0){
					this.writeUInt29((tRef << 2)| 1);
					}else{
					this._traitsTable.push(traitsInfo);
					this.writeUInt29(3 | (traitsInfo.externalizable ? 4 :0)| (traitsInfo.dynamic ? 8 :0)| (count << 4));
					this.writeStringWithoutType(traitsInfo.className);
					for(i=0;i<count;i++){
						this.writeStringWithoutType(traitsInfo.properties[i]);
					}
				}
				for(i=0;i<count;i++){
					this.writeObject2(o[traitsInfo.properties[i]]);
				}
			}
		}

		/**
		*获取实例的注册别名
		*@param obj
		*@return
		*/
		__proto.getAliasByObj=function(obj){
			var tClassName=ClassUtils.getRegClass(obj);
			if(tClassName==null || tClassName=="")return "";
			var tClass=ClassUtils.getClass(tClassName);
			if(tClass==null)return "";
			var tkey;
			for(tkey in this.classDic){
				if(this.classDic[tkey]==tClass){
					return tkey;
				}
			}
			return "";
		}

		__proto.writeArray=function(value){
			this.writeByte(9);
			var len=value.length;
			var ref=this._objTable.indexOf(value);
			if(ref>-1){
				this.writeUInt29(len<<1);
			}
			else{
				this.writeUInt29((len << 1)| 1);
				this.writeStringWithoutType("");
				for (var i=0;i < len;i++){
					this.writeObject2(value[i]);
				}
				this._objTable.push(value);
			}
		}

		__proto.writeAMTLByteArray=function(ba){
			this.writeByte(12);
			var ref=this._objTable.indexOf(ba);
			if(ref>=0){
				this.writeUInt29(ref << 1);
				}else{
				var len=ba.length;
				this.writeUInt29((len << 1)| 1);
				this.writeBytes(ba,0,len);
			}
		}

		__proto.writeMapAsECMAArray=function(o){
			this.writeByte(9);
			this.writeUInt29((0 << 1)| 1);
			var count=0,key;
			for (key in o){
				count++;
				this.writeStringWithoutType(key);
				this.writeObject2(o[key]);
			}
			this.writeStringWithoutType("");
		}

		__proto.writeUInt29=function(ref){
			if (ref < 0x80){
				this.writeByte(ref);
				}else if (ref < 0x4000){
				this.writeByte(((ref >> 7)& 0x7F)| 0x80);
				this.writeByte(ref & 0x7F);
				}else if (ref < 0x200000){
				this.writeByte(((ref >> 14)& 0x7F)| 0x80);
				this.writeByte(((ref >> 7)& 0x7F)| 0x80);
				this.writeByte(ref & 0x7F);
				}else if (ref < 0x40000000){
				this.writeByte(((ref >> 22)& 0x7F)| 0x80);
				this.writeByte(((ref >> 15)& 0x7F)| 0x80);
				this.writeByte(((ref >> 8)& 0x7F)| 0x80);
				this.writeByte(ref & 0xFF);
				}else {
				console.log("Integer out of range: "+ref);
			}
		}

		/**
		*@exclude
		*/
		__proto.getTraitReference=function(ref){
			return this._traitsTable[ref];
		}

		//-----------------------------------------------------------------//
		__proto.workTest=function(data){
			return "鲁大师开发上的浪费商量点事发牢骚";
		}

		// Getters & Setters
		__proto.bytesAvailable=function(){
			return this.length-this._position_;
		}

		__proto.endian=function(){
			return this._littleEndian_ ? "littleEndian" :"bigEndian";
		}
		__proto.setendian=function(endianStr){
			this._littleEndian_=(endianStr=="littleEndian");
		}

		__proto.length=function(){
			return this._length;
		}
		__proto.setlength=function(value){
			this.___resizeBuffer (this._allocated_=value);
			this._length=value;
		}

		__proto.pos=function(){
			return this._position_;
		}
		__proto.setpos=function(pos){
			if (pos < this._length)
				this._position_=pos < 0?0:pos;
			else{
				this._position_=pos;
				this.setlength(pos);
			}
		}

		TLByteArray.__ofBuffer=function(buffer){
			var bytes=new ByteArray ();
			bytes.setlength(bytes.allocated=buffer.byteLength);
			bytes.data=new DataView(buffer);
			bytes.byteView=new Uint8Array(buffer);
			return bytes;
		}

		TLByteArray.getTraitsInfoRef=function(arr,ti){
			var i=0,len=arr.length;
			for(i=0;i<len;i++){
				if (TLByteArray.equalsTraitsInfo(ti,arr[i]))return i;
			}
			return-1;
		}

		TLByteArray.equalsTraitsInfo=function(ti1,ti2){
			if (ti1==ti2){
				return true;
			}
			if (!ti1.className===ti2.className){
				return false;
			}
			if(ti1.properties.length !=ti2.properties.length){
				return false;
			};
			var len=ti1.properties.length;
			var prop;
			ti1.properties.sort();ti2.properties.sort();
			for(var i=0;i<len;i++){
				if(ti1.properties[i] !=ti2.properties[i]){
					return false;
				}
			}
			return true;
		}

		TLByteArray.DecodeInt = function(src)
		{
			var intbtkey = (TLByteArray.btkey << 24) | (TLByteArray.btkey << 16) | (TLByteArray.btkey << 8) | TLByteArray.btkey;
			return src ^ intbtkey;			
		}

		TLByteArray.InitEncoreChar=function(){
			var encodeChars=[];
			var chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
			for (var i=0;i < 64;i++){
				encodeChars.push(chars.charCodeAt(i));
			}
			return encodeChars;
		}
		
		TLByteArray.mDirCount=0;
		TLByteArray.btkey=0;
		TLByteArray.BIG_ENDIAN="bigEndian";
		TLByteArray.LITTLE_ENDIAN="littleEndian";
		TLByteArray.UNDEFINED_TYPE=0;
		TLByteArray.NULL_TYPE=1;
		TLByteArray.FALSE_TYPE=2;
		TLByteArray.TRUE_TYPE=3;
		TLByteArray.INTEGER_TYPE=4;
		TLByteArray.DOUBLE_TYPE=5;
		TLByteArray.STRING_TYPE=6;
		TLByteArray.XML_TYPE=7;
		TLByteArray.DATE_TYPE=8;
		TLByteArray.ARRAY_TYPE=9;
		TLByteArray.OBJECT_TYPE=10;
		TLByteArray.AVMPLUSXML_TYPE=11;
		TLByteArray.BYTEARRAY_TYPE=12;
		TLByteArray.EMPTY_STRING="";
		TLByteArray.UINT29_MASK=0x1FFFFFFF;
		TLByteArray.INT28_MAX_VALUE=0x0FFFFFFF;
		TLByteArray.INT28_MIN_VALUE=-268435456;
		TLByteArray.gb2unicodechar={};
		TLByteArray.unicodegb2char={};


module.exports = TLByteArray;