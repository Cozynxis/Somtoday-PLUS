window.SomtodayPlusStorage={
  defaults:{
    enabled:true,accent:'#1565c0',rounded:true,animations:true,compact:false,
    gradient:false,gradientA:'#e8f3ff',gradientB:'#ffffff',gradientAngle:135,
    glass:false,shadows:true,fontScale:1,cardGap:12,
    focusMode:false,privacyMode:false,selectableText:false,hideScrollbar:false,
    stickyTopbar:false,dimWeekends:false,customTitleEnabled:false,customTitle:'Somtoday',
    quickCommand:true,reduceMotion:false,highContrast:false,
    scheduleAccent:true,softCards:true,sidebarCompact:false
  },
  async get(){return {...this.defaults,...await chrome.storage.local.get(this.defaults)}},
  async set(values){await chrome.storage.local.set(values);window.dispatchEvent(new CustomEvent('stp:settings',{detail:values}))},
  async reset(){await chrome.storage.local.set(this.defaults);window.dispatchEvent(new CustomEvent('stp:settings',{detail:this.defaults}))},
  async export(){const data=await this.get();return JSON.stringify({app:'Somtoday PLUS+',version:1,settings:data},null,2)},
  async import(raw){const parsed=typeof raw==='string'?JSON.parse(raw):raw;if(!parsed||typeof parsed!=='object')throw new Error('Ongeldig bestand');const settings=parsed.settings||parsed;const safe={};for(const key of Object.keys(this.defaults))if(key in settings)safe[key]=settings[key];await this.set(safe);return safe}
};