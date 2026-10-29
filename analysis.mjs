export const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
export function detectRows(mask,w,h){
 const hist=Array.from({length:h},(_,y)=>{let n=0;for(let x=0;x<w;x++)n+=mask[y*w+x];return n/w});
 const smooth=hist.map((_,y)=>{let n=0,c=0;for(let k=Math.max(0,y-2);k<=Math.min(h-1,y+2);k++){n+=hist[k];c++}return n/c});
 let rows=[],start=-1,gap=0;
 for(let y=0;y<=h;y++){if(y<h&&smooth[y]>.008){if(start<0)start=y;gap=0}else if(start>=0){gap++;if(gap>6||y===h){let end=y-gap+1;if(end-start>=3)rows.push({y0:Math.max(0,start-2),y1:Math.min(h,end+2)});start=-1;gap=0}}}
 return rows;
}
export function inkEvents(mask,w,h,rows,seconds){
 let events=[],total=0; const notes=[0,2,5,7,9,12,14,17],ids=['u','o','a','e','i'];
 rows.forEach((r,ri)=>{let left=w,right=0;for(let y=r.y0;y<r.y1;y++)for(let x=0;x<w;x++)if(mask[y*w+x]){left=Math.min(left,x);right=Math.max(right,x)}
 if(right<=left)return;let cols=48,step=(right-left+1)/cols;
 for(let c=0;c<cols;c++){let x0=Math.floor(left+c*step),x1=Math.max(x0+1,Math.ceil(left+(c+1)*step)),count=0,ys=0,edges=0;
 for(let y=r.y0;y<r.y1;y++)for(let x=x0;x<Math.min(w,x1);x++){let v=mask[y*w+x];if(v){count++;ys+=y;if(x+1<w&&mask[y*w+x+1]!==v)edges++;if(y+1<h&&mask[(y+1)*w+x]!==v)edges++}}
 let density=count/((x1-x0)*(r.y1-r.y0));if(density<.025)continue;
 let elevation=1-(ys/count-r.y0)/(r.y1-r.y0),complexity=edges/Math.max(count,1),idx=Math.floor(clamp(elevation)*7);
 events.push({time:total+c/cols*seconds,id:complexity<.14?'m':ids[Math.min(4,Math.floor(clamp(complexity/1.3)*5))],note:notes[idx],amp:.14+.32*clamp(density*2),duration:Math.min(.85,seconds/cols*(1.6+clamp(density)*2)),pan:clamp((x0/w)*2-1,-.7,.7),row:ri,x:x0/w,y:(r.y0+r.y1)/2/h,density});
 if(complexity>.95&&c%6===0)events.push({time:total+c/cols*seconds,id:'s',note:0,amp:.09,duration:.24,pan:0,row:ri,x:x0/w,y:(r.y0+r.y1)/2/h,density});
 if(density>.5&&c%3===0)events.push({time:total+c/cols*seconds+.04,id:'ka',note:0,amp:.11,duration:.2,pan:0,row:ri,x:x0/w,y:(r.y0+r.y1)/2/h,density});
 }total+=seconds+.65;});return {events,duration:total};
}
export function pitchOf(a,sr){
 let rms=Math.sqrt(a.reduce((s,x)=>s+x*x,0)/a.length);if(rms<.009)return null;
 const min=Math.floor(sr/500),max=Math.min(Math.floor(sr/75),Math.floor(a.length/2)),cs=[];
 let best=0,lag=0;
 for(let l=min;l<=max;l++){let cross=0,aa=0,bb=0;for(let i=0;i<a.length-max;i++){cross+=a[i]*a[i+l];aa+=a[i]*a[i];bb+=a[i+l]*a[i+l]}let c=cross/Math.sqrt(aa*bb+1e-12);cs[l]=c;if(c>best){best=c;lag=l}}
 if(best<.7)return null;
 // Prefer the earliest strong periodic peak to avoid octave-down errors.
 for(let l=min+1;l<max;l++)if(cs[l]>=Math.max(.85,best*.93)&&cs[l]>cs[l-1]&&cs[l]>=cs[l+1]){lag=l;break}
 return sr/lag;
}
export function nearestNote(hz){const scale=[0,2,5,7,9,12,14,17,19,21,24];let n=12*Math.log2(hz/130.8128);return scale.reduce((best,x)=>Math.abs(x-n)<Math.abs(best-n)?x:best,0)}
export function echoEvents(frames,noise){let events=[],last=-1;for(const f of frames){if(f.time<1.5||f.rms<Math.max(.009,noise*2.8))continue;if(f.time-last<.28)continue;last=f.time;let open=f.face?f.mouth:.3;events.push({time:f.time,id:f.pitch?(open>.45?'a':open>.18?'o':'u'):'f',note:f.pitch?nearestNote(f.pitch):0,amp:clamp(f.rms*3,.12,.48),duration:.3+clamp(open)*.45,pan:clamp(f.pan||0,-.7,.7),density:clamp(f.rms*6)});if(f.face&&f.gesture>.35)events.push({time:f.time+.06,id:'ta',note:0,amp:.09,duration:.15,pan:f.pan||0,density:.3})}return events}

