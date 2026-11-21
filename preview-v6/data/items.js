// Данные игры «Гопник: Казань 1998» — Предметы: хабар (MAT: name, icon, w — вес кг, p — цена у скупщика), расходники (SUP: cost — цена, fx — эффекты: food, warmth, energy, nerves, hp), вещи (goods: slot — куда надевается, cost, stat — подпись).
// Файл подключается до основного скрипта index.html. Значения можно менять; новые предметы/места добавлять по образцу.
(function(){
const GD=window.GD=window.GD||{};
GD.MAT={
 rags:{name:'Тряпки',icon:'🩳',w:.3,p:1},planks:{name:'Доски',icon:'🪵',w:1.5,p:2},nails:{name:'Гвозди',icon:'📌',w:.2,p:2},
 wire:{name:'Проволока',icon:'➰',w:.3,p:2},bottle:{name:'Пустая бутылка',icon:'🍾',w:.4,p:1},can:{name:'Жестяная банка',icon:'🥫',w:.1,p:1},
 pipe:{name:'Обрезок трубы',icon:'📏',w:1.2,p:3},scrap:{name:'Металлолом',icon:'⚙️',w:2,p:4},rope:{name:'Верёвка',icon:'🪢',w:.3,p:2},
 tape:{name:'Изолента',icon:'📼',w:.1,p:3},cloth:{name:'Старое одеяло',icon:'🛏️',w:1,p:3},wool:{name:'Старый свитер',icon:'🧶',w:.6,p:3},
 paper:{name:'Газеты',icon:'📰',w:.2,p:1},coal:{name:'Уголь',icon:'⚫',w:1,p:2},brick:{name:'Кирпич',icon:'🧱',w:2,p:1},
 spiral:{name:'Спираль от плитки',icon:'🌀',w:.2,p:5},battery:{name:'Батарейка',icon:'🔋',w:.1,p:3},glass:{name:'Стекло',icon:'🪟',w:.3,p:1},
 leather:{name:'Кусок кожи',icon:'👜',w:.4,p:4},plastic:{name:'Плёнка',icon:'🛍️',w:.2,p:1},spirit:{name:'Спирт',icon:'🧪',w:.5,p:6},
 herbs:{name:'Сушёные травы',icon:'🌿',w:.1,p:2},matches:{name:'Спички',icon:'🔥',w:.05,p:2,art:'warm_matches'}
};
GD.SUP={
 food_bread:{name:'Хлеб',icon:'🍞',cost:3,fx:{food:20}},
 food_sausage:{name:'Колбаса варёная',icon:'🌭',cost:15,fx:{food:30,nerves:3}},
 food_stew:{name:'Тушёнка',icon:'🥫',cost:12,fx:{food:40}},
 food_noodles:{name:'Лапша быстрая',icon:'🍜',cost:5,fx:{food:25,warmth:5}},
 food_potato:{name:'Картошка',icon:'🥔',cost:6,fx:{food:30}},
 food_pasta:{name:'Макароны',icon:'🍝',cost:7,fx:{food:35}},
 food_pickles:{name:'Солёные огурцы',icon:'🥒',cost:10,fx:{food:12,nerves:5}},
 food_sprats:{name:'Шпроты',icon:'🐟',cost:9,fx:{food:25}},
 drink_water:{name:'Вода',icon:'💧',cost:4,fx:{food:2,energy:5}},
 drink_tea:{name:'Чай',icon:'🫖',cost:6,fx:{warmth:15,energy:15,nerves:5}},
 drink_beer:{name:'Пиво',icon:'🍺',cost:8,fx:{food:5,nerves:15,energy:-5}},
 drink_vodka:{name:'Водка',icon:'🍾',cost:25,fx:{warmth:25,nerves:25,hp:-5},risky:true},
 cigs:{name:'Сигареты',icon:'🚬',cost:6,fx:{nerves:20,hp:-1}},
 med_pills:{name:'Аспирин',icon:'💊',cost:12,fx:{hp:5},cure:true},
 med_cough:{name:'Микстура',icon:'🧴',cost:15,fx:{warmth:5},cure:true},
 med_iodine:{name:'Йод',icon:'🟤',cost:5,fx:{hp:8}},
 med_kit:{name:'Аптечка',icon:'🧰',cost:60,fx:{hp:50},cure:true},
 bandage:{name:'Бинт',icon:'🩹',cost:20,fx:{hp:20}}
};
GD.goods={hat:{name:'Кепка',slot:'Голова',cost:30,stat:'тепло +10%'},sneak:{name:'Кроссовки',slot:'Обувь',cost:60,stat:'удобная обувь'},coat:{name:'Кожанка',slot:'Верх',cost:100,stat:'тепло +25%'},glasses:{name:'Очки',slot:'Аксессуар',cost:40,stat:'солидный вид'},wrench:{name:'Гаечный ключ',slot:'Инструмент',cost:55,stat:'пригодится в гараже'},bandage:{name:'Бинт',slot:null,cost:20,stat:'+20 HP'}};
})();
