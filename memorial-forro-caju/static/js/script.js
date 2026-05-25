"use strict";

/* ── REFS ── */
const splashScreen = document.getElementById("splash-screen");
const enterBtn     = document.getElementById("enter-btn");
const mainContent  = document.getElementById("main-content");
const bgAudio      = document.getElementById("bg-audio");
const muteBtn      = document.getElementById("mute-btn");
const volSlider    = document.getElementById("volume-slider");
const navbar       = document.getElementById("navbar");
const starsCanvas  = document.getElementById("stars-canvas");
const sparksCanvas = document.getElementById("sparks-canvas");

/* ══ 1. SPLASH ══ */
function enterSite() {
  startAudio();
  splashScreen.classList.add("fade-out");
  setTimeout(() => {
    splashScreen.style.display = "none";
    mainContent.classList.remove("hidden");
    initFestas();          // renderiza cards ANTES de animar
    animatePageIn();
  }, 800);
}
enterBtn.addEventListener("click", (e) => { createClickBurst(e.clientX, e.clientY); enterSite(); });
document.addEventListener("keydown", (e) => {
  if (!splashScreen.classList.contains("fade-out") &&
      ["Escape","Enter"," "].includes(e.key)) enterSite();
});

/* ══ 2. ÁUDIO ══ */
let isMuted = false, audioReady = false;
function startAudio() {
  if (audioReady) return; audioReady = true;
  bgAudio.volume = 0;
  bgAudio.play()
    .then(() => { fadeAudio(bgAudio, parseFloat(volSlider.value), 2800); updateMuteIcon(); })
    .catch(() => document.addEventListener("click", () => bgAudio.play(), { once: true }));
}
function fadeAudio(a, target, ms) {
  const steps=45, iv=ms/steps, inc=target/steps; let n=0;
  const t=setInterval(()=>{ n++; a.volume=Math.min(+(a.volume+inc).toFixed(3),target); if(n>=steps)clearInterval(t); },iv);
}
muteBtn.addEventListener("click", () => { isMuted=!isMuted; bgAudio.muted=isMuted; updateMuteIcon(); });
function updateMuteIcon() { muteBtn.textContent=isMuted?"🔇":"🪗"; muteBtn.title=isMuted?"Ativar som":"Mutar som"; }
volSlider.addEventListener("input", () => {
  const v=+volSlider.value; bgAudio.volume=v;
  volSlider.style.background=`linear-gradient(to right,var(--amber) ${v*100}%,rgba(255,255,255,.12) ${v*100}%)`;
  if(v>0&&isMuted){isMuted=false;bgAudio.muted=false;updateMuteIcon();}
});
document.addEventListener("visibilitychange", () => {
  if(!audioReady)return; document.hidden?bgAudio.pause():bgAudio.play().catch(()=>{});
});

/* ══ 3. NAVBAR SCROLL ══ */
window.addEventListener("scroll", () => navbar?.classList.toggle("scrolled", window.scrollY>40));

/* ══ 4. ESTRELAS ══ */
(function(){
  const ctx=starsCanvas.getContext("2d"); let W,H,stars=[];
  const resize=()=>{W=starsCanvas.width=window.innerWidth;H=starsCanvas.height=window.innerHeight;};
  const build=(n=220)=>{stars=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.3,speed:Math.random()*.007+.003,phase:Math.random()*Math.PI*2}));};
  const draw=(t)=>{ctx.clearRect(0,0,W,H);for(const s of stars){const a=.25+.75*Math.abs(Math.sin(t*s.speed+s.phase));ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(252,211,77,${a*.75})`;ctx.fill();}};
  const loop=(t)=>{draw(t/100);requestAnimationFrame(loop);};
  window.addEventListener("resize",()=>{resize();build();}); resize();build();loop(0);
})();

/* ══ 5. FAGULHAS ══ */
(function(){
  const ctx=sparksCanvas.getContext("2d"); let W,H,sparks=[];
  const C=["255,200,50","255,140,20","255,90,20","255,55,55","255,220,110"];
  const resize=()=>{W=sparksCanvas.width=window.innerWidth;H=sparksCanvas.height=window.innerHeight;};
  const newSpark=()=>({x:W*.25+Math.random()*W*.5,y:H+10,vx:(Math.random()-.5)*1.6,vy:-(Math.random()*2.4+1.6),life:1,decay:Math.random()*.011+.005,r:Math.random()*2+.8,color:C[Math.floor(Math.random()*C.length)]});
  const update=()=>{if(Math.random()<.32)sparks.push(newSpark());for(let i=sparks.length-1;i>=0;i--){const s=sparks[i];s.x+=s.vx+Math.sin(s.y*.05)*.4;s.y+=s.vy;s.vy-=.014;s.life-=s.decay;if(s.life<=0||s.y<-20)sparks.splice(i,1);}};
  const draw=()=>{ctx.clearRect(0,0,W,H);for(const s of sparks){ctx.save();ctx.globalAlpha=s.life;ctx.beginPath();ctx.arc(s.x,s.y,s.r*2.8,0,Math.PI*2);ctx.fillStyle=`rgba(${s.color},.1)`;ctx.fill();ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(${s.color},1)`;ctx.fill();ctx.restore();}};
  const loop=()=>{update();draw();requestAnimationFrame(loop);};
  window.addEventListener("resize",resize);resize();loop();
})();

