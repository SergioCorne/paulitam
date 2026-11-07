'use strict';
PrivateCards.init();UniverseUI.init();
window.addEventListener('hashchange',()=>{if(location.hash==='#moderacion')CommunityUI.open('moderation');else PrivateCards.hashRoute();});
if(location.hash==='#moderacion')CommunityUI.open('moderation');else PrivateCards.hashRoute();