// Each grid cell keeps an editable timbre/note; empty cells remain silent.
export function gridCells(mask,w,h,rowCount,colCount){
 const notes=[0,2,5,7,9,12,14,17],vowels=['u','o','a','e','i'],cells=[];
 for(let r=0;r<rowCount;r++)for(let c=0;c<colCount;c++){
  const x0=Math.floor(c*w/colCount),x1=Math.floor((c+1)*w/colCount),y0=Math.floor(r*h/rowCount),y1=Math.floor((r+1)*h/rowCount);
  let count=0,edges=0,ys=0;
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(mask[y*w+x]){count++;ys+=y;if(x+1<x1&&!mask[y*w+x+1])edges++;if(y+1<y1&&!mask[(y+1)*w+x])edges++}
  let density=count/Math.max(1,(x1-x0)*(y1-y0)),complexity=edges/Math.max(1,count),elevation=count?1-(ys/count-y0)/Math.max(1,y1-y0):.5;
  let id=density>.5?'ka':complexity<.14?'m':complexity>1.9&&density>.1?'s':vowels[Math.min(4,Math.floor(clamp(complexity/2)*5))];
  cells.push({row:r,col:c,x:c/colCount,y:r/rowCount,width:1/colCount,height:1/rowCount,density,id,note:notes[Math.min(7,Math.floor(clamp(elevation)*8))]});
 }return cells;
}
export function gridScore(cells,rowCount,colCount,seconds,order='rows',minDensity=.012){
 const step=seconds/(order==='rows'?colCount:rowCount),events=[];
 for(const c of cells){if(c.muted||c.density<minDensity)continue;const index=order==='columns'?c.col*rowCount+c.row:c.row*colCount+c.col;
  events.push({...c,time:index*step,amp:.14+.34*clamp(c.density*3),duration:Math.min(1.5,step*.8),pan:clamp((c.col+.5)/colCount*1.4-.7,-.7,.7)});
 }events.sort((a,b)=>a.time-b.time);return {kind:'huella',events,duration:seconds*(order==='rows'?rowCount:colCount)};
}
export function echoScore(frames,sensitivity=1){
 const finite=frames.filter(f=>Number.isFinite(f.time)&&Number.isFinite(f.rms));
 const baseline=finite.filter(f=>f.time<1.5).map(f=>f.rms).sort((a,b)=>a-b);
 const noise=baseline.length?baseline[Math.floor((baseline.length-1)*.2)]:0;
 // Low quantile avoids treating a word spoken during calibration as the room level.
 const threshold=Math.max(.0012,noise*1.65)/Math.max(.5,sensitivity);
 let events=[],last=-1;
 for(const f of finite){if(f.time<1.5||f.rms<threshold||f.time-last<.24)continue;last=f.time;
  const open=f.face?clamp(f.mouth):.3;
  events.push({time:f.time,id:f.pitch?(open>.45?'a':open>.18?'o':'u'):'f',note:f.pitch?nearestNote(f.pitch):0,amp:clamp((f.rms-threshold)*6,.14,.52),duration:.35+open*.5,pan:clamp(f.pan||0,-.7,.7),density:clamp(f.rms*6)});
  if(f.face&&f.gesture>.35)events.push({time:f.time+.06,id:'ta',note:0,amp:.1,duration:.16,pan:f.pan||0,density:.3});
 }
 const start=events.length?events[0].time:0;
 events=events.map(e=>({...e,time:e.time-start+.08}));
 return {kind:'eco',events,duration:events.length?Math.max(.5,finite.at(-1).time-start+.15):0,threshold,peak:Math.max(0,...finite.map(f=>f.rms)),samples:finite.length};
}
