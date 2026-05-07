// Función para cargar la cabecera y el footer
function loadLayout() {
    const headerHTML = `
        <nav>
            <a href="index.html" class="nav-logo">Andrea <span>Aranda</span></a>
            <ul class="nav-links">
                <li><a href="#skills">Skills</a></li>
                <li><a href="#experience">Experiencia</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#education">Formación</a></li>
                <li><a href="#contact">Contacto</a></li>
             </ul>
        </nav>
    `;
    
    const footerHTML = `
        <footer>
            <span class="footer-copy">© 2025 Andrea Aranda · Desarrolladora web</span>
            <a href="#hero" class="footer-back">↑ Volver arriba</a>
        </footer>
    `;

    document.getElementById('header-placeholder').innerHTML = headerHTML;
    document.getElementById('footer-placeholder').innerHTML = footerHTML;
}
// cursor lapiz
const pencil = document.getElementById('cursorPencil');
const trail = document.getElementById('cursorTrail');
let mx=0,my=0,tx=0,ty=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  pencil.style.left=mx+'px';pencil.style.top=my+'px';
});
function animTrail(){
  tx+=(mx-tx)*.18;ty+=(my-ty)*.18;
  trail.style.left=tx+'px';trail.style.top=ty+'px';
  requestAnimationFrame(animTrail);
}
animTrail();
document.querySelectorAll('a,button,.card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{pencil.classList.add('hovering')});
  el.addEventListener('mouseleave',()=>{pencil.classList.remove('hovering')});
});

// Ejecutar cuando cargue el DOM
document.addEventListener('DOMContentLoaded', loadLayout);

const canvas=document.getElementById('skill-canvas'),ctx=canvas.getContext('2d');
const skills=[
  {label:'JavaScript',r:40},{label:'Node.js',r:32},{label:'Express',r:27},
  {label:'PostgreSQL',r:32},{label:'WordPress',r:38},{label:'Elementor',r:30},
  {label:'React',r:32},{label:'Figma',r:29},{label:'PHP',r:27},
  {label:'MySQL',r:29},{label:'SASS',r:25},{label:'HTML5',r:27}
];
let W,H,cx,cy,mouse={x:-999,y:-999},nodes=[],raf;
function resize(){
  const s=Math.min(canvas.parentElement.getBoundingClientRect().width,440);
  const dpr=window.devicePixelRatio||1;
  canvas.width=s*dpr;canvas.height=s*dpr;
  canvas.style.width=s+'px';canvas.style.height=s+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  W=H=s;cx=cy=s/2;initNodes();
}
function initNodes(){
  nodes=skills.map((s,i)=>{
    const a=(i/skills.length)*Math.PI*2-Math.PI/2;
    const r=cx*(0.28+Math.random()*.32);
    return{label:s.label,r:s.r,baseX:cx+Math.cos(a)*r,baseY:cy+Math.sin(a)*r,
      x:0,y:0,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,
      phase:Math.random()*Math.PI*2,fr:10+Math.random()*10,
      speed:.004+Math.random()*.004,hovered:false,glow:0};
  });
}
function draw(){
  ctx.clearRect(0,0,W,H);
  nodes.forEach(n=>{
    n.phase+=n.speed;
    n.x=n.baseX+Math.cos(n.phase)*n.fr;
    n.y=n.baseY+Math.sin(n.phase*1.4)*(n.fr*.7);
    n.vx+=(n.baseX-n.x)*.003;n.vy+=(n.baseY-n.y)*.003;
    n.vx*=.95;n.vy*=.95;
    const d=Math.hypot(mouse.x-n.x,mouse.y-n.y);
    n.hovered=d<n.r+16;
    n.glow+=((n.hovered?1:0)-n.glow)*.1;
  });
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i],b=nodes[j];
      const d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<145){
        const t=1-d/145;const hot=a.hovered||b.hovered;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
        ctx.strokeStyle=hot?`rgba(200,150,90,${t*.55})`:`rgba(200,150,90,${t*.09})`;
        ctx.lineWidth=hot?1:.5;ctx.stroke();
      }
    }
  }
  nodes.forEach(n=>{
    if(n.glow>.01){
      const gr=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r*3);
      gr.addColorStop(0,`rgba(200,150,90,${n.glow*.2})`);
      gr.addColorStop(1,'rgba(200,150,90,0)');
      ctx.beginPath();ctx.arc(n.x,n.y,n.r*3,0,Math.PI*2);
      ctx.fillStyle=gr;ctx.fill();
    }
    ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
    ctx.fillStyle='rgba(16,14,11,.9)';ctx.fill();
    ctx.strokeStyle=n.hovered?'#c8965a':`rgba(200,150,90,${.16+n.glow*.5})`;
    ctx.lineWidth=n.hovered?1.5:.7;ctx.stroke();
    const fs=Math.round(n.r*.35+6.5);
    ctx.font=`${n.hovered?400:300} ${fs}px 'DM Mono',monospace`;
    ctx.fillStyle=n.hovered?'rgba(232,226,216,.95)':'rgba(232,226,216,.38)';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(n.label,n.x,n.y);
  });
  raf=requestAnimationFrame(draw);
}
canvas.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top});
canvas.addEventListener('mouseleave',()=>{mouse.x=-999;mouse.y=-999});
canvas.addEventListener('touchmove',e=>{const r=canvas.getBoundingClientRect();mouse.x=e.touches[0].clientX-r.left;mouse.y=e.touches[0].clientY-r.top},{passive:true});
window.addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();draw()});
resize();draw();

const io=new IntersectionObserver(entries=>{
  entries.forEach(el=>{if(el.isIntersecting){el.target.style.opacity='1';el.target.style.transform='translateY(0)'}});
},{threshold:.1});
document.querySelectorAll('.exp-item,.skill-card,.project-card,.edu-card,.project-card-wide').forEach(el=>{
  el.style.opacity='0';el.style.transform='translateY(20px)';
  el.style.transition='opacity .6s cubic-bezier(.22,1,.36,1),transform .6s cubic-bezier(.22,1,.36,1)';
  io.observe(el);
});