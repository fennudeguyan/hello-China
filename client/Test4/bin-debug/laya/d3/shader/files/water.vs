
uniform mat4 modelMatrix;
//uniform mat4 modelViewMatrix;
//uniform mat4 projectionMatrix;
uniform mat4 u_View;
uniform mat4 u_Project;
uniform mat4 mvp;
//uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform float u_curTm;

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 uv;
//uniform sampler2D texWaterDisp;
uniform sampler2D texWaterInfo;
uniform float u_WaveMainDir;	//主波方向

varying vec2 vUv;
varying vec3 vWorldNorm;
varying vec3 vWorldTan;
varying vec3 vWorldBin;
varying vec4 vViewPos;
varying vec4 vWorldPos;
varying vec3 vLightDir;
varying vec3 vViewDir;
varying vec3 vDisp;
varying float fDeep;
varying mat2 matUVTrans;
varying vec4 vWaterInfo;
varying float fFoam;

const float PI = 3.14159265358979323846264;

#include "WaveFunction.glsl"

vec2 getPosFromUV(vec2 uv){
	return uv*50.;
}

void main() {
	vec3 pos = a_position;
	float tt = pos.y;
	pos.y=pos.z; pos.z=-tt;
    vUv = uv;
	//vDisp = texture2D(texWaterDisp,uv).rgb;
	//vec3 disp = vDisp;
	
	fDeep = -pos.y;
	vWaterInfo = texture2D(texWaterInfo,uv);
	fDeep = vWaterInfo.r;
	
	pos.y=0.0;
	
	//计算波形
	vec3 opos, T,B,N;
	float foams=0.;
	calcGerstnerWave(u_curTm, pos,fDeep, uv,opos,B,T,N,foams);
	fFoam = foams;
	gl_Position = mvp*vec4(opos,1.);
	mat4 modelMat = modelMatrix;
	vWorldPos = modelMat*vec4(opos,1.);

	vWorldNorm = normalize((modelMatrix*vec4(N,0.0)).xyz);
	vWorldTan = normalize((modelMatrix*vec4(T,0.0)).xyz);
	vWorldBin = normalize((modelMatrix*vec4(B,0.0)).xyz);
    vViewDir = vWorldPos.xyz-cameraPosition; //这个不能取normalize，否则会引入非线性
	
	float s = sin(u_WaveMainDir);
	float c = cos(u_WaveMainDir);
	matUVTrans = mat2(c,-s,s,c);
}
