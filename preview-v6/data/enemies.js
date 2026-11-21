// Данные игры «Гопник: Казань 1998» — Противники: n — сколько их, hp, dmg [мин, макс], acc — меткость, talk/pay — можно договориться/откупиться, xp, loot — что выпадает.
// Файл подключается до основного скрипта index.html. Значения можно менять; новые предметы/места добавлять по образцу.
(function(){
const GD=window.GD=window.GD||{};
GD.ENEMY={
 shpana:{name:'Шпана',icon:'🧢',n:1,hp:40,dmg:[4,8],acc:.7,talk:2,pay:15,run:.65,xp:20,resp:2,loot:{money:[5,20],items:{cigs:2,food_bread:1}},style:[.3,.5,.2]},
 drunk:{name:'Пьяный мужик',icon:'🍾',n:1,hp:35,dmg:[5,11],acc:.5,talk:1,pay:10,run:.8,xp:15,resp:1,loot:{money:[3,15],items:{drink_vodka:2,cigs:1}},style:[.2,.4,.4]},
 gop3:{name:'Компания гопников',icon:'🚬',n:3,hp:30,dmg:[3,7],acc:.65,talk:3,pay:30,run:.5,xp:45,resp:5,loot:{money:[15,45],items:{cigs:2,drink_beer:2}},style:[.4,.4,.2]},
 dogs:{name:'Стая собак',icon:'🐕',n:2,hp:22,dmg:[4,9],acc:.75,talk:0,pay:0,run:.4,xp:25,resp:1,loot:{money:[0,0],items:{}},style:[.6,.3,.1],bite:true},
 watchman:{name:'Сторож',icon:'🔦',n:1,hp:50,dmg:[6,11],acc:.6,talk:2,pay:20,run:.7,xp:25,resp:0,loot:{money:[10,30],items:{drink_tea:1,food_bread:1}},style:[.2,.6,.2]},
 bum:{name:'Бродяга',icon:'🧥',n:1,hp:28,dmg:[3,7],acc:.55,talk:1,pay:5,run:.8,xp:12,resp:0,loot:{money:[0,8],mats:{rags:2,bottle:2,can:1,matches:1}},style:[.3,.4,.3]},
 bratki:{name:'Братки',icon:'🕶️',n:2,hp:60,dmg:[10,17],acc:.75,talk:5,pay:80,run:.35,xp:90,resp:10,loot:{money:[60,120],items:{cigs:2,drink_vodka:1}},style:[.3,.3,.4]}
};
})();
