/**
 * Created by Administrator on 2017/9/8.
 */

var dgram = require('dgram');
var ws = require("ws");
var WebSocketServer = ws.Server;
var socket = new WebSocketServer({port:8181});

var Core = require("./Core.js");
var NetProtol = require("./NetProtol.js");
var ByteArray = require("./byteArray.js");
var ProtoBuf = require("protobufjs");
var builder = ProtoBuf.loadProtoFile("helloworld.proto");
var Cover = builder.build("cover");
var HelloCoverReq = Cover.helloworld.helloCoverReq;
var HelloCoverRsp = Cover.helloworld.helloCoverRsp;
var SC_initTank = Cover.helloworld.SC_initTank;

var head = new Cover.HeadId();
head.id = 22222222;

var id = 0;
var clients = [];


socket.on("connection", function(ws){

    id ++;
    console.log("client connected!" + id);
    var user = new Core.ClientUser();
    user.id = id;
    user.ws = ws;
    clients.push(user);

    var obj = new SC_initTank();
    obj.angle = 90;
    obj.moveSpeed = 5;
    obj.angleSpeed = 2;
    obj.posX = Math.floor(200 + Math.random() * 1300);
    obj.posY = 300;
    user.tank = obj;

    for(var i=0; i<clients.length; i++)
    {
        ws = clients[i].ws;

        var buffer = obj.encode();
        var msg = buffer.toBuffer();
        var byte = new ByteArray();
        byte.writeInt(NetProtol.INIT_TANKE);
        byte.writeArrayBuffer(msg);
        ws.send(byte.__getBuffer());
    }
    for( i=0; i<clients.length-1; i++)
    {
        ws = clients[clients.length-1].ws;
        obj = clients[i].tank;
        var buffer = obj.encode();
        var msg = buffer.toBuffer();
        var byte = new ByteArray();
        byte.writeInt(NetProtol.INIT_TANKE);
        byte.writeArrayBuffer(msg);
        ws.send(byte.__getBuffer());
    }

    ws.on("message", function(msg){

        console.log("client message!" + msg);

    });
    ws.on("close", function(msg){

        console.log("client closed!" + msg);

    });
});