/* ══ 6. ANIMAÇÃO ENTRADA ══ */
function animatePageIn() {
  [".navbar",".site-header",".intro-section",".artists-section",".festas-section",".site-footer"].forEach((s,i)=>{
    const el=document.querySelector(s); if(!el)return;
    el.style.cssText=`opacity:0;transform:translateY(30px);transition:opacity .6s ease ${i*.1}s,transform .6s ease ${i*.1}s`;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{el.style.opacity="1";el.style.transform="translateY(0)";}));
  });
  setTimeout(()=>{ initScrollReveal(); initCardTilt(); },500);
}

/* ══ 7. SCROLL REVEAL ══ */
function initScrollReveal() {
  if(!("IntersectionObserver"in window)){
    document.querySelectorAll(".artist-block,.dia-card,.stat-card,.footer-badge").forEach(el=>el.classList.add("visible"));
    return;
  }
  const obs=new IntersectionObserver((es)=>{
    es.forEach(e=>{ if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target);} });
  },{threshold:.08,rootMargin:"0px 0px -30px 0px"});
  document.querySelectorAll(".artist-block,.dia-card,.stat-card,.footer-badge").forEach(el=>{
    if(!el.classList.contains("visible")){ el.classList.add("reveal"); obs.observe(el); }
  });
}

/* ══ 8. BURST PARTÍCULAS ══ */
function createClickBurst(cx,cy){
  ["#f59e0b","#fb923c","#fcd34d","#ef4444","#22c55e","#ec4899","#818cf8"].forEach((c,i)=>{
    for(let j=0;j<3;j++){
      const p=document.createElement("div"),ang=((i*3+j)/21)*Math.PI*2,spd=50+Math.random()*90,sz=4+Math.random()*8;
      Object.assign(p.style,{position:"fixed",left:cx+"px",top:cy+"px",width:sz+"px",height:sz+"px",borderRadius:"50%",background:c,pointerEvents:"none",zIndex:"9999",transform:"translate(-50%,-50%)",boxShadow:`0 0 8px ${c}`,transition:"transform .7s ease-out,opacity .7s ease-out",opacity:"1"});
      document.body.appendChild(p);
      requestAnimationFrame(()=>requestAnimationFrame(()=>{p.style.transform=`translate(calc(-50% + ${Math.cos(ang)*spd}px),calc(-50% + ${Math.sin(ang)*spd}px))`;p.style.opacity="0";}));
      setTimeout(()=>p.remove(),750);
    }
  });
}

