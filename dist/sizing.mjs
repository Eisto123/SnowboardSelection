export const sizingSource='https://ridesnowboards.com/en-us/support/how-to-choose-a-snowboard';
// RIDE's generic adult starting chart. Intermediate heights use disclosed linear interpolation.
export const heightChart=[{height:152,ranges:[[138,144],[142,148],[146,152]]},{height:163,ranges:[[144,150],[148,154],[152,158]]},{height:173,ranges:[[150,156],[154,160],[158,164]]},{height:183,ranges:[[156,162],[160,166],[164,170]]}];
export function generalLengthRange(height,weight=0){height=Number(height);weight=Number(weight);if(!Number.isFinite(height)||height<152||height>183)return null;const hi=heightChart.findIndex(r=>r.height>=height),a=heightChart[Math.max(0,hi-1)],b=heightChart[hi];const t=a.height===b.height?0:(height-a.height)/(b.height-a.height);const columns=weight>0?[weight<59?0:weight<=82?1:2]:[0,1,2];const lows=columns.map(i=>a.ranges[i][0]+(b.ranges[i][0]-a.ranges[i][0])*t),highs=columns.map(i=>a.ranges[i][1]+(b.ranges[i][1]-a.ranges[i][1])*t);return [Math.floor(Math.min(...lows)),Math.ceil(Math.max(...highs))];}
export function lengthRecommendation(p,{weight=0,height=0,general=true}={}){weight=Number(weight);height=Number(height);if(p.fit.length){const sizes=weight>0?p.fit.filter(x=>weight>=x.weightKg[0]&&(x.weightKg[1]===null||weight<=x.weightKg[1])).map(x=>x.length):[];return {kind:'official',sizes,reason:weight>0?(sizes.length?'match':'outside-weight-range'):'needs-weight',source:p.source};}
 if(!general)return {kind:'none',sizes:[],reason:'official-only'};
 const special=p.gender==='Youth'||/powder.?surf|swallow|volume.?shift|short.?wide|short.?fat|hammer.?head|减短|缩短|短宽|燕尾|锤头|swallowtail/i.test([p.model,p.family,p.shapeOriginal,p.shapeNote,...p.notes].join(' '));
 if(special)return {kind:'none',sizes:[],reason:'special-design'};
 const range=generalLengthRange(height,weight);if(!range)return {kind:'none',sizes:[],reason:height?'height-outside-chart':'needs-height'};
 return {kind:'estimate',range,sizes:p.sizes.filter(s=>parseFloat(s)>=range[0]&&parseFloat(s)<=range[1]),reason:'generic-starting-point',source:sizingSource};
}
