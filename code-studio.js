// The brand idea is readable on the homepage; extra words open where you are.
export function createCodeStudio({icon,arrowLink}) {
  const pleasures = [
    ['shower','Hot showers','A little everyday luxury. Take a moment to appreciate it.','<path d="M4 9V6a3 3 0 0 1 6 0v1m-3 3 6-3m-6 3 1 2 7-3-2-2M9 16v1m4-3v1m4-2v1M11 20v1m4-3v1m4-3v1"/>'],
    ['coffee','Coffee','Make a ritual of it. Even five quiet minutes count.','<path d="M4 8h12v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Zm12 1h2a3 3 0 0 1 0 6h-2M7 2v3m4-3v3"/>'],
    ['trainers','Trainers','Your favourite pair. An excuse to take the long way home.','<path d="m3 8 5 2 4-2 3 6 5 2a2 2 0 0 1 1 4H3V8Zm0 9h17M11 11l3-1m-1 4 3-1"/>'],
    ['music','Music','Put your favourite song on again. Yes, again.','<path d="M9 17V5l11-2v12M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="16" rx="3" ry="2"/>'],
    ['planes','Planes','A whole world out there. Stay a little curious.','<path d="m3 11 7 1 6-8c1-1 3-1 3 1l-4 8 5 5-2 1-6-3-3 4-2-1 2-5-6-1Z"/>'],
    ['surf','Surfboards','A little adventure. A very good reason to get outside.','<path d="M5 20C3 9 10 2 19 3c1 9-6 16-14 17ZM6 19 17 5M4 22l3-3"/>'],
    ['people','Good people','Send the message. Make the plan. Make time for your people.','<circle cx="9" cy="7" r="3"/><path d="M3 20v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v3"/>']
  ];
  const principles = [
    ['quality','Quality comes first.','Good design starts with the things you touch. The weight of a tee. The finish of a mug. The details that make it a favourite.'],
    ['notice','Notice the good stuff.','Stop outsourcing joy to future success. The good things are already here. A morning coffee. A favourite track. A day outside. Notice them.'],
    ['bounce','Put a bounce in your step.','You don’t need a new life to enjoy this one. Take the long way home. Make room for a little adventure.'],
    ['use','Use the good stuff.','Don’t save your favourites for someday. Make the everyday ritual the occasion.']
  ];
  function ritual(page=false) {
    const h=page?'h1':'h2';
    return `<header class="code-section-heading"><${h} id="ritual-title" class="code-title">THE BOOGAS <span>CODE.</span></${h}></header><div class="ritual-section curated-ritual refined-ritual"><div class="ritual-art"><div class="ritual-stage" data-era="then" id="ritual-scene"><span class="ritual-datestamp" aria-live="polite">A VERY GOOD IDEA.<br>A VERY LONG TIME AGO.</span><img class="ritual-then" src="assets/editorial/nomad-cutout.webp" alt="Nomad enjoying a coffee from a stone mug" width="1000" height="1000" loading="lazy"><img class="ritual-now" src="assets/refined/coffee-moment-male-v19.webp" alt="A man taking a quiet moment to enjoy coffee in the charcoal and green BOOGAS mug" width="1254" height="1254" aria-hidden="true" loading="lazy"><div class="era-switch" role="group" aria-label="See the ritual in two worlds"><button data-action="ritual" data-era="then" aria-pressed="true" aria-controls="ritual-scene">Their world</button><button data-action="ritual" data-era="now" aria-pressed="false" aria-controls="ritual-scene">Your world</button></div></div></div><div class="ritual-copy"><p class="code-belief">The good stuff<br><em>is already here.</em></p><p>Imagine cavemen discovering a hot coffee, a soft tee and their favourite song. They’re amazed by the things we barely notice.</p><p>BOOGAS is a little reminder to notice them again.</p></div></div>`;
  }
  function playbook(page=false) {
    const h=page?'h2':'h3';
    return `<div class="code-playbook"><div class="everyday-perspective"><${h}>Appreciate the small things.</${h}><div class="pleasure-buttons" role="group" aria-label="The simple things"><span class="sr-only">Choose a little thing to appreciate.</span>${pleasures.map(([id,label,,svg])=>`<button type="button" data-action="little-joy" data-id="${id}" aria-pressed="${id==='coffee'}" aria-controls="little-joy-note"><svg viewBox="0 0 24 24" aria-hidden="true">${svg}</svg><span>${label}</span></button>`).join('')}</div><p id="little-joy-note" class="pleasure-note" aria-live="polite">Make a ritual of it. Even five quiet minutes count.</p></div><div class="code-rules"><div class="code-rules-heading"><${h}>A few words we live by.</${h}></div>${principles.map(([id,title,text],i)=>`<details class="code-rule" id="code-${id}" name="boogas-code" tabindex="-1"><summary><span class="rule-number">0${i+1}</span><span class="rule-title">${title}</span><span class="rule-toggle">${icon('plus')}</span></summary><div class="rule-copy"><p>${text}</p></div></details>`).join('')}</div></div>`;
  }
  function littleJoy(button) {
    document.querySelectorAll('[data-action="little-joy"]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    document.querySelector('#little-joy-note').textContent=pleasures.find(p=>p[0]===button.dataset.id)?.[2]||pleasures[1][2];
  }
  function page(){return `<section class="code-page curated-code container" aria-labelledby="ritual-title">${ritual(true)}${playbook(true)}<div class="code-page-finish">${arrowLink('#home/collection','Use the good stuff','button')}<button class="text-link" data-action="community">Find your people ${icon('arrow')}</button></div></section>`;}
  return {ritual,playbook,littleJoy,page};
}
