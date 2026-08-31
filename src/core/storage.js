window.SomtodayPlusStorage={
 defaults:{
  enabled:true,accent:'#1565c0',rounded:true,animations:true,compact:false,softCards:true,shadows:true,glass:false,
  gradient:false,gradientA:'#e8f3ff',gradientB:'#ffffff',gradientAngle:135,fontScale:1,fontFamily:'system',cardGap:12,menuDensity:'normal',
  focusMode:false,privacyMode:false,privacyHoverReveal:true,selectableText:false,hideScrollbar:false,stickyTopbar:false,dimWeekends:false,
  customTitleEnabled:false,customTitle:'Somtoday',quickCommand:true,reduceMotion:false,highContrast:false,scheduleAccent:true,scheduleCompact:false,
  currentLessonHighlight:true,weekendFade:true,hideUnreadBadge:false,hideProfilePicture:false,hideSideLabels:false,sidebarCompact:false,
  showClock:false,showWeekNumber:false,pageTransitions:true,buttonAnimations:true,homeworkHighlight:true,examHighlight:true,gradeColoring:true,gradeReveal:false,
  aliasEnabled:false,displayAlias:'',customCssEnabled:false,customCss:'',dyslexiaFriendly:false,largerClickTargets:false,underlineLinks:false,
  blurBackgroundPanels:false,monochromeMode:false,devOutline:false,debugInfo:false,lastPreset:'default',
  denseSettings:false,settingsStickySearch:true,settingsSectionNumbers:false,settingsDescriptions:true,
  highlightToday:true,hideCancelledLessons:false,fadePastLessons:false,showCurrentTimeLine:false,
  emphasizeInsufficientGrades:false,privacyBlurNames:false,privacyBlurSchedule:false,
  openLinksNewTab:false,confirmExternalLinks:false,keyboardShortcuts:true,escapeClosesDialogs:true,
  reduceVisualNoise:false,dimSecondaryText:false
 },
 async get(){return {...this.defaults,...await chrome.storage.local.get(this.defaults)}},
 async set(values){await chrome.storage.local.set(values);window.dispatchEvent(new CustomEvent('stp:settings',{detail:values}))},
 async reset(){await chrome.storage.local.set(this.defaults);window.dispatchEvent(new CustomEvent('stp:settings',{detail:this.defaults}))},
 async export(){const data=await this.get();return JSON.stringify({app:'Somtoday PLUS+',version:1,exportedAt:new Date().toISOString(),settings:data},null,2)},
 async import(raw){const parsed=typeof raw==='string'?JSON.parse(raw):raw;if(!parsed||typeof parsed!=='object')throw new Error('Ongeldig bestand');const settings=parsed.settings||parsed,safe={};for(const key of Object.keys(this.defaults))if(key in settings)safe[key]=settings[key];await this.set(safe);return safe}
};