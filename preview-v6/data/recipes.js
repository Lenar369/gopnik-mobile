// Данные игры «Гопник: Казань 1998» — Рецепты крафта: need — что нужно {id: штук}, min — минут, st — где (any везде / home дома), tool — нужный инструмент, out — что получится.
// Файл подключается до основного скрипта index.html. Значения можно менять; новые предметы/места добавлять по образцу.
(function(){
const GD=window.GD=window.GD||{};
GD.RECIPES=[
 {cat:'Тепло',id:'campfire',need:{planks:2,paper:1,matches:1},min:15,st:'any',out:'campfire'},
 {cat:'Тепло',id:'hot_bottle',need:{bottle:1},min:10,st:'home',out:'hot_bottle'},
 {cat:'Тепло',id:'paper_lining',need:{paper:2},min:5,st:'any',out:'paper_lining'},
 {cat:'Тепло',id:'torch',need:{planks:1,rags:1,spirit:1},min:10,st:'any',out:'torch'},
 {cat:'Одежда',id:'wool_hat',need:{wool:1},min:40,st:'home',out:'wool_hat'},
 {cat:'Одежда',id:'mittens',need:{wool:1,rags:1},min:40,st:'home',out:'mittens'},
 {cat:'Одежда',id:'blanket_vest',need:{cloth:1,rope:1},min:50,st:'home',tool:'shiv',out:'blanket_vest'},
 {cat:'Одежда',id:'wrapped_boots',need:{rags:2,plastic:1,tape:1},min:25,st:'any',out:'wrapped_boots'},
 {cat:'Еда и лечение',id:'bandage',need:{rags:2},min:10,st:'any',out:'bandage'},
 {cat:'Еда и лечение',id:'compress',need:{spirit:1,rags:1},min:10,st:'any',out:'compress'},
 {cat:'Еда и лечение',id:'herbal_tea',need:{herbs:1,drink_water:1},min:15,st:'home',out:'herbal_tea'},
 {cat:'Еда и лечение',id:'baked_potato',need:{food_potato:1,planks:1,matches:1},min:30,st:'any',out:'baked_potato'},
 {cat:'Еда и лечение',id:'stew_soup',need:{food_stew:1,food_potato:1,drink_water:1},min:40,st:'home',out:'stew_soup'},
 {cat:'Еда и лечение',id:'rusks',need:{food_bread:1},min:30,st:'home',out:'rusks',n:2},
 {cat:'Оружие',id:'shiv',need:{scrap:1,tape:1},min:30,st:'any',out:'shiv'},
 {cat:'Оружие',id:'pipe_club',need:{pipe:1,tape:1},min:15,st:'any',out:'pipe_club'},
 {cat:'Оружие',id:'nail_bat',need:{planks:1,nails:3},min:30,st:'home',base:'workbench',out:'nail_bat'},
 {cat:'Снаряжение',id:'crowbar',need:{pipe:1,scrap:1},min:45,st:'home',tool:'wrench',out:'crowbar'},
 {cat:'Снаряжение',id:'flashlight',need:{battery:2,can:1,wire:1,glass:1},min:40,st:'home',out:'flashlight'},
 {cat:'Снаряжение',id:'sack',need:{plastic:2,rope:1},min:20,st:'any',out:'sack'},
 {cat:'Снаряжение',id:'home_backpack',need:{cloth:1,leather:1,rope:2},min:90,st:'home',tool:'shiv',out:'home_backpack'},
 {cat:'Снаряжение',id:'sled',need:{planks:3,nails:2,rope:1},min:60,st:'home',base:'workbench',out:'sled'},
 {cat:'Дом',id:'workbench',need:{planks:4,nails:3},min:90,st:'home',build:'workbench',title:'Верстак',icon:'🪚',desc:'Крафт дома вдвое быстрее; открывает биту и санки'},
 {cat:'Дом',id:'heater',need:{spiral:1,brick:2,wire:1},min:60,st:'home',build:'heater',title:'Обогреватель',icon:'♨️',art:'warm_heater',desc:'Дома теплее: сон лечит простуду за ночь, нервы +',art:'warm_heater'},
 {cat:'Дом',id:'windows',need:{plastic:2,tape:1,paper:2},min:45,st:'home',build:'windows',title:'Утеплённые окна',icon:'🪟',desc:'Сон восстанавливает больше бодрости'},
 {cat:'Дом',id:'radio',need:{wire:2,can:1,battery:1},min:40,st:'home',build:'radio',title:'Антенна для приёмника',icon:'📻',desc:'Новости по утрам: нервы +5 после сна'},
 {cat:'Дом',id:'woodpile',need:{planks:3,coal:2},min:30,st:'home',build:'woodpile',title:'Запас топлива',icon:'🪵',desc:'«Чай у плиты» греет сильнее'},
];
})();
