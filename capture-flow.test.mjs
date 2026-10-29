import vm from 'node:vm';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as analysis from './analysis.mjs';
let clock=0,seq=0,raf=new Map(),intervals=new Map(),stopped=0;
const drawing=new Proxy({getImageData:(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4).fill(255)}),createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),createRadialGradient:()=>({addColorStop(){}})},{get:(o,k)=>k in o?o[k]:()=>{}});
class Element{
 constructor(){this.value='';this.children=[];this.dataset={};this.style={setProperty(){}};this.classList={toggle(){},remove(){}};this.hidden=false;this.checked=false;this.disabled=false;this.clientWidth=400;this.clientHeight=200;this.width=350;this.height=450;this.textContent='';this.selectedOptions=[{textContent:'Carta · página 1'}]}
 getContext(){return drawing}setAttribute(){}replaceChildren(...c){this.children=c}append(...c){this.children.push(...c)}querySelector(){return new Element()}scrollIntoView(){}async play(){}getBoundingClientRect(){return {left:0,top:0,width:350,height:450}}click(){}close(){}showModal(){}toDataURL(){return ''}
}
const elements=new Map(),html=fs.readFileSync('index.html','utf8');
for(const m of html.matchAll(/<[^>]*\bid="([^"]+)"[^>]*>/g)){let e=new Element(),v=m[0].match(/\bvalue="([^"]*)"/);if(v)e.value=v[1];e.hidden=/\bhidden\b/.test(m[0]);elements.set('#'+m[1],e)}
for(const [id,val] of Object.entries({gridOrder:'rows',gridScale:'pentatonic',transpose:'0',cellSound:'a',cellNote:'0',echoTimbre:'auto',echoShift:'0'}))elements.get('#'+id).value=val;
const document={querySelector:s=>elements.get(s),querySelectorAll:s=>s==='[data-cell]'?elements.get('#zoneGrid').children:[],createElement:()=>new Element()};
class Node{constructor(){this.gain={value:1,setValueAtTime(){},linearRampToValueAtTime(){},setTargetAtTime(){},exponentialRampToValueAtTime(){}};this.threshold={value:0};this.ratio={value:0};this.pan={value:0};this.frequency={value:0};this.playbackRate={value:1}}connect(n){return n}disconnect(){}start(){}stop(){}}
class Audio{
 constructor(){this.state='running';this.destination={};this.sampleRate=48000}
 get currentTime(){return clock/1000}async resume(){this.state='running'}createGain(){return new Node()}createDynamicsCompressor(){return new Node()}createMediaStreamSource(){return new Node()}createBufferSource(){return new Node()}createStereoPanner(){return new Node()}createOscillator(){return new Node()}
 createAnalyser(){return Object.assign(new Node(),{fftSize:2048,frequencyBinCount:1024,getFloatTimeDomainData(a){let amp=clock<1500?.0003:.006;for(let i=0;i<a.length;i++)a[i]=amp*Math.sin(2*Math.PI*220*i/48000)},getByteFrequencyData(a){a.fill(20)}})}
 async decodeAudioData(){return {duration:2}}
}
const context={...analysis,document,window:{addEventListener(){},inkDimensions:null},console:{info(){},warn(){}},navigator:{mediaDevices:{async getUserMedia(){return {getTracks:()=>[{stop(){stopped++}}]}}}},AudioContext:Audio,Float32Array,Uint8Array,Uint8ClampedArray,ArrayBuffer,DataView,Math,Map,Set,Promise,Number,String,Object,Array,Error,Date,Option:class extends Element{constructor(t,v){super();this.textContent=t;this.value=String(v)}},performance:{now:()=>clock},devicePixelRatio:1,matchMedia:()=>({matches:true}),requestAnimationFrame:f=>{raf.set(++seq,f);return seq},cancelAnimationFrame:i=>raf.delete(i),setInterval:f=>{intervals.set(++seq,f);return seq},clearInterval:i=>intervals.delete(i),setTimeout(){},URL:{},Image:Element,fetch:async url=>({ok:true,json:async()=>url==='audio/manifest.json'?[{id:'o',name:'Cavidad',file:'audio/o.wav',duration:2.4}]:[],arrayBuffer:async()=>new ArrayBuffer(8)})};
const code=fs.readFileSync('app.js','utf8').replace(/^import[^\n]+\n/,'');
await vm.runInNewContext('(async()=>{'+code+'})()',context);
const el=id=>elements.get('#'+id);
await el('tab-eco').onclick();await el('record').onclick();assert.equal(el('finish').disabled,false);assert.equal(el('playEcho').disabled,true);
for(let n=0;n<65;n++){clock+=100;const batch=[...raf.values()];raf.clear();for(const f of batch)f(clock)}
el('finish').onclick();assert.equal(el('playEcho').disabled,false,'play enabled after finishing');assert.match(el('echoSummary').textContent,/Eco listo/);assert.ok(stopped>0,'device tracks stopped');
await el('playEcho').onclick();await new Promise(resolve=>setImmediate(resolve));assert.equal(el('stopEcho').disabled,false,'echo starts playing');el('stopEcho').onclick();
el('tab-huella').onclick();el('demo').onclick();el('tab-eco').onclick();assert.equal(el('playEcho').disabled,false,'recording survives document changes');
el('voiceSensitivity').value='300';el('voiceSensitivity').oninput();assert.equal(el('playEcho').disabled,false,'can remap without recording again');
console.log('OK: capture → finish → listen; tracks released; echo retained across document changes; sensitivity remapping. (Simulated microphone/browser APIs.)');
