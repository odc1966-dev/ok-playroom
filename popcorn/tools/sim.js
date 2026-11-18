// 사용법: node sim.js <index.html 경로> [모드]
const fs=require('fs');
const html=fs.readFileSync(process.argv[2],'utf8');
const m=html.match(/<script id="game">([\s\S]*?)<\/script>/);
new Function(m[1])();
const POP=globalThis.POP;
const mode=process.argv[3]||'all';
const pct=(r,l)=>r.playsByLv[l]?Math.round((r.winsByLv[l]||0)/r.playsByLv[l]*100)+'%':'-';
function show(name,r){
  console.log(`== ${name}: ${r.games}판, 오류 ${r.errors.length}, 평균 ${r.avgTime.toFixed(1)}초, 무승부 ${r.draws}, 서든데스 ${r.sdReached}, 자기탈락 ${r.selfKills}/${r.deaths}, 틱최대 ${r.maxTickMs}ms, 틱평균 ${(r.totalMs/r.totalTicks).toFixed(3)}ms`);
  console.log('   지능별 승률', [1,2,3,4,5].map(l=>l+':'+pct(r,l)).join(' '));
  if(r.errors.length) console.log(r.errors.slice(0,3).join('\n---\n'));
}
if(mode==='all'||mode==='duel'){
  for(const [a,b] of [[5,1],[4,2],[3,1],[5,3]]){
    const r=POP.simulate({games:60,n:2,levels:[a,b],seed:11+a*7+b});
    show(`1대1 지능${a} vs 지능${b}`,r);
  }
}
if(mode==='all'||mode==='maps'){
  for(let mp=0;mp<10;mp++){
    const r=POP.simulate({games:30,n:4,levels:[4,4,4,4],maps:[mp],seed:100+mp});
    show(`맵${mp} ${POP.MAPS[mp].name} 지능4×4`,r);
  }
}
if(mode==='all'||mode==='eight'){
  const r=POP.simulate({games:40,n:8,levels:[5,5,5,5,5,5,5,5],seed:77});
  show('8인 달인',r);
}
if(mode==='chars'){
  const r=POP.simulate({games:400,n:4,levels:[4,4,4,4],seed:5});
  show('캐릭터 밸런스 지능4',r);
  const ids=Object.keys(r.playsByChar);
  console.log(ids.map(i=>POP.CHARS[i].name+':'+Math.round((r.winsByChar[i]||0)/r.playsByChar[i]*100)+'%').join(' '));
}
