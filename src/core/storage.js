(()=>{
'use strict';
const defaults={
 enabled:true,accent:'#1565c0',rounded:true,animations:true,compact:false,softCards:true,shadows:true,glass:false,
 gradient:false,gradientA:'#e8f3ff',gradientB:'#ffffff',gradientAngle:135,fontScale:1,fontFamily:'system',cardGap:12,menuDensity:'normal',
 focusMode:false,privacyMode:false,privacyHoverReveal:true,selectableText:false,hideScrollbar:false,stickyTopbar:false,dimWeekends:false,
 customTitleEnabled:false,customTitle:'Somtoday',quickCommand:true,reduceMotion:false,highContrast:false,scheduleAccent:true,scheduleCompact:false,
 currentLessonHighlight:true,weekendFade:true,hideUnreadBadge:false,hideProfilePicture:false,hideSideLabels:false,sidebarCompact:false,
 showClock:false,showWeekNumber:false,pageTransitions:true,buttonAnimations:true,homeworkHighlight:true,examHighlight:true,gradeColoring:true,gradeReveal:false,
 aliasEnabled:false,displayAlias:'',customCssEnabled:false,customCss:'',dyslexiaFriendly:false,largerClickTargets:false,underlineLinks:false,
 blurBackgroundPanels:false,monochromeMode:false,devOutline:false,debugInfo:false,lastPreset:'default',denseSettings:false,settingsStickySearch:true,
 settingsSectionNumbers:false,settingsDescriptions:true,highlightToday:true,hideCancelledLessons:false,fadePastLessons:false,showCurrentTimeLine:false,
 emphasizeInsufficientGrades:false,privacyBlurNames:false,privacyBlurSchedule:false,openLinksNewTab:false,confirmExternalLinks:false,
 keyboardShortcuts:true,escapeClosesDialogs:true,reduceVisualNoise:false,dimSecondaryText:false
};
const api={defaults};
api.get=async function(){const saved=await chrome.storage.local.get(defaults);return Object.assign({},defaults,saved)};
api.set=async function(values){if(!values||typeof values!=='object')return;await chrome.storage.local.set(values);window.dispatchEvent(new CustomEvent('stp:settings',{detail:values}))};
api.reset=async function(){await chrome.storage.local.set(defaults);window.dispatchEvent(new CustomEvent('stp:settings',{detail:Object.assign({},defaults)}))};
api.exportSettings=async function(){const data=await api.get();return JSON.stringify({app:'Somtoday PLUS+',version:1,exportedAt:new Date().toISOString(),settings:data},null,2)};
api.importSettings=async function(raw){const parsed=typeof raw==='string'?JSON.parse(raw):raw;if(!parsed||typeof parsed!=='object')throw new Error('Ongeldig bestand');const incoming=parsed.settings||parsed,safe={};Object.keys(defaults).forEach(key=>{if(Object.prototype.hasOwnProperty.call(incoming,key))safe[key]=incoming[key]});await api.set(safe);return safe};
// Backwards compatible aliases for the current settings UI.
api['export']=api.exportSettings;
api['import']=api.importSettings;
window.SomtodayPlusStorage=api;
})();