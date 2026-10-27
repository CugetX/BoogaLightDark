// Reuse the existing mug artwork for close-ups; product specifications stay concise.
const features = [
  {id:'design',title:'The design',text:'Prehistoric glyphs. Modern meaning.',image:'assets/refined/mug-front-v18.webp',x:'50%',y:'50%',zoom:'cover'},
  {id:'steel',title:'Carbon steel',text:'A carbon steel body, finished with enamel.',x:'42%',y:'82%',zoom:'250%'},
  {id:'finish',title:'Two finishes',text:'Matte charcoal outside. Glossy BOOGAS green inside.',x:'48%',y:'17%',zoom:'200%'},
  {id:'rim',title:'Rolled rim',text:'A rolled edge for the everyday ritual.',x:'20%',y:'16%',zoom:'300%'},
  {id:'glyphs',title:'Prehistoric glyphs',text:'Little characters. A whole world on your mug.',x:'15%',y:'33%',zoom:'360%'}
];

export function mugDetailViewer(scope='home') {
  const feature=features[0];
  return `<div class="mug-details-viewer" data-mug-details>
    <div class="mug-detail-options" role="group" aria-label="Explore the mug details">
      ${features.map((f,i)=>`<button type="button" data-action="mug-detail" data-feature="${f.id}" aria-pressed="${i===0}" aria-controls="${scope}-detail-description">${f.title}</button>`).join('')}
    </div>
    <div class="mug-detail-content">
      <div class="mug-macro" role="img" aria-label="Close-up: ${feature.title}" style="background-image:url('${feature.image||'assets/editorial/mug.webp'}');--macro-x:${feature.x};--macro-y:${feature.y};--macro-zoom:${feature.zoom}"></div>
      <div class="mug-detail-copy" id="${scope}-detail-description" aria-live="polite"><span class="eyebrow">THE CODE ENAMEL MUG / 01</span><strong>${feature.title}</strong><p>${feature.text}</p><small>Design concept close-up.</small></div>
    </div>
  </div>`;
}

export function homeProductDetails(icon) {
  return `<section class="home-product-details container" aria-labelledby="details-title"><details class="materials-disclosure"><summary><span class="materials-thumb" role="img" aria-label="Extreme close-up of the BOOGAS mug’s prehistoric glyphs and campfire detail"></span><span class="materials-heading"><span class="eyebrow">THE CODE ENAMEL MUG</span><h2 id="details-title">Good stuff.<br>Down to the details.</h2></span><span class="details-open-label">Take a closer look <span>${icon('plus')}</span></span></summary><div class="materials-content">${mugDetailViewer('home')}<a class="text-link" href="#product/mug">Meet your morning mug ${icon('arrow')}</a></div></details></section>`;
}

export function selectMugDetail(button) {
  const viewer=button.closest('[data-mug-details]'),index=features.findIndex(f=>f.id===button.dataset.feature),feature=features[index];
  if(!viewer||!feature)return;
  viewer.querySelectorAll('[data-action="mug-detail"]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  const image=viewer.querySelector('.mug-macro');
  image.style.backgroundImage=`url("${feature.image||'assets/editorial/mug.webp'}")`;
  image.style.setProperty('--macro-x',feature.x);image.style.setProperty('--macro-y',feature.y);image.style.setProperty('--macro-zoom',feature.zoom);
  image.setAttribute('aria-label',`Close-up: ${feature.title}`);
  const copy=viewer.querySelector('.mug-detail-copy');
  copy.querySelector('.eyebrow').textContent=`THE CODE ENAMEL MUG / 0${index+1}`;
  copy.querySelector('strong').textContent=feature.title;copy.querySelector('p').textContent=feature.text;
}
