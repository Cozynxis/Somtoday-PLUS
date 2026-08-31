(()=>{
'use strict';
const OVERLAY_ID='stp-settings-overlay';
const VERSION=chrome.runtime.getManifest().version;
const sections=[
  {id:'general',icon:'⚙',title:'Algemeen',desc:'De belangrijkste Somtoday PLUS+ opties.',items:[
    ['toggle','enabled','Somtoday PLUS+ ingeschakeld','Zet alle PLUS+ aanpassingen aan of uit.'],
    ['toggle','animations','Vloeiende animaties','Gebruik subtiele animaties en overgangen.'],
    ['toggle','quickCommand','Ctrl + K snelmenu','Open overal snel acties met Ctrl + K.'],
    ['toggle','stickyTopbar','Bovenbalk vastzetten','Houd de bovenste Somtoday-balk zichtbaar tijdens scrollen.']
  ]},
  {id:'appearance',icon:'✦',title:'Uiterlijk',desc:'Maak de interface rustiger, compacter of juist opvallender.',items:[
    ['color','accent','Accentkleur','Kleur voor PLUS+ accenten, knoppen en highlights.'],
    ['toggle','rounded','Rondere interface','Maak kaarten, menu’s en panelen ronder.'],
    ['toggle','softCards','Zachte kaarten','Voeg subtiele achtergronden toe aan kaarten.'],
    ['toggle','shadows','Extra schaduwen','Meer diepte bij kaarten en menu’s.'],
    ['toggle','glass','Glas-effect','Geeft ondersteunde onderdelen een lichte blur.'],
    ['toggle','compact','Compacte weergave','Minder witruimte zodat meer informatie tegelijk zichtbaar is.'],
    ['toggle','sidebarCompact','Compacte zijbalk','Maak ondersteunde navigatie compacter.'],
    ['range','fontScale','Tekstgrootte','Schaal de interface subtiel mee.',0.9,1.12,0.01],
    ['range','cardGap','Ruimte tussen kaarten','Stel de algemene ruimte tussen ondersteunde kaarten in.',6,22,1]
  ]},
  {id:'background',icon:'◐',title:'Achtergrond',desc:'Gebruik een eigen rustige achtergrond zonder Somtoday onleesbaar te maken.',items:[
    ['toggle','gradient','Gradient achtergrond','Gebruik twee kleuren als achtergrond.'],
    ['color','gradientA','Gradient kleur 1','Eerste kleur van de achtergrond.'],
    ['color','gradientB','Gradient kleur 2','Tweede kleur van de achtergrond.'],
    ['range','gradientAngle','Richting gradient','Draai de richting van de gradient.',0,360,1]
  ]},
  {id:'focus',icon:'◎',title:'Focus & leren',desc:'Minder afleiding tijdens huiswerk of leren.',items:[
    ['toggle','focusMode','Focusmodus','Maak zij-elementen rustiger zodat de hoofdinhoud centraal staat.'],
    ['toggle','dimWeekends','Weekenden rustiger','Maak weekendkolommen subtieler waar mogelijk.'],
    ['toggle','scheduleAccent','Rooster accent','Geef roosteritems een subtiele PLUS+ accentbehandeling.']
  ]},
  {id:'privacy',icon:'◉',title:'Privacy',desc:'Handig wanneer iemand met je meekijkt op je scherm.',items:[
    ['toggle','privacyMode','Privacymodus','Vervaag cijfers en cijferachtige waarden. Beweeg erover om ze tijdelijk te zien.']
  ]},
  {id:'browser',icon:'▣',title:'Browser',desc:'Kleine aanpassingen aan het browsergedrag.',items:[
    ['toggle','customTitleEnabled','Eigen tabbladtitel','Gebruik een eigen titel voor het Somtoday-tabblad.'],
    ['text','customTitle','Tabbladtitel','Bijvoorbeeld: School · Somtoday PLUS+'],
    ['toggle','selectableText','Tekst selecteerbaar','Maak zoveel mogelijk tekst selecteerbaar.'],
    ['toggle','hideScrollbar','Scrollbar verbergen','Verberg alleen de zichtbare scrollbar; scrollen blijft werken.']
  ]},
  {id:'accessibility',icon:'A',title:'Toegankelijkheid',desc:'Extra opties voor rust en duidelijkheid.',items:[
    ['toggle','reduceMotion','Minder beweging','Schakel PLUS+ animaties grotendeels uit.'],
    ['toggle','highContrast','Meer contrast','Maak PLUS+ onderdelen duidelijker zichtbaar.']
  ]},
  {id:'presets',icon:'◇',title:'Presets',desc:'Pas meerdere instellingen tegelijk toe.',special:'presets'},
  {id:'backup',icon:'⇅',title:'Backup & herstel',desc:'Bewaar je PLUS+ instellingen of zet ze terug.',special:'backup'},
  {id:'about',icon:'+',title:'Over Somtoday PLUS+',desc:'Versie, sneltoetsen en projectinformatie.',special:'about'}
];
const esc=v=>{const e=document.createElement('div');e.textContent=v??'';return e.innerHTML};
function itemHtml(it){const [type,key,label,desc,min,max,step]=it;if(type==='toggle')return `<label class="stp-setting-row"><span><b>${label}</b><small>${desc}</small></span><input class="stp-switch" type="checkbox" data-key="${key}"></label>`;if(type==='color')return `<label class="stp-setting-row"><span><b>${label}</b><small>${desc}</small></span><span class="stp-color-wrap"><input type="color" data-key="${key}"><code data-color-for="${key}"></code></span></label>`;if(type==='range')return `<label class="stp-setting-row stp-range-row"><span><b>${label}</b><small>${desc}</small></span><span class="stp-range-wrap"><input type="range" min="${min}" max="${max}" step="${step}" data-key="${key}"><output data-output-for="${key}"></output></span></label>`;if(type==='text')return `<label class="stp-setting-row stp-text-row"><span><b>${label}</b><small>${desc}</small></span><input class="stp-text-input" type="text" data-key="${key}" autocomplete="off"></label>`;return ''}
function specialHtml(section){if(section.special==='presets')return `<div class="stp-preset-grid"><button data-preset="default"><span>☀</span><b>Standaard+</b><small>Rustige verbeteringen zonder grote stijlwijzigingen.</small></button><button data-preset="clean"><span>◌</span><b>Clean</b><small>Compact, zacht en minimaal.</small></button><button data-preset="focus"><span>◎</span><b>Focus</b><small>Rustige interface voor huiswerk en leren.</small></button><button data-preset="color"><span>✦</span><b>Color</b><small>Gradient, accent en extra diepte.</small></button></div>`;if(section.special==='backup')return `<div class="stp-action-grid"><button data-action="export"><b>Exporteer instellingen</b><small>Download een JSON-backup van jouw PLUS+ instellingen.</small></button><button data-action="import"><b>Importeer instellingen</b><small>Lees een eerder geëxporteerde PLUS+ backup in.</small></button><button class="danger" data-action="reset"><b>Reset PLUS+</b><small>Zet alle PLUS+ instellingen terug naar standaard.</small></button><input type="file" accept="application/json" class="stp-import-file" hidden></div>`;if(section.special==='about')return `<div class="stp-about-card"><div class="stp-about-logo">+</div><div><h3>Somtoday PLUS+</h3><p>Versie ${esc(VERSION)}</p></div></div><div class="stp-about-grid"><div><b>Ctrl + K</b><small>Open snelmenu</small></div><div><b>Ctrl + Alt + S</b><small>Open PLUS+ instellingen</small></div><div><b>V1</b><small>Nieuwe zelfstandige basis</small></div></div><p class="stp-about-note">Somtoday PLUS+ is een onafhankelijke browserextensie en is niet officieel verbonden aan Somtoday.</p>`;return ''}
async function render(target,opts={}){const state=await SomtodayPlusStorage.get();target.classList.add('stp-settings-root');target.innerHTML=`<div class="stp-settings-layout"><aside class="stp-settings-side"><div class="stp-settings-brand"><span class="stp-settings-logo">+</span><span><b>Somtoday PLUS+</b><small>V${esc(VERSION)}</small></span></div><div class="stp-settings-search"><span>⌕</span><input placeholder="Zoek instellingen…"></div><nav>${sections.map((s,i)=>`<button data-section="${s.id}" class="${i===0?'active':''}"><i>${s.icon}</i><span>${s.title}</span></button>`).join('')}</nav></aside><section class="stp-settings-main"><div class="stp-settings-mainhead"><div><small>SOMTODAY PLUS+</small><h2>Instellingen</h2></div><span class="stp-live-badge">● Live</span></div><div class="stp-settings-content"></div></section></div>`;
const content=target.querySelector('.stp-settings-content'),search=target.querySelector('.stp-settings-search input');let active='general';
async function show(id,query=''){active=id;target.querySelectorAll('[data-section]').forEach(b=>b.classList.toggle('active',b.dataset.section===id));const section=sections.find(s=>s.id===id)||sections[0];const q=query.toLowerCase().trim();let items=section.items||[];if(q)items=sections.flatMap(s=>(s.items||[]).filter(it=>(it[2]+' '+it[3]).toLowerCase().includes(q)).map(it=>({...it,section:s.title})));let html='';if(q){html=`<div class="stp-page-title"><h3>Zoeken</h3><p>Resultaten voor “${esc(query)}”</p></div>`+(!items.length?'<div class="stp-empty">Geen instellingen gevonden.</div>':`<div class="stp-settings-card">${items.map(x=>itemHtml(Array.from(x))).join('')}</div>`)}else html=`<div class="stp-page-title"><h3>${section.title}</h3><p>${section.desc}</p></div>${section.special?specialHtml(section):`<div class="stp-settings-card">${items.map(itemHtml).join('')}</div>`}`;content.innerHTML=html;bindControls(content,state);bindSpecial(content,state)}
function bindControls(scope,s){scope.querySelectorAll('[data-key]').forEach(el=>{const key=el.dataset.key;if(el.type==='checkbox')el.checked=!!s[key];else el.value=s[key]??'';updateDecor(el,key);el.addEventListener('input',async()=>{let val=el.type==='checkbox'?el.checked:el.type==='range'?Number(el.value):el.value;s[key]=val;updateDecor(el,key);await SomtodayPlusStorage.set({[key]:val})})})}
function updateDecor(el,key){const scope=el.closest('.stp-settings-content')||target;if(el.type==='color'){const c=scope.querySelector(`[data-color-for="${key}"]`);if(c)c.textContent=el.value.toUpperCase()}if(el.type==='range'){const o=scope.querySelector(`[data-output-for="${key}"]`);if(o)o.textContent=key==='fontScale'?`${Math.round(Number(el.value)*100)}%`:key==='gradientAngle'?`${el.value}°`:`${el.value}px`}}
function bindSpecial(scope,s){scope.querySelectorAll('[data-preset]').forEach(b=>b.onclick=async()=>{const p=b.dataset.preset,map={default:{compact:false,rounded:true,softCards:true,shadows:true,glass:false,gradient:false,focusMode:false},clean:{compact:true,rounded:true,softCards:true,shadows:false,glass:false,gradient:false,cardGap:8},focus:{compact:true,rounded:true,softCards:true,shadows:false,gradient:false,focusMode:true,dimWeekends:true,cardGap:8},color:{compact:false,rounded:true,softCards:true,shadows:true,glass:true,gradient:true,gradientA:'#e8f3ff',gradientB:'#f7edff',gradientAngle:135}};Object.assign(s,map[p]);await SomtodayPlusStorage.set(map[p]);SomtodayPlusEnhancements?.toast(`Preset ${b.querySelector('b').textContent} toegepast`);show(active)});scope.querySelector('[data-action="export"]')?.addEventListener('click',async()=>{const raw=await SomtodayPlusStorage.export(),blob=new Blob([raw],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='somtoday-plus-settings.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});const file=scope.querySelector('.stp-import-file');scope.querySelector('[data-action="import"]')?.addEventListener('click',()=>file?.click());file?.addEventListener('change',async()=>{try{await SomtodayPlusStorage.import(await file.files[0].text());SomtodayPlusEnhancements?.toast('Instellingen geïmporteerd');Object.assign(s,await SomtodayPlusStorage.get());show('general')}catch{SomtodayPlusEnhancements?.toast('Kon backup niet importeren')}});scope.querySelector('[data-action="reset"]')?.addEventListener('click',async()=>{if(confirm('Alle Somtoday PLUS+ instellingen resetten?')){await SomtodayPlusStorage.reset();Object.assign(s,await SomtodayPlusStorage.get());show('general')}})}
target.querySelectorAll('[data-section]').forEach(b=>b.onclick=()=>{search.value='';show(b.dataset.section)});search.oninput=()=>show(active,search.value);show('general')}
async function openFallback(){document.getElementById(OVERLAY_ID)?.remove();const overlay=document.createElement('div');overlay.id=OVERLAY_ID;overlay.innerHTML='<div class="stp-fallback-shell"><button class="stp-fallback-close">×</button><div class="stp-fallback-target"></div></div>';document.body.appendChild(overlay);await render(overlay.querySelector('.stp-fallback-target'),{native:false});overlay.querySelector('.stp-fallback-close').onclick=()=>overlay.remove();overlay.onclick=e=>{if(e.target===overlay)overlay.remove()}}
window.SomtodayPlusSettings={render,openFallback,open(){return window.SomtodayPlusNativeSettings?.open()||openFallback()}};
})();