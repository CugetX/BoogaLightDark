import { mugDetailViewer } from './product-details.js';
export const productHref=(id,options={})=>id==='collection'?'#kit':`#product/${id}${id==='tee'&&options.Colour==='Black'?'/black':''}`;
export function createProductView({products,photo,productCard,arrowLink,icon,optionFields}) {
  const descriptions={tee:'Your everyday uniform. A little prehistoric joy, worn your way.',cap:'For the scenic route. A quiet badge of prehistoric joy.',mug:'Good mornings start here. Charcoal outside. BOOGAS green inside.',socks:'A little green attitude. A little more bounce in your step.'};
  const care={tee:'Final fit and care instructions coming before launch.',cap:'Final materials, closure and fit coming before launch.',socks:'Final composition and shoe-size ranges coming before launch.',mug:'Carbon steel with enamel coating. Do not microwave. Final care guidance coming before launch.'};
  function photos(p) {
    if(p.id==='tee')return [{src:photo('tee'),label:'Off-white tee',colour:'Off-white'},{src:photo('tee',{Colour:'Black'}),label:'Black tee',colour:'Black'}];
    if(p.id==='mug')return [{src:photo('mug'),label:'Studio view'},{src:'assets/refined/coffee-moment-male-v19.webp',label:'Your morning ritual'}];
    if(p.id==='cap')return [{src:photo('cap'),label:'Studio view'},{src:'assets/optimized/cap-detail.webp',label:'The Boogas badge'}];
    return [{src:photo(p.id),label:'Studio view'}];
  }
  function product(id,variant) {
    const p=products.find(p=>p.id===id);if(!p)return '';
    const images=photos(p),colour=variant==='black'?'Black':'Off-white',active=id==='tee'&&colour==='Black'?1:0;
    return `<div class="breadcrumbs container"><a href="#home/collection">The collection</a><span>/</span><span>${p.title}</span></div><section class="product-page clean-product container"><div class="product-gallery"><button class="gallery-main" data-action="zoom" aria-label="Enlarge ${p.title}"><img id="product-image" src="${images[active].src}" alt="${p.title} — ${images[active].label}" width="1254" height="1254" fetchpriority="high"><span>A CLOSER LOOK ${icon('plus')}</span></button>${images.length>1?`<div class="gallery-thumbs" role="group" aria-label="Product images">${images.map((x,i)=>`<button type="button" data-action="gallery" data-src="${x.src}" data-label="${x.label}" ${x.colour?`data-colour="${x.colour}"`:''} aria-label="${x.label}" aria-pressed="${i===active}"><img src="${x.src}" alt="" width="100" height="100"></button>`).join('')}</div>`:''}<p class="image-caption">AI concept imagery. Final product details may vary.</p></div><div class="product-info"><span class="eyebrow">CODE 001 / THE GOOD STUFF</span><h1>${p.title}</h1><span class="product-price">Price coming soon</span><p class="product-description">${descriptions[id]}</p><form id="save-product" data-id="${id}">${optionFields(p,'',{Colour:colour})}${['tee','socks','cap'].includes(id)?`<button type="button" class="fit-link text-link" data-action="fit" data-id="${id}">Size & fit ${icon('plus')}</button>`:''}<button type="submit" class="button full">Save to your Stash ${icon('heart')}</button><p class="save-explanation">Your favourites, saved here. Orders aren’t open yet.</p></form><div class="product-accordions"><details><summary>Details & care ${icon('plus')}</summary>${id==='mug'?mugDetailViewer('product'):''}<dl>${p.details.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl><p>${care[id]}</p></details><details><summary>Delivery & returns ${icon('plus')}</summary><p>Prices, delivery and returns will be confirmed before launch.</p></details></div><a class="product-kit-link text-link" href="#kit">Good together. Build your kit ${icon('arrow')}</a></div></section><section class="related clean-related container section-space"><div class="section-heading"><div><span class="eyebrow">IN GOOD COMPANY</span><h2>Good together.</h2></div>${arrowLink('#home/collection','All the good stuff')}</div><div class="items-grid">${({tee:['mug','cap'],mug:['tee','socks'],cap:['tee','mug'],socks:['tee','cap']}[id]||[]).map(id=>productCard(products.find(p=>p.id===id))).join('')}</div></section>`;
  }
  function selectColour(colour) {
    const form=document.querySelector('#save-product');if(form?.dataset.id!=='tee')return;
    const value=colour==='Black'?'Black':'Off-white';
    form.querySelectorAll('input[name="Colour"]').forEach(input=>input.checked=input.value===value);
    const img=document.querySelector('#product-image');img.src=photo('tee',{Colour:value});img.alt=`Heavy Tee 001 — ${value} tee`;
    document.querySelectorAll('[data-action="gallery"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.colour===value)));
    form.querySelector('button[type="submit"]').innerHTML=`Save to your Stash ${icon('heart')}`;
    history.replaceState(null,'',location.pathname+location.search+productHref('tee',{Colour:value}));
  }
  function gallery(button) {
    if(button.dataset.colour){selectColour(button.dataset.colour);return;}
    const img=document.querySelector('#product-image');img.src=button.dataset.src;img.alt=button.dataset.label;
    document.querySelectorAll('[data-action="gallery"]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  }
  function cardColour(button) {
    const card=button.closest('.item-card'),colour=button.dataset.colour;
    const img=card.querySelector('.item-image>img');img.src=photo('tee',{Colour:colour});img.alt=`Heavy Tee 001 — ${colour} concept`;
    card.querySelectorAll('[data-product-link]').forEach(a=>a.href=productHref('tee',{Colour:colour}));
    card.querySelectorAll('[data-action="card-colour"]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    card.querySelector('.item-colour-name').textContent=colour;
  }
  return {product,selectColour,gallery,cardColour};
}