/* ══ 9. TILT 3D ══ */
function initCardTilt(){
  document.querySelectorAll(".artist-block").forEach(block=>{
    const hero=block.querySelector(".artist-hero"); if(!hero)return;
    block.addEventListener("mousemove",e=>{
      const r=hero.getBoundingClientRect(),dx=((e.clientX-r.left)/r.width-.5)*5,dy=((e.clientY-r.top)/r.height-.5)*4;
      hero.style.transition="transform .08s ease";
      hero.style.transform=`perspective(1200px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
    });
    block.addEventListener("mouseleave",()=>{hero.style.transition="transform .5s ease";hero.style.transform="";});
  });
}

/* ══ 10. FESTAS ══════════════════════════════════════════════════
   Cada show tem: name, h (headliner), d (destaque), special,
   yt (busca YouTube), sp (busca Spotify), time (Forró Caju)
═══════════════════════════════════════════════════════════════ */

const ARRAIA_DATA = [
  { date:"29/05", day:"Sex", shows:[
    {name:"Fogo na Saia"},
    {name:"Seu Desejo"},
    {name:"Calcinha Preta 'Atemporal'",h:true,yt:"Calcinha Preta Atemporal",sp:"Calcinha Preta"}
  ], p360:"Chirlys Trindade" },
  { date:"30/05", day:"Sáb", shows:[
    {name:"Forró Brasil"},
    {name:"Adelmário Coelho",yt:"Adelmário Coelho forró"},
    {name:"Kátia e Aduílio"},
    {name:"Joelma",h:true,yt:"Joelma forró",sp:"Joelma"}
  ], p360:"Forró 10" },
  { date:"31/05", day:"Dom", shows:[
    {name:"Cintura Fina"},
    {name:"Baby Som"},
    {name:"Henry Freitas",h:true,yt:"Henry Freitas",sp:"Henry Freitas"}
  ], p360:"Zé Tramela" },
  { date:"02/06", day:"Ter", shows:[
    {name:"Leone O Nobre"},
    {name:"Thiago Aquino",yt:"Thiago Aquino forró"},
    {name:"Natanzinho Lima",h:true,yt:"Natanzinho Lima",sp:"Natanzinho Lima"}
  ], p360:"Ittauan" },
  { date:"03/06", day:"Qua", shows:[
    {name:"As Patricinhas"},
    {name:"Cavalo de Pau"},
    {name:"Gustavo Mioto",h:true,yt:"Gustavo Mioto sertanejo",sp:"Gustavo Mioto"}
  ], p360:"Jan Vaqueiro" },
  { date:"04/06", day:"Qui", shows:[
    {name:"Jeanny Lins"},
    {name:"Walkyria Santos",yt:"Walkyria Santos"},
    {name:"Ana Castela",h:true,yt:"Ana Castela",sp:"Ana Castela"}
  ], p360:"Alê Ferraz" },
  { date:"05/06", day:"Sex", shows:[
    {name:"Geninho Batalha"},
    {name:"Jonas Esticado",d:true,yt:"Jonas Esticado",sp:"Jonas Esticado"},
    {name:"Iguinho e Lulinha",yt:"Iguinho e Lulinha"},
    {name:"Ávine Vinny",h:true,yt:"Avine Vinny",sp:"Avine Vinny"}
  ], p360:"André Novaes" },
  { date:"06/06", day:"Sáb", shows:[
    {name:"Zueirões do Forró"},
    {name:"Guilherme Dantas"},
    {name:"Duas Paixões (Silvânia e Berg)"},
    {name:"Tarcísio do Acordeon",h:true,yt:"Tarcísio do Acordeon",sp:"Tarcísio do Acordeon"}
  ], p360:"Dudu Moral" },
  { date:"07/06", day:"Dom", shows:[
    {name:"Flor de Maracujá"},
    {name:"Dorgival Dantas",d:true,yt:"Dorgival Dantas",sp:"Dorgival Dantas"},
    {name:"Magníficos",h:true,yt:"Magníficos forró",sp:"Os Magníficos"}
  ], p360:"Elton Mota" },
  { date:"09/06", day:"Ter", shows:[
    {name:"Unha Pintada",yt:"Unha Pintada forró",sp:"Unha Pintada"},
    {name:"Devinho Novaes",d:true,yt:"Devinho Novaes",sp:"Devinho Novaes"},
    {name:"Mikael Santos",d:true,yt:"Mikael Santos arrocha",sp:"Mikael Santos"}
  ], p360:"Eve Sandes" },
  { date:"10/06", day:"Qua", shows:[
    {name:"Igor Ativado"},
    {name:"João Gomes",d:true,yt:"João Gomes forró",sp:"João Gomes"},
    {name:"Nattan",h:true,yt:"Nattan forró",sp:"Nattan"}
  ], p360:"Alisson Lima" },
  { date:"11/06", day:"Qui", shows:[
    {name:"Nineia Oliveira"},
    {name:"Samyra Show",yt:"Samyra Show"},
    {name:"Simone Mendes",h:true,yt:"Simone Mendes",sp:"Simone Mendes"}
  ], p360:"Larissa Costa" },
  { date:"12/06", day:"Sex", shows:[
    {name:"Quarto de Milha"},
    {name:"Falamansa",d:true,yt:"Falamansa forró",sp:"Falamansa"},
    {name:"Zé Vaqueiro",d:true,yt:"Zé Vaqueiro",sp:"Zé Vaqueiro"},
    {name:"Gil Mendes",yt:"Gil Mendes sergipano"}
  ], p360:"Netto Ventura" },
  { date:"13/06", day:"Sáb", shows:[
    {name:"🏟️ Transmissão Jogo do Brasil",special:true},
    {name:"Mastruz com Leite",d:true,yt:"Mastruz com Leite",sp:"Mastruz com Leite"},
    {name:"Raí Saia Rodada",yt:"Raí Saia Rodada"},
    {name:"Nuzio Medeiros"}
  ], p360:"Cartas de Tarô" },
  { date:"14/06", day:"Dom", shows:[
    {name:"Erivaldo de Carira",d:true,yt:"Erivaldo de Carira sergipano"},
    {name:"Batista Lima",yt:"Batista Lima"},
    {name:"Zé Cantor"}
  ], p360:"Raio da Silibrina" },
  { date:"16/06", day:"Ter", shows:[
    {name:"Nadson O Ferinha",d:true,yt:"Nadson O Ferinha",sp:"Nadson O Ferinha"},
    {name:"Silvano Sales",yt:"Silvano Sales"},
    {name:"Heitor Costa",d:true,yt:"Heitor Costa arrocha",sp:"Heitor Costa"}
  ], p360:"Heitor Santos" },
  { date:"17/06", day:"Qua", shows:[
    {name:"Raniere Gomes"},
    {name:"Cavaleiros do Forró",d:true,yt:"Cavaleiros do Forró",sp:"Cavaleiros do Forró"},
    {name:"Limão com Mel",h:true,yt:"Limão com Mel forró",sp:"Limão com Mel"}
  ], p360:"Vanessa Porto" },
  { date:"18/06", day:"Qui", shows:[
    {name:"Ju Marques"},
    {name:"Solange Almeida",d:true,yt:"Solange Almeida",sp:"Solange Almeida"},
    {name:"Fernandinha",yt:"Fernandinha forró"}
  ], p360:"Bia Brasil" },
  { date:"19/06", day:"Sex", shows:[
    {name:"Luan Estilizado"},
    {name:"🏟️ Transmissão Jogo do Brasil",special:true},
    {name:"Luan Santana",h:true,yt:"Luan Santana",sp:"Luan Santana"},
    {name:"João Bosco e Vinicius",yt:"João Bosco e Vinicius"}
  ], p360:"Ygor Raniere" },
  { date:"20/06", day:"Sáb", shows:[
    {name:"Maraisa Cantora"},
    {name:"Brasas do Forró"},
    {name:"Yasmin Sensação",yt:"Yasmin Sensação"},
    {name:"Filho do Piseiro",h:true,yt:"Filho do Piseiro",sp:"Filho do Piseiro"}
  ], p360:"Lucas Castro" },
  { date:"21/06", day:"Dom", shows:[
    {name:"Marcelo Bala"},
    {name:"Claudio Ney e Juliana"},
    {name:"Gusttavo Lima",h:true,yt:"Gusttavo Lima",sp:"Gusttavo Lima"}
  ], p360:"Franquinho Vaqueiro" },
  { date:"23/06", day:"Ter", shows:[
    {name:"Luanzinho Moraes"},
    {name:"Fabiano Guimarães"},
    {name:"Rey Vaqueiro"},
    {name:"Painel de Controle"}
  ], p360:"Marcelinho" },
  { date:"24/06", day:"Qua", shows:[
    {name:"🏟️ Transmissão Jogo do Brasil",special:true},
    {name:"Alcymar Monteiro",yt:"Alcymar Monteiro"},
    {name:"Geraldo Azevedo",d:true,yt:"Geraldo Azevedo",sp:"Geraldo Azevedo"},
    {name:"Matheus e Kauan",h:true,yt:"Matheus e Kauan",sp:"Matheus e Kauan"}
  ], p360:"Danielzinho Jr." },
  { date:"25/06", day:"Qui", shows:[
    {name:"Liene Show"},
    {name:"Taty Girl",d:true,yt:"Taty Girl forró",sp:"Taty Girl"},
    {name:"Mariana Fagundes",h:true,yt:"Mariana Fagundes",sp:"Mariana Fagundes"}
  ], p360:"Tatah Santana" },
  { date:"26/06", day:"Sex", shows:[
    {name:"Danielzinho O Kaceteiro",yt:"Danielzinho O Kaceteiro sergipano"},
    {name:"Eline Martins"},
    {name:"Diego e Victor Hugo",h:true,yt:"Diego e Victor Hugo",sp:"Diego e Victor Hugo"},
    {name:"Vitor Fernandes",yt:"Vitor Fernandes forró"}
  ], p360:"Breno Matos" },
  { date:"27/06", day:"Sáb", shows:[
    {name:"Cuscuz com Leite"},
    {name:"Zezo",yt:"Zezo forró"},
    {name:"Bruno e Marrone",h:true,yt:"Bruno e Marrone",sp:"Bruno e Marrone"},
    {name:"Klessinha"}
  ], p360:"Gardênia Mel" },
  { date:"28/06", day:"Dom", shows:[
    {name:"Pedro Lua"},
    {name:"Elba Ramalho",d:true,yt:"Elba Ramalho",sp:"Elba Ramalho"},
    {name:"Flávio José",d:true,yt:"Flávio José forró",sp:"Flávio José"},
    {name:"Mestrinho",h:true,yt:"Mestrinho sanfoneiro",sp:"Mestrinho"}
  ], p360:"Forró Cana com Limão" },
];

const FORRO_DATA = [
  { date:"20/06", day:"Sex", shows:[
    {time:"19h",name:"Lourinho do Acordeon"},
    {time:"20h40",name:"Taty Girl",d:true,yt:"Taty Girl forró",sp:"Taty Girl"},
    {time:"22h20",name:"Joelma",h:true,yt:"Joelma forró",sp:"Joelma"},
    {time:"23h30",name:"Matheus Fernandes",yt:"Matheus Fernandes forró"},
    {time:"01h40",name:"Tatah Santana"}
  ]},
  { date:"21/06", day:"Sáb", shows:[
    {time:"19h",name:"Igor Ranieri"},
    {time:"20h40",name:"Léo Foguete"},
    {time:"22h20",name:"Mikael Santos",d:true,yt:"Mikael Santos arrocha",sp:"Mikael Santos"},
    {time:"00h",name:"Yasmin Sensação",yt:"Yasmin Sensação"}
  ]},
  { date:"22/06", day:"Dom", shows:[
    {time:"19h",name:"Mariana Fagundes",yt:"Mariana Fagundes"},
    {time:"20h40",name:"Fernandinha",yt:"Fernandinha forró"},
    {time:"22h20",name:"Diego e Victor Hugo",h:true,yt:"Diego e Victor Hugo",sp:"Diego e Victor Hugo"},
    {time:"00h",name:"Cidade dos Anjos"}
  ]},
  { date:"23/06", day:"Seg", shows:[
    {time:"19h",name:"Baú das Antigas"},
    {time:"20h40",name:"Silvânia Aquino e Berg Rabelo",d:true,yt:"Silvânia Aquino Berg Rabelo Calcinha Preta"},
    {time:"22h20",name:"Panda",yt:"Panda forró"},
    {time:"00h",name:"Simone Mendes",h:true,yt:"Simone Mendes",sp:"Simone Mendes"},
    {time:"01h40",name:"Fogo na Saia",yt:"Fogo na Saia forró"}
  ]},
  { date:"24/06", day:"Ter", shows:[
    {time:"19h",name:"🏟️ Transmissão Seleção Brasileira",special:true},
    {time:"20h40",name:"Zé Vaqueiro",d:true,yt:"Zé Vaqueiro",sp:"Zé Vaqueiro"},
    {time:"22h20",name:"Seu Desejo",yt:"Seu Desejo forró",sp:"Seu Desejo"},
    {time:"00h",name:"Natanzinho Lima",h:true,yt:"Natanzinho Lima",sp:"Natanzinho Lima"},
    {time:"01h40",name:"Gil Mendes",yt:"Gil Mendes sergipano"}
  ]},
  { date:"25/06", day:"Qua", shows:[
    {time:"19h",name:"Erivaldo de Carira",d:true,yt:"Erivaldo de Carira"},
    {time:"20h40",name:"Mestrinho",d:true,yt:"Mestrinho",sp:"Mestrinho"},
    {time:"22h20",name:"Pablo",h:true,yt:"Pablo pagode",sp:"Pablo"},
    {time:"00h",name:"Calcinha Preta",h:true,yt:"Calcinha Preta",sp:"Calcinha Preta"}
  ]},
  { date:"26/06", day:"Qui", shows:[
    {time:"19h",name:"Forró Brasil"},
    {time:"20h40",name:"Dorgival Dantas",d:true,yt:"Dorgival Dantas",sp:"Dorgival Dantas"},
    {time:"22h20",name:"Murilo Huff",h:true,yt:"Murilo Huff",sp:"Murilo Huff"},
    {time:"00h",name:"Magníficos",d:true,yt:"Magníficos forró",sp:"Os Magníficos"}
  ]},
  { date:"27/06", day:"Sex", shows:[
    {time:"19h",name:"Luciene Melo"},
    {time:"20h40",name:"Eric Lande",yt:"Eric Land forró"},
    {time:"22h20",name:"Wesley Safadão",h:true,yt:"Wesley Safadão",sp:"Wesley Safadão"},
    {time:"00h",name:"Mastruz com Leite",d:true,yt:"Mastruz com Leite",sp:"Mastruz com Leite"},
    {time:"01h30",name:"Alisson Lima"}
  ]},
  { date:"28/06", day:"Sáb", shows:[
    {time:"19h",name:"Antônio Carlos du Aracaju",d:true,yt:"Antônio Carlos du Aracaju sergipano"},
    {time:"20h40",name:"Limão com Mel",yt:"Limão com Mel forró",sp:"Limão com Mel"},
    {time:"22h20",name:"Solange Almeida",d:true,yt:"Solange Almeida",sp:"Solange Almeida"},
    {time:"00h",name:"Danielzinho Jr.",yt:"Danielzinho O Kaceteiro sergipano"}
  ]},
];

/* ── Renderiza um card de dia ── */
function renderDiaCard(d, isArraia) {
  const showsHtml = d.shows.map(s => {
    const cls  = s.h ? "headliner" : s.d ? "destaque" : "";
    const badge= s.h ? "🌟 " : s.d ? "⭐ " : "";
    const timeH= isArraia ? "" : `<span class="show-time">${s.time||""}</span>`;
    const ytQ  = encodeURIComponent((s.yt||s.name)+" forró");
    const spQ  = encodeURIComponent(s.sp||s.name);

    // Botões de streaming: só aparece se tiver yt/sp ou for headliner
    let btns = "";
    if (!s.special && (s.yt||s.sp||s.h||s.d)) {
      const ytBtn = `<a href="https://www.youtube.com/results?search_query=${ytQ}" target="_blank" rel="noopener" class="stream-btn yt" title="Abrir no YouTube">▶ YT</a>`;
      const spBtn = s.sp ? `<a href="https://open.spotify.com/search/${spQ}" target="_blank" rel="noopener" class="stream-btn sp" title="Abrir no Spotify">♫ SP</a>` : "";
      btns = `<span class="stream-btns">${ytBtn}${spBtn}</span>`;
    }

    const specialCls = s.special ? " show-brasil" : "";
    return `<div class="show-item${s.special ? " show-item-brasil" : ""}">
      ${timeH}
      <span class="show-name ${cls}${specialCls}">${badge}${s.name}</span>
      ${btns}
    </div>`;
  }).join("");

  const p360H = d.p360 ? `<div class="dia-palco360">
    <span class="palco360-label">360°</span>
    <span class="palco360-name">🎙️ ${d.p360}</span>
  </div>` : "";

  const palcoLabel = isArraia ? "🎪 Palco Rogério" : "🎤 Palco LG";
  const sub = d.day + (d.palco ? " · "+d.palco : "");

  return `<div class="dia-card">
    <div class="dia-header">
      <div>
        <div class="dia-date">${d.date}</div>
        <div class="dia-date-sub">${sub}</div>
      </div>
      <span class="dia-palco-badge">${palcoLabel}</span>
    </div>
    <div class="dia-body">
      <div class="dia-shows">${showsHtml}</div>
      ${p360H}
    </div>
  </div>`;
}

function initFestas() {
  // Renderiza TUDO imediatamente (sem reveal para evitar bug de invisibilidade)
  const ap = document.getElementById("arraia-prog");
  const fp = document.getElementById("forro-prog");
  if(ap) ap.innerHTML = ARRAIA_DATA.map(d=>renderDiaCard(d,true)).join("");
  if(fp) fp.innerHTML = FORRO_DATA.map(d=>renderDiaCard(d,false)).join("");

  // Tabs
  document.querySelectorAll(".festa-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".festa-tab").forEach(b=>b.classList.remove("active"));
      document.querySelectorAll(".festa-panel").forEach(p=>p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("tab-"+btn.dataset.tab).classList.add("active");
    });
  });
}
