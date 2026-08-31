(()=>{
'use strict';
let timer;
function boot(){window.SomtodayPlusNativeSettings?.scan();window.SomtodayPlusEnhancements?.apply()}
new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(boot,80)}).observe(document.documentElement,{childList:true,subtree:true});
boot();
console.log('%cSomtoday PLUS+ V1 actief','color:#1565c0;font-size:18px;font-weight:800');
})();