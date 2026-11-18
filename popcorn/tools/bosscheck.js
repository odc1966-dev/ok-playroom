// 보스 10종 기능 검증: 패턴이 모두 나오는지, 쓰러뜨리면 스테이지가 끝나는지
// 사용법: node bosscheck.js <index.html 경로>
const fs=require('fs');
const html=fs.readFileSync(process.argv[2],'utf8');
new Function(html.match(/<script id="game">([\s\S]*?)<\/script>/)[1])();
const POP=globalThis.POP;
let bad=0;
for(let wi=0;wi<10;wi++){
  const used={};let ok=0,errs=[];
  for(let t=0;t<3;t++){
    const cfg=POP.advConfig(wi,4,t,false,true,9000+wi*10+t);cfg.silent=true;cfg.skipCount=true;
    const w=POP.makeWorld(cfg);const me=w.players[0],b=w.boss;let n=0;
    try{
      // 1) 무적 상태로 120초 진행하며 패턴 수집 (2단계 패턴도 보려고 체력을 절반으로)
      b.hp=Math.floor(b.max/2);
      while(w.phase==='play'&&n<120*60){me.inv=1;if(me.state==='jelly')me.state='ok';POP.tick(w);n++;}
      // 2) 보스 발밑에 씨앗을 계속 터뜨려 쓰러뜨림
      let guard=0;
      while(w.phase==='play'&&guard++<60*60){
        me.inv=1;if(me.state==='jelly')me.state='ok';
        if(b.alive&&b.inv<=0&&b.hidden<=0&&!b.dash){const bx=Math.round(b.x),by=Math.round(b.y);const cand=[[bx,by],[bx+1,by],[bx,by+1],[bx+1,by+1]].filter(([x,y])=>w.tile[y*15+x]===0&&!w.seedG[y*15+x]);
          if(cand.length){const [x,y]=cand[0];const i=y*15+x;w.seedG[i]=null;const s={id:w.nid++,owner:me,x,y,fx:x,fy:y,fuse:0,range:1,ice:false,slide:null,fly:null,pass:new Set(),group:0,free:true,big:false,teleLock:-1,dead:false};w.seeds.push(s);w.seedG[i]=s;}}
        POP.tick(w);
      }
      if(w.adv.win)ok++;else errs.push('실패: '+(me.alive?'보스 체력 '+b.hp+' 남음':'플레이어 탈락('+me.cause+')'));
    }catch(e){errs.push(e.stack||String(e));}
    for(const k in (b.used||{}))used[k]=(used[k]||0)+b.used[k];
  }
  const B=POP.BOSSES[wi];const all=[...B.pats,...B.p2];const missing=all.filter(p=>!used[p]);
  if(ok<3||missing.length||errs.length)bad++;
  console.log(`월드${wi+1} ${B.name}: 처치·승리 ${ok}/3, 나온 패턴 ${Object.keys(used).length}/${all.length}`+(missing.length?' 안 나옴: '+missing.join(','):'')+(errs.length?' 참고: '+errs.join(' / '):''));
}
console.log(bad?'문제 있음 '+bad:'모두 통과');
