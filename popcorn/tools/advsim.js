// 모험 50스테이지를 봇(지능 5)으로 자동 진행해 깰 수 있는지 확인
// 사용법: node advsim.js <index.html 경로> [반복 횟수] [hard]
const fs=require('fs');
const html=fs.readFileSync(process.argv[2],'utf8');
new Function(html.match(/<script id="game">([\s\S]*?)<\/script>/)[1])();
const POP=globalThis.POP;
const tries=+(process.argv[3]||4);
// 세 번째 인자: hard(어려움) 또는 god(봇 무적, 기능 검증용)
const res=POP.simAdv({tries,hard:process.argv[4]==='hard',god:process.argv[4]==='god'});
let errs=0;
for(const r of res){
  errs+=r.errs.length;
  console.log(`월드${r.wi+1}-${r.si+1} ${r.type.padEnd(5)} 성공 ${r.wins}/${r.tries}  평균 ${r.avg.toFixed(0)}초  별 ${r.stars}`+(r.errs.length?'  오류 '+r.errs.length:''));
}
console.log('총 오류',errs);
const e=res.find(r=>r.errs.length);if(e)console.log(e.errs[0]);
