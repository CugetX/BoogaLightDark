// The final Everyday pass: keep the original store untouched and compose new features here.
export function createEnhancements(ctx) {
  const { $, $$, products, esc, icon, photo, arrowLink, optionFields, openDrawer, toast, addItems } = ctx;
  const goods = ['tee', 'cap', 'mug', 'socks'].map(id => products.find(p => p.id === id));
  const parcel = 'assets/optimized/parcel.webp';
  const short = { tee: 'Your everyday uniform.', cap: 'A little character, quietly worn.', mug: 'Make a little time for yourself.', socks: 'A small reminder to keep moving.' };
  const highlights = p => `<div class="product-highlights"><span>${esc(p.details[0][1])}</span><span>${esc(p.id === 'tee' ? 'Two colourways' : p.id === 'mug' ? 'A little green inside' : p.id === 'cap' ? 'The BOOGAS badge' : 'Black / Olive')}</span></div>`;
  const detailPhoto = id => ['tee','cap'].includes(id) ? `assets/optimized/${id}-detail.webp` : '';
  const fit = {
    tee: { title: 'Heavy Tee 001 · Sizing & fit', sizes: ['S', 'M', 'L', 'XL'], text: 'These are the planned size options. Garment measurements, fit notes and model measurements have not been confirmed yet.', note: 'Choose a size to keep with your shortlist. Check the final measurement chart before placing an order.' },
    socks: { title: 'Everyday Bounce Socks · Sizing', sizes: ['S / M', 'L / XL'], text: 'Two size options are planned. The matching shoe-size ranges and final fabric composition are still to be confirmed.', note: 'Your saved choice is a preference, not a fit recommendation.' },
    cap: { title: 'Black Cap 001 · Fit information', sizes: [], text: 'The concept is a structured five-panel cap. Its final circumference, closure and fit have not been confirmed.', note: 'A complete fit guide will be available before orders open.' }
  };
  function showFit(id) {
    const f = fit[id]; if (!f) return;
    openDrawer(f.title, `<div class="fit-panel"><span class="eyebrow">A FIRST LOOK, WITH THE DETAILS STILL TO COME</span>${f.sizes.length ? `<div class="planned-sizes" aria-label="Planned sizes">${f.sizes.map(s => `<span>${s}</span>`).join('')}</div>` : ''}<h3>A little clarity<br>before you choose.</h3><p>${f.text}</p><p>${f.note}</p><div class="fit-status">No order or reservation is made when you save a piece.</div></div>`);
  }
  function productStory(p) {
    return `<div class="product-connection"><img src="assets/${p.id === 'mug' ? 'editorial/nomad-cutout' : 'emblem'}.webp" alt="" width="80" height="80"><div><span class="eyebrow">THE CODE, IN YOUR EVERYDAY</span><p>${short[p.id]}</p>${arrowLink('#code', 'Meet the Code behind it')}</div></div><a class="product-story-link" href="#kit"><span>Good on its own. Better with your crew.<small>Build a kit around this piece.</small></span>${icon('arrow')}</a>`;
  }
  function homeKit() {
    return `<section class="kit-section final-kit container section-space"><div class="kit-photo"><img src="${parcel}" alt="Packaging concept: a forest-green BOOGAS parcel with the four essentials and a postcard of the island" width="1536" height="1024" loading="lazy"><span class="parcel-caption">THE BOUNCE KIT / PACKAGING CONCEPT</span></div><div class="kit-copy"><span class="eyebrow">A LITTLE OF OUR WORLD. A LOT OF YOUR EVERYDAY.</span><h2>Good together.<br><em>Better your way.</em></h2><p>The tee. The cap. The mug. The socks.<br>Pick your favourites and make a little crew of your own.</p><ol class="kit-steps"><li><span>01</span> Choose your pieces</li><li><span>02</span> Find your sizes</li><li><span>03</span> Keep them in your Stash</li></ol>${arrowLink('#kit','Build your everyday kit','button')}<p class="concept-note">Parcel and postcard shown as design concepts.<br>Final packaging and included extras are to be confirmed.</p></div></section>`;
  }
  function kit() {
    return `<section class="page-lead kit-lead container"><span class="eyebrow">THE BOUNCE KIT / YOUR WAY</span><h1>Good together.<br><em>Better your way.</em></h1><p>Four everyday essentials. Pick what feels like you.</p></section><section class="kit-builder container"><form id="kit-form"><div class="builder-heading"><span class="eyebrow">01 / MAKE YOUR LITTLE CREW</span><span>Choose any combination</span></div>${goods.map((p,i) => `<article class="kit-choice" data-item="${p.id}"><label class="kit-choice-label"><input type="checkbox" name="items" value="${p.id}" checked><span class="kit-checkbox" aria-hidden="true">${icon('check')}</span><img src="${photo(p.id)}" alt="" width="100" height="100"><span><strong>${p.title}</strong><small>${p.short}</small></span><span class="kit-item-number" aria-hidden="true">0${i+1}</span></label><div class="kit-options" role="group" aria-label="${esc(p.title)} options">${optionFields(p,p.id+'-')}${['tee','cap','socks'].includes(p.id)?`<button type="button" class="kit-fit" data-action="fit" data-id="${p.id}">Size & fit ${icon('plus')}</button>`:'<p class="kit-option-note">12 oz / 355 ml · Carbon steel with enamel coating</p>'}</div></article>`).join('')}<div class="kit-savebar"><button type="submit" class="button full">Save this kit to your Stash ${icon('heart')}</button><p>Your chosen pieces are saved individually in this browser.<br>No order, payment or reservation. Prices are coming soon.</p></div></form><aside class="kit-preview"><div class="kit-preview-photo"><img src="${parcel}" alt="Packaging concept showing all four BOOGAS pieces with a forest-green parcel and island postcard" width="1536" height="1024"><span class="parcel-caption">THE FULL KIT / PACKAGING CONCEPT</span></div><div class="kit-summary"><span class="eyebrow">02 / IN GOOD COMPANY</span><h2 id="kit-count" aria-live="polite">4 good things.<br>One little kit.</h2><div class="packed-pieces" aria-label="Your selected pieces">${goods.map(p=>`<div data-packed="${p.id}"><img src="${photo(p.id)}" alt="${p.title}" width="100" height="100"><span>${p.id==='tee'?'Tee':p.id==='cap'?'Cap':p.id==='mug'?'Mug':'Socks'}</span></div>`).join('')}</div><p class="kit-empty" hidden>Choose a piece to start your kit.</p><p class="concept-note">Packaging concept shown with all four pieces. Your selected pieces appear above.</p></div><a href="#world" class="kit-world-link"><img src="assets/world/island.webp" alt="" width="100" height="100"><span>A little world to get lost in.<small>Follow the island postcard.</small></span>${icon('arrow')}</a></aside></section>`;
  }
  function updateKit() {
    const form = $('#kit-form'); if (!form) return;
    const selected = $$('input[name="items"]:checked', form).map(x=>x.value);
    $$('.kit-choice',form).forEach(row=>{
      const on=selected.includes(row.dataset.item);
      row.classList.toggle('not-packed',!on);
      const options=$('.kit-options',row); options.hidden=!on;
      $$('input',options).forEach(input=>input.disabled=!on);
    });
    $$('[data-packed]').forEach(el=>el.hidden=!selected.includes(el.dataset.packed));
    const colour=$('input[name="tee-Colour"]:checked',form)?.value||'Off-white';
    $$('.kit-choice[data-item="tee"] img, [data-packed="tee"] img').forEach(img=>{img.src=photo('tee',{Colour:colour});img.alt=`Heavy Tee 001 — ${colour}`;});
    const parcelImage=$('.kit-preview-photo>img');parcelImage.src=colour==='Black'?'assets/refined/parcel-black.webp':parcel;parcelImage.alt=`Bounce Kit packaging concept with the ${colour.toLowerCase()} tee`;

    $('#kit-count').innerHTML=selected.length?`${selected.length} good ${selected.length===1?'thing':'things'}.<br>One little kit.`:'A little room<br>for good things.';
    $('.kit-empty').hidden=!!selected.length;
    const save=$('button[type="submit"]',form);save.disabled=!selected.length;
    save.innerHTML=`Save this kit to your Stash ${icon('heart')}`;
  }
  function saveKit(form) {
    const f=new FormData(form),selected=f.getAll('items');if(!selected.length)return;
    const items=selected.map(id=>({id,options:Object.fromEntries(Object.keys(goods.find(p=>p.id===id).options).map(k=>[k,f.get(id+'-'+k)]))}));
    const result=addItems(items);
    toast(!result.added?'Your whole kit is already waiting in your Stash.':result.saved?`${result.added} ${result.added===1?'piece':'pieces'} saved. Your kit is in your Stash.`:'Saved for this visit. Browser storage is unavailable.');
    $('button[type="submit"]',form).innerHTML=`Your kit is saved ${icon('check')}`;
  }
  const places=[
    {id:'jungle',name:'The Jungle',label:'THE SCENIC ROUTE',x:28,y:51,image:'assets/world/jungle.webp',title:'Take the long way.',text:'A little curiosity goes a long way. Start with the lush green side of Boogas World, then follow the crew into the story.',product:'cap',link:'#watch',cta:'Follow the story'},
    {id:'town',name:'The Town',label:'GOOD COMPANY',x:55,y:66,image:'assets/world/town-crew.webp',title:'Find your people.',text:'Different characters. Shared adventures. Meet the crew at the heart of the world, and find a little of yourself along the way.',product:'tee',link:'#watch',cta:'Meet them in the story'},
    {id:'cave',name:'The CAVE',label:'YOUR CORNER OF THE WORLD',x:44,y:40,image:'assets/world-cave.webp',title:'Make yourself at home.',text:'A closer look at the community hub in development. Explore five original spaces and choose the one that feels like you.',product:'mug',link:'#cave',cta:'Look inside the CAVE'}
  ];
  let selectedPlace='jungle';
  function placeContent(p) {
    const item=products.find(x=>x.id===p.product);
    return `<img class="field-photo" src="${p.image}" alt="${p.name} in Boogas World" width="800" height="450" loading="lazy"><div class="field-note"><span class="eyebrow">${p.label}</span><h3>${p.title}</h3><p>${p.text}</p>${arrowLink(p.link,p.cta)}<a class="field-good" href="#product/${p.product}"><img src="${photo(p.product)}" alt="" width="80" height="80"><span><small>A LITTLE SOMETHING TO BRING ALONG</small>${item.title}</span>${icon('arrow')}</a></div>`;
  }
  function fieldGuide() {
    return `<section class="field-guide container section-space" aria-labelledby="field-title"><div class="section-heading"><div><span class="eyebrow">THE ISLAND / A SMALL FIELD GUIDE</span><h2 id="field-title">Pick a place.<br><em>See where it goes.</em></h2></div><p>Three starting points.<br>A whole world to discover.</p></div><div class="field-layout"><div class="field-map-wrap"><div class="field-map"><img src="assets/world/island.webp" alt="The original Boogas island map with jungle, mountains, town and the CAVE" width="900" height="900" loading="lazy">${places.map((p,i)=>`<button class="map-pin" style="--pin-x:${p.x}%;--pin-y:${p.y}%" data-action="place" data-id="${p.id}" aria-label="Explore ${p.name}" aria-controls="place-panel" aria-pressed="${p.id===selectedPlace}"><span>0${i+1}</span></button>`).join('')}</div><div class="field-legend">${places.map((p,i)=>`<button data-action="place" data-id="${p.id}" aria-pressed="${p.id===selectedPlace}"><span>0${i+1}</span>${p.name}</button>`).join('')}</div><p class="field-caption">Original BOOGAS artwork. Select a marker to explore.</p></div><div id="place-panel" class="field-panel" aria-live="polite">${placeContent(places.find(p=>p.id===selectedPlace))}</div></div></section>`;
  }
  function selectPlace(id) {
    const p=places.find(x=>x.id===id);if(!p||!$('#place-panel'))return;
    selectedPlace=id;$('#place-panel').innerHTML=placeContent(p);
    $$('[data-action="place"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===id)));
    if(innerWidth<900)$('#place-panel').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'nearest'});
  }
  return {homeKit,kit,updateKit,saveKit,fieldGuide,selectPlace,showFit,productStory,highlights,detailPhoto};
}
