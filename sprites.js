/* Mythvale Sprite Studio — deterministic pixel models + frame animation.
   All models are original procedural pixel art; no external assets required. */
(() => {
  'use strict';
  const canvas = document.getElementById('world');
  if (!canvas || !canvas.getContext) return;
  const c = canvas.getContext('2d');
  const TILE = 32;
  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
  const pal = {
    knight:['#d6e2f4','#627da7','#34445f','#f0c39b','#583b2b','#d8ad42'],
    archer:['#c9dca2','#65864a','#354c38','#edbd95','#65422d','#c6a86b'],
    mage:['#d5c6ff','#8868c9','#4b377e','#f0c7a2','#5b382b','#75e3ff'],
    priest:['#f4e7ce','#e2c8a0','#8f6c4d','#f1c5a0','#684536','#fff0a4'],
    slime:['#a6ffb7','#42c978','#1a895d','#d5ffe0','#ffffff','#ffe86c'],
    poring:['#ffb7d9','#ed679f','#b53b78','#ffe1ef','#ffffff','#ffed91'],
    mushroom:['#ffe2a4','#c56a43','#75402f','#e7ba8b','#fff0d4','#8bd36b'],
    wolf:['#d4d9e2','#828b9c','#485366','#c7a080','#3d2d28','#d64c62'],
    skeleton:['#fff0ca','#c9b98f','#7d6d56','#fff2d6','#6d5041','#b84e58'],
    demon:['#ffb3a4','#dc4c56','#742c49','#e6a57e','#442a35','#ffdb6f'],
    dragon:['#f3a37d','#b64245','#652e4a','#ffd1a1','#4a2d35','#ffdf6b'],
    golem:['#d8c5a0','#9b896a','#625743','#d7b58b','#5b4030','#7ce0d0']
  };
  function rect(x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));}
  function px(x,y,col){rect(x,y,3,3,col);}
  function outline(x,y,w,h,col){rect(x-1,y-1,w+2,2,col);rect(x-1,y+h-1,w+2,2,col);rect(x-1,y,2,h,col);rect(x+w-1,y,2,h,col);}
  function drawHero(x,y,frame,dir,attack,cls){
    const p=pal[cls]||pal.knight, bob=frame%4===1?-1:frame%4===3?1:0, step=frame%4;
    const ox=x+7, oy=y+3+bob, leg=step===1?2:step===3?-2:0;
    // ground shadow + cast shadow
    rect(x+5,y+27,22,4,'#14271c88');
    // cape and body silhouette
    rect(ox+3,oy+12,13,12,p[2]);rect(ox+5,oy+13,9,10,p[1]);
    rect(ox+4,oy+11,12,5,p[0]);
    // legs animate in four distinct walk frames
    rect(ox+5,oy+22,4,5+Math.max(0,leg),p[2]);rect(ox+12,oy+22,4,5+Math.max(0,-leg),p[2]);
    rect(ox+4+Math.max(0,-leg),oy+26,6,2,p[4]);rect(ox+11+Math.max(0,leg),oy+26,6,2,p[4]);
    // head, hair and facial direction
    rect(ox+4,oy+3,12,10,p[3]);rect(ox+3,oy+1,14,5,p[4]);rect(ox+4,oy,4,4,p[4]);rect(ox+12,oy+1,5,4,p[4]);
    const eyeX=dir<0?ox+5:ox+12;rect(eyeX,oy+7,2,2,'#22283a');rect(eyeX+1,oy+7,1,1,'#fff');
    // class signature: shield, bow, staff, holy mantle
    if(cls==='knight'){rect(ox+1,oy+14,4,8,'#b5c8df');rect(ox+2,oy+15,2,5,'#e9f1fa');}
    if(cls==='archer'){rect(ox+16,oy+12,2,12,'#a7784b');rect(ox+16,oy+13,1,9,'#f1dfad');}
    if(cls==='mage'){rect(ox+2,oy-4,16,3,p[1]);rect(ox+5,oy-7,10,4,p[1]);rect(ox+9,oy-9,3,3,p[5]);rect(ox+18,oy+9,2,18,'#8c6d50');rect(ox+16,oy+7,6,4,p[5]);}
    if(cls==='priest'){rect(ox+2,oy+12,16,3,'#fff3d8');rect(ox+9,oy+13,3,8,p[5]);}
    // swing pose and weapon arc have a per-frame pose
    if(attack>0){const a=attack%6;const wx=dir<0?ox-5:ox+17, wy=oy+(a<3?10:14);
      rect(wx,wy,7,2,'#f5e8c5');rect(wx+(dir<0?0:5),wy-4,2,10,a<3?'#aeeeff':'#fff0a0');
      if(a<4){c.strokeStyle='#fff2b0';c.lineWidth=2;c.beginPath();c.arc(ox+9,oy+15,15,dir<0?Math.PI*.8:Math.PI*.15,dir<0?Math.PI*1.45:Math.PI*.85);c.stroke();}
    }
    // per-frame foot dust
    if(step===1||step===3){rect(x+(step===1?2:25),y+27,3,2,'#d4c19a');}
  }
  function drawMob(m,x,y,frame){
    const type=m.kind||m.type||(/Poring/i.test(m.name)?'poring':/Mushroom/i.test(m.name)?'mushroom':/Wolf/i.test(m.name)?'wolf':/Skeleton/i.test(m.name)?'skeleton':/Demon/i.test(m.name)?'demon':/Dragon/i.test(m.name)?'dragon':/Golem/i.test(m.name)?'golem':'slime');
    const p=pal[type]||pal.slime, bob=frame%4===0?0:frame%4===1?-2:frame%4===2?-1:1, hit=m.hit>0;
    const cx=x+16, by=y+25+bob;
    rect(x+6,y+27,20,3,'#12231c88');
    if(type==='slime'||type==='poring'){
      rect(x+7,by-11,18,10,p[1]);rect(x+10,by-16,12,6,p[0]);rect(x+5,by-7,22,6,p[1]);rect(x+9,by-3,14,3,p[2]);
      rect(x+11,by-10,3,4,'#fff');rect(x+12,by-9,1,3,'#26334a');rect(x+20,by-10,3,4,'#fff');rect(x+21,by-9,1,3,'#26334a');
      if(type==='poring'){rect(cx-3,by-20,6,4,p[5]);rect(cx-1,by-23,3,4,p[5]);}
    }else if(type==='mushroom'){
      rect(cx-9,by-12,18,12,p[3]);rect(cx-7,by-7,14,7,p[0]);rect(cx-12,by-17,24,8,p[1]);rect(cx-9,by-21,18,5,p[0]);rect(cx-6,by-14,4,3,p[5]);rect(cx+3,by-15,3,3,p[5]);rect(cx-5,by-9,3,2,p[4]);rect(cx+3,by-9,3,2,p[4]);
    }else if(type==='wolf'){
      rect(cx-10,by-12,20,10,p[1]);rect(cx-5,by-17,12,9,p[0]);rect(cx-4,by-22,4,7,p[2]);rect(cx+3,by-22,4,7,p[2]);rect(cx+5,by-13,9,5,p[0]);rect(cx+9,by-11,5,3,p[2]);rect(cx-8,by-3,4,5,p[2]);rect(cx+5,by-3,4,5,p[2]);rect(cx+1,by-15,2,2,'#ffec9c');
    }else if(type==='skeleton'){
      rect(cx-6,by-18,12,10,p[0]);rect(cx-7,by-20,14,3,p[1]);rect(cx-4,by-14,2,3,p[2]);rect(cx+2,by-14,2,3,p[2]);rect(cx-5,by-7,10,8,p[1]);rect(cx-10,by-7,5,3,p[0]);rect(cx+5,by-7,5,3,p[0]);rect(cx-4,by,3,5,p[2]);rect(cx+2,by,3,5,p[2]);rect(cx+10,by-12,2,18,'#a98d61');rect(cx+7,by-14,8,3,'#e2d5b6');
    }else if(type==='demon'||type==='dragon'){
      const big=type==='dragon';rect(cx-(big?14:10),by-(big?22:17),big?28:20,big?20:15,p[1]);rect(cx-7,by-26,14,10,p[0]);rect(cx-8,by-31,5,8,p[2]);rect(cx+3,by-31,5,8,p[2]);rect(cx-5,by-22,3,3,p[5]);rect(cx+3,by-22,3,3,p[5]);rect(cx-5,by-11,10,3,p[2]);
      if(big){rect(cx-20,by-20,9,14,p[2]);rect(cx+11,by-20,9,14,p[2]);rect(cx-17,by-18,5,8,p[0]);rect(cx+12,by-18,5,8,p[0]);rect(cx-10,by-3,6,6,p[2]);rect(cx+5,by-3,6,6,p[2]);}
    }else{ // golem: segmented stone construct
      rect(cx-11,by-20,22,13,p[1]);rect(cx-9,by-28,18,9,p[0]);rect(cx-7,by-25,3,3,p[5]);rect(cx+4,by-25,3,3,p[5]);rect(cx-15,by-17,5,12,p[2]);rect(cx+10,by-17,5,12,p[2]);rect(cx-8,by-7,5,8,p[2]);rect(cx+3,by-7,5,8,p[2]);rect(cx-3,by-13,6,3,p[2]);}
    if(hit){rect(x+4,y+2,24,2,'#fff');}
    // elite / boss crown and health ornament
    if(m.boss||type==='dragon'||type==='demon'){rect(cx-5,y-3,3,5,p[5]);rect(cx-1,y-5,3,7,p[5]);rect(cx+3,y-3,3,5,p[5]);}
    if(m.hp!==undefined&&m.maxHp){rect(x+2,y+1,28,4,'#18202b');rect(x+3,y+2,26*clamp(m.hp/m.maxHp,0,1),2, m.boss?'#ff526c':'#e65e69');}
    if(m.boss){c.strokeStyle='#ffd96a';c.lineWidth=1;c.strokeRect(x-2,y-3,36,34);}
    if(state&&state.target===m.id){c.strokeStyle='#ffdf81';c.lineWidth=2;c.strokeRect(x+1,y+3,30,28);}
  }
  function drawTile(x,y,t,frame){
    const px=x*TILE,py=y*TILE;
    const base=t==='path'?'#9a805b':t==='water'?'#286d91':t==='tree'?'#244f3b':t==='flower'?'#427c45':'#376b48';
    rect(px,py,TILE,TILE,base);rect(px+1,py+1,30,30,'#ffffff05');
    if(t==='path'){rect(px+5,py+8,5,3,'#b79b70');rect(px+20,py+23,6,3,'#b79b70');rect(px+14,py+4,2,2,'#70563d');}
    if(t==='water'){rect(px+((frame%8)*2),py+8,10,2,'#70c8d8');rect(px+((frame%6)*3),py+22,7,2,'#4b9bb4');}
    if(t==='tree'){rect(px+4,py+9,24,18,'#173c2e');rect(px+8,py+3,17,21,'#2f7044');rect(px+11,py+5,12,13,'#4c8a51');rect(px+14,py+20,6,11,'#79563c');px(px+10,py+9,'#68a85b');}
    if(t==='flower'){rect(px+9,py+11,4,4,'#f5d58a');rect(px+7,py+9,3,3,'#e8a4d1');rect(px+12,py+9,3,3,'#e8a4d1');}
  }
  function render(){
    if(typeof map==='undefined'||typeof player==='undefined'||typeof monsters==='undefined')return;
    c.clearRect(0,0,canvas.width,canvas.height);
    const frame=(typeof state!=='undefined'?state.frame:0)||0;
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)drawTile(x,y,map[y][x],frame);
    // Props: path-edge grass tufts and little stones add depth.
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
      if(map[y][x]==='grass'&&((x*7+y*11)%17===0)){px(x*TILE+6,y*TILE+17,'#74a45b');px(x*TILE+9,y*TILE+14,'#a3bd6a');}
    }
    monsters.forEach(m=>{if(!m.alive)return;drawMob(m,m.x*TILE,m.y*TILE,frame);});
    const cls=(typeof state!=='undefined'&&state.job)||'knight';
    drawHero(player.x*TILE,player.y*TILE,frame,player.dir||1,(typeof state!=='undefined'&&state.attackFrame)||0,pal[cls]?cls:'knight');
    if(typeof $==='function')$('coords').textContent='x: '+player.x+' · y: '+player.y;
  }
  // Provide reusable model catalog for future content expansion.
  window.MythvaleSprites={
    version:'1.0.0',
    classes:['knight','archer','mage','priest'],
    monsters:['slime','poring','mushroom','wolf','skeleton','demon','dragon','golem'],
    animationFrames:{idle:4,walk:4,attack:6,hit:2,death:6},
    render,
    drawHero,
    drawMob
  };
  // Existing loop calls the global draw() every tick; replace it with sprite renderer.
  window.draw=render;
  render();
})();