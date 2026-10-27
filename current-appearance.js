import { brandFamilies } from './brand-colours.js';
export function createAppearance({$, $$, icon, openDrawer, toast, put, get}) {
  const families=[...brandFamilies,
    {id:'forest',day:{name:'Forest & Oat',mood:'Warm, natural, quietly adventurous.',note:'Our overall pick. An easy, welcoming home for the products, with a little of the jungle in the details.',colours:['#F8F7F2','#314C3B','#DFE5D6','#232D26'],labels:['Oat','Forest','Sage','Ink']},night:{name:'Forest After Dark',mood:'Deep greens, soft sage, warm light.',note:'The most recognisably BOOGAS after dark. A quiet jungle feeling around naturally lit product photography.',colours:['#111914','#BFD0AA','#26362B','#F2F0E6'],labels:['Forest','Sage','Canopy','Oat']}},
    {id:'ink',day:{name:'Ink & Sand',mood:'A crisp, modern classic.',note:'Inky blue and soft sand. The cleanest, most classic version of the shop, with the artwork providing the character.',colours:['#F6F3EC','#263D52','#DCE4E9','#202F3B'],labels:['Sand','Ink','Mist','Midnight']},night:{name:'Midnight Ink',mood:'Deep navy with a little cool blue.',note:'A crisp evening palette. Blue brings a cooler, more graphic feel to the same simple storefront.',colours:['#101922','#B1CDDE','#253747','#EFF2F3'],labels:['Midnight','Blue','Slate','Mist']}},
    {id:'clay',day:{name:'Clay & Chalk',mood:'Warm stone, a little sunshine.',note:'Clay, chalk and espresso. A gentle reference to the caves, with the ease of an everyday lifestyle brand.',colours:['#FBF6EF','#8B4936','#EADDD2','#372D29'],labels:['Chalk','Clay','Limestone','Espresso']},night:{name:'Warm Charcoal',mood:'Soft charcoal, oat and a fireside glow.',note:'Our night-mode pick. Warm and understated, with enough softness to keep the shop feeling human and inviting.',colours:['#1D1A17','#D4AE8A','#3A3027','#F3EBDF'],labels:['Charcoal','Oat','Earth','Chalk']}},
    {id:'cave',nightOnly:true,fallback:'forest',night:{name:'Cave Black',mood:'The original black and green, refined.',note:'Our new night pick. Near-black charcoal, warm chalk and a sharper moss green. The spirit of the original BOOGAS store, with calmer surfaces and clearer emphasis.',colours:['#10120F','#A9C77E','#29341F','#F3F2E9'],labels:['Cave black','Moss','Lichen','Chalk']}},
    {id:'lagoon',nightOnly:true,fallback:'ink',night:{name:'Deep Lagoon',mood:'Midnight teal. Cool mint. A little escape.',note:'A cooler side of Boogas World. Deep blue-green surfaces and fresh mint accents give the bright artwork room to breathe.',colours:['#081A1C','#77D6BC','#173E37','#EDF5EE'],labels:['Deep water','Mint','Reef','Sea mist']}},
    {id:'volcanic',nightOnly:true,fallback:'clay',night:{name:'Volcanic Plum',mood:'Smoky plum with a little ember glow.',note:'Inspired by the glow inside a volcanic CAVE. Dark plum keeps it grounded; soft ember highlights bring warmth and character.',colours:['#1A101B','#E8AA86','#442C40','#FAEEE5'],labels:['Volcanic plum','Ember','Obsidian','Ash']}}
  ];
  let palette=document.documentElement.dataset.palette||'brand-moss';
  let mode=document.documentElement.dataset.mode==='dark'?'dark':'light';
  let onModeSync=null;
  if(!families.some(f=>f.id===palette))palette='brand-moss';
  if(families.find(f=>f.id===palette).nightOnly)mode='dark';
  let lastDayPalette=get('lastDayPalette','brand-moss');
  if(!families.some(f=>f.id===lastDayPalette&&!f.nightOnly))lastDayPalette='brand-moss';
  if(mode==='light'){lastDayPalette=palette;put('lastDayPalette',palette);}
  const current=(f=families.find(f=>f.id===palette))=>mode==='dark'||f.nightOnly?f.night:f.day;
  const visibleFamilies=()=>families.filter(f=>mode==='dark'||!f.nightOnly);
  const recommendation=()=>mode==='dark'?'Our brand pick: Charcoal & Moss.':'Our brand pick: Moss & Stone.';
  const chevron='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  const glyph=m=>m==='dark'?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>';
  const badge=f=>f.brand?'<span class="brand-palette-tag">Brand colours</span>':'';
  const swatches=p=>`<span class="palette-swatches" aria-hidden="true">${p.colours.map(c=>`<i style="background:${c}"></i>`).join('')}</span>`;
  const modeSwitch=()=>`<div class="appearance-modes" role="group" aria-label="Display mode"><button aria-label="Day" data-action="set-mode" data-mode="light" aria-pressed="${mode==='light'}">${glyph('light')}Day</button><button aria-label="Night" data-action="set-mode" data-mode="dark" aria-pressed="${mode==='dark'}">${glyph('dark')}Night</button></div>`;
  function option(f){const p=current(f);return `<button class="palette-option" data-action="set-palette" data-id="${f.id}" aria-pressed="${palette===f.id}">${swatches(p)}<span class="palette-option-copy"><strong>${p.name}${badge(f)}</strong><small>${p.mood}</small><span class="palette-used-colours">${p.labels.join(' · ')}</span></span><span class="palette-selected">${icon('check')}</span></button>`;}
  function options(){return `<div class="brand-choice-list">${brandFamilies.map(option).join('')}</div><details class="other-palette-options" ${!families.find(f=>f.id===palette).brand?'open':''}><summary>Other colour directions ${chevron}</summary><div>${visibleFamilies().filter(f=>!f.brand).map(option).join('')}</div></details>`;}
  function updateUI(){
    const paletteOptions=$('#appearance-options');if(paletteOptions&&paletteOptions.dataset.mode!==mode){paletteOptions.dataset.mode=mode;paletteOptions.innerHTML=options();}
    const p=current(),control=$('[data-action="palettes"]');
    if(control){control.innerHTML=`${swatches(p)}<span>Colours</span>`;control.setAttribute('aria-label',`Colours and night mode, ${p.name} selected`);}
    $('meta[name="theme-color"]').content=p.colours[0];
    $$('[data-action="set-mode"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
    const examples=$('#palette-examples');if(examples&&examples.dataset.mode!==mode){examples.dataset.mode=mode;examples.innerHTML=gallery();}
    $$('[data-action="set-palette"]').forEach(b=>{const on=b.dataset.id===palette;b.setAttribute('aria-pressed',String(on));const label=$('.palette-use-label',b);if(label)label.textContent=on?'Currently selected':'Try this palette';const f=families.find(f=>f.id===b.dataset.id),p=current(f);const title=$('.palette-option-copy strong',b),mood=$('.palette-option-copy small',b),chips=$('.palette-swatches',b);if(title)title.innerHTML=p.name+badge(f);if(mood)mood.textContent=p.mood;const used=$('.palette-used-colours',b);if(used)used.textContent=p.labels.join(' · ');if(chips)chips.innerHTML=p.colours.map(c=>`<i style="background:${c}"></i>`).join('');});
    const note=$('#appearance-recommendation');if(note)note.textContent=recommendation();
    onModeSync?.(mode);
  }
  function apply({id,nextMode,silent=false,remember=true}={}){
    let target=id||palette,targetMode=nextMode||mode;const family=families.find(f=>f.id===target);if(!family||!['light','dark'].includes(targetMode))return;
    if(nextMode==='light'&&family.nightOnly)target=lastDayPalette;else if(family.nightOnly)targetMode='dark';
    palette=target;mode=targetMode;if(mode==='light'){lastDayPalette=palette;put('lastDayPalette',palette);}
    document.documentElement.dataset.palette=palette;document.documentElement.dataset.mode=mode;
    const savedPalette=put('palette',palette);
    let savedMode=true;
    if(remember){
      savedMode=put('mode',mode);
      put('time-choice',mode);
      try{localStorage.setItem('boogas-mobile-time-chosen','1');}catch{}
    }
    const url=new URL(location.href);
    if(url.searchParams.has('palette')||id)url.searchParams.set('palette',palette);
    if(url.searchParams.has('mode'))url.searchParams.set('mode',mode);
    history.replaceState(null,'',url);
    updateUI();
    if(!silent)toast(`${current().name}${savedPalette&&savedMode?' — saved.':' — applied for this visit.'}`);
  }
  function open(){openDrawer('Make yourself at home.',`<p class="drawer-intro">Choose a mood. Keep the BOOGAS spirit.<br>Each swatch shows the colours in that theme.</p>${modeSwitch()}<div id="appearance-options" class="palette-options" data-mode="${mode}">${options()}</div><p id="appearance-recommendation">${recommendation()}</p><a class="text-link" href="#colours">Compare the colour directions ${icon('arrow')}</a>`);}
  function cards(list){return list.map((f,i)=>{const p=current(f),recommended=f.id==='brand-moss';return `<article class="palette-card" data-brand="${!!f.brand}" data-preview-mode="${mode}" style="--sample-paper:${p.colours[0]};--sample-primary:${p.colours[1]};--sample-soft:${p.soft||p.colours[2]};--sample-ink:${p.ink||p.colours[3]};--sample-secondary:${p.secondary||p.colours[1]};--sample-story:${mode==='dark'?(p.secondary||p.colours[1]):(p.textAccent||p.colours[1])};--sample-panel:${p.panel||p.soft||p.colours[2]}"><div class="palette-mini"><div class="mini-top"><img src="assets/brand-logo.webp" alt="BOOGAS" width="1140" height="350"><span>${mode==='dark'?'AFTER HOURS.':'MODERN LIFE.'}</span></div><img class="mini-photo" src="assets/world/town-crew.webp" alt="The BOOGAS crew together in town" width="1200" height="674"><div class="mini-copy"><span class="eyebrow">COME FOR THE GOOD STUFF.</span><h2>Stay for the<br><span>good company.</span></h2><span class="mini-cta">Find your people ${icon('arrow')}</span></div><div class="mini-bottom"><span class="mini-stamp">GOOD TOGETHER.</span><span>MODERN LIFE. PREHISTORIC JOY.</span></div></div><div class="palette-description"><span class="palette-number">${f.brand?'BRAND COLOURS':'OTHER DIRECTION'} / 0${i+1}${recommended?' / OUR PICK':''}</span><h2>${p.name}</h2><p>${p.note}</p><div class="palette-tokens" style="--token-count:${p.colours.length}">${p.colours.map((c,j)=>`<span><i style="background:${c}"></i><strong>${p.labels[j]}</strong><small>${c}</small></span>`).join('')}</div><button class="button full" data-action="set-palette" data-id="${f.id}" aria-pressed="${palette===f.id}"><span class="palette-use-label">${palette===f.id?'Currently selected':'Try this palette'}</span>${icon('check')}</button><a class="text-link" href="?palette=${f.id}&mode=${mode}#home">See the storefront ${icon('arrow')}</a></div></article>`;}).join('');}
  function gallery(){return `<section class="palette-grid container" aria-label="Brand colours">${cards(brandFamilies)}</section><details class="palette-archive container"><summary>Other colour directions ${chevron}</summary><div class="palette-grid">${cards(visibleFamilies().filter(f=>!f.brand))}</div></details>`;}
  function colours(){return `<section class="page-lead container colour-lead"><div><span class="eyebrow">BOOGAS / BRAND COLOURS</span><h1>One signature.<br>Room to play.</h1><p>Charcoal and moss lead. Stone keeps it warm.<br>Compare the signature with a little ochre or rose.</p></div>${modeSwitch()}</section><div id="palette-examples" data-mode="${mode}">${gallery()}</div><div class="previous-designs container"><span>Earlier designs</span><a href="compare.html">Visit the design archive ${icon('up')}</a></div>`;}
  function setModeSync(fn){onModeSync=fn;}
  put('palette',palette);updateUI();return {open,apply,colours,setModeSync};
}
