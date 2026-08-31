(()=>{
'use strict';
async function apply(){
  const s=await SomtodayPlusStorage.get(),r=document.documentElement;
  const classes={
    'stp-disabled':!s.enabled,'stp-rounded':s.rounded,'stp-animations':s.animations&&!s.reduceMotion,
    'stp-compact':s.compact,'stp-gradient':s.gradient,'stp-glass':s.glass,'stp-shadows':s.shadows,
    'stp-high-contrast':s.highContrast,'stp-soft-cards':s.softCards,'stp-sidebar-compact':s.sidebarCompact
  };
  Object.entries(classes).forEach(([c,on])=>r.classList.toggle(c,!!on));
  r.style.setProperty('--stp-accent',s.accent||'#1565c0');
  r.style.setProperty('--stp-accent-soft',`color-mix(in srgb,${s.accent||'#1565c0'} 12%,transparent)`);
  r.style.setProperty('--stp-gradient',s.gradient?`linear-gradient(${Number(s.gradientAngle)||135}deg,${s.gradientA},${s.gradientB})`:'none');
  r.style.setProperty('--stp-font-scale',String(s.fontScale||1));
  r.style.setProperty('--stp-card-gap',`${s.cardGap??12}px`);
}
apply();window.addEventListener('stp:settings',apply);chrome.storage.onChanged.addListener(apply);
})();