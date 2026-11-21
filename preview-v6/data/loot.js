// Данные игры «Гопник: Казань 1998» — Места обыска. LOOT: at — id места в районе, t — что можно найти {id: вес (чем больше, тем чаще)}, cold — на холоде. WILD — места на карте города: name, icon, xy (мировые координаты), desc, t.
// Файл подключается до основного скрипта index.html. Значения можно менять; новые предметы/места добавлять по образцу.
(function(){
const GD=window.GD=window.GD||{};
GD.LOOT={
 q5_basement:{at:'house12',name:'Подвал дома №12',t:{pipe:3,rags:3,bottle:3,can:2,wire:2,coal:2,food_potato:1,spirit:1}},
 q5_attic:{at:'home',name:'Чердак своего дома',t:{cloth:2,wool:3,paper:3,rope:2,leather:1,battery:1,glass:1}},
 q5_dumpster:{at:'kiosk',name:'Мусорные баки за киоском',t:{bottle:4,can:4,paper:3,rags:2,plastic:3,food_bread:1,cigs:1}},
 city_rooftop:{at:'court',name:'Крыша девятиэтажки',t:{wire:4,glass:2,battery:2,plastic:2,tape:1},cold:true},
 market_backrows:{at:'m_side',name:'Пустые задние ряды',t:{plastic:4,rope:3,rags:2,can:2,herbs:3,matches:1}},
 market_crates:{at:'m_depot',name:'Склад тары',t:{planks:5,nails:3,rope:2,plastic:2}},
 station_warehouse:{at:'s_platform',name:'Заброшенный пакгауз',t:{planks:4,nails:2,rope:2,coal:3,scrap:2}},
 station_wagons:{at:'s_platform',name:'Тупик с вагонами',t:{coal:4,scrap:3,planks:2,cloth:1,spirit:1},cold:true},
 factory_hall:{at:'f_repair',name:'Заброшенный цех',t:{scrap:4,wire:3,spiral:2,pipe:2,tape:2,spirit:1}},
 factory_scrap:{at:'f_warehouse',name:'Свалка металлолома',t:{scrap:5,pipe:3,wire:2,battery:1,brick:2},cold:true},
 factory_boiler:{at:'f_boiler',name:'Котельная',t:{coal:4,pipe:2,brick:3,spiral:1,tape:1}},
 garage_junkyard:{at:'g_scrap',name:'Разборка',t:{scrap:4,battery:2,glass:3,wire:2,leather:2,plastic:1},cold:true},
 garage_abandoned:{at:'g_park',name:'Ничейный гараж',t:{tape:2,nails:2,spirit:2,rope:2,battery:1,glass:1,food_stew:1}},
 river_boathouse:{at:'w_boat',name:'Лодочный сарай',t:{rope:4,planks:3,plastic:2,cloth:2,matches:1}},
 river_flooded:{at:'w_warehouse',name:'Полузатопленный склад',t:{planks:3,can:3,bottle:2,cloth:2,food_stew:1,drink_water:1}},
 center_construction:{at:'c_square',name:'Долгострой',t:{brick:4,planks:3,nails:3,wire:2,pipe:2,plastic:2},cold:true},
 center_archive_yard:{at:'c_archive',name:'Двор архива',t:{paper:5,cloth:2,planks:2,glass:2,leather:1}}
};
GD.WILD={
 heat:{name:'Теплотрасса за гаражами',icon:'♨️',xy:[880,800],warm:true,fb:'./maps/factory.webp',desc:'Трубы в драной стекловате, от них идёт тепло. Здесь греются бродяги и прячут всякое.',t:{pipe:3,rags:3,bottle:2,can:2,wool:1,matches:1,cigs:1}},
 sector:{name:'Брошенный дом в частном секторе',icon:'🏚️',xy:[1290,560],fb:'../art/loot/q5_attic.webp',desc:'Покосившийся дом за забором, хозяева давно уехали. Чердак и сарай не заперты.',t:{cloth:3,wool:2,planks:3,nails:2,glass:1,food_potato:2,herbs:2}},
 dachas:{name:'Дачный посёлок',icon:'🏡',xy:[1420,820],desc:'Зимой здесь никого. Летом — сторож и собаки. В сараях — инструмент и заготовки.',t:{planks:3,rope:2,food_potato:3,food_pickles:1,herbs:3,nails:2,tape:1}},
 camp:{name:'Заброшенный пионерлагерь',icon:'⛺',xy:[330,50],desc:'Облупленные корпуса в лесу, столовая без окон, медпункт с выбитой дверью.',t:{cloth:3,planks:2,glass:2,paper:2,med_pills:1,bandage:1,wool:1}},
 dump:{name:'Городская свалка',icon:'🗑️',xy:[120,950],fb:'./maps/garage.webp',desc:'Горы мусора до горизонта, вороньё и дым. Найти можно что угодно — и нарваться тоже.',t:{scrap:4,bottle:3,can:4,plastic:3,battery:2,wire:2,leather:1,glass:2}},
 bank:{name:'Насыпь у Волги',icon:'🌊',xy:[520,660],fb:'./maps/river.webp',desc:'Железнодорожная насыпь над водой: выброшенные шпалы, обрывки сетей, перевёрнутые лодки.',t:{planks:3,rope:3,coal:2,plastic:2,scrap:1,matches:1}},
 hospital:{name:'Долгострой больницы',icon:'🏗️',xy:[1335,195],fb:'./maps/center.webp',desc:'Бетонный каркас в девять этажей. Строители бросили всё в 1991-м.',t:{brick:4,wire:3,pipe:2,nails:3,plastic:2,spiral:1,tape:1}},
 cellar:{name:'Подвал старой пятиэтажки',icon:'🧱',xy:[830,560],fb:'../art/loot/q5_basement.webp',warm:true,desc:'Тёплый подвал: трубы отопления, сухо даже зимой. Ящики, старые вещи жильцов, а иногда чьи-то заначки.',t:{pipe:2,rags:3,cloth:2,can:2,food_stew:1,food_potato:2,drink_water:1,rope:1,spirit:1}}
};
})();
