// Данные игры «Гопник: Казань 1998» — Продукты: SURV_SHOPS — какое место что продаёт (items — id из SUP), SURV_MEALS — горячая еда в кафе/столовых: cost, fx.
// Файл подключается до основного скрипта index.html. Значения можно менять; новые предметы/места добавлять по образцу.
(function(){
const GD=window.GD=window.GD||{};
GD.SURV_SHOPS={
 kiosk:{title:'Киоск: продукты',items:['food_bread','food_sausage','food_noodles','food_pasta','food_sprats','drink_water','drink_tea','drink_beer','drink_vodka','cigs','bandage']},
 m_rows:{title:'Ряды: продукты',items:['food_bread','food_potato','food_pasta','food_pickles','food_sausage','food_stew','drink_tea','cigs']},
 s_station:{title:'Ларёк у вокзала',items:['food_bread','food_noodles','drink_water','drink_beer','cigs']},
 f_warehouse:{title:'Склад: тушёнка по-тихому',items:['food_stew','food_potato']},
 g_gas:{title:'Ларёк на заправке',items:['food_noodles','drink_water','drink_tea','cigs']},
 w_fish:{title:'Рыбный ряд',items:['food_sprats','food_potato','food_bread']},
 c_shop:{title:'Универмаг: продукты',items:['food_bread','food_sausage','food_stew','food_noodles','drink_tea','drink_water']},
 c_med:{title:'Аптечный пункт',items:['med_pills','med_cough','med_iodine','bandage','med_kit']}
};
GD.SURV_MEALS={
 m_cafe:{name:'Пирожки с чаем',cost:12,fx:{food:35,warmth:15,energy:5}},
 s_cafe:{name:'Сосиски с пюре',cost:14,fx:{food:40,warmth:10}},
 f_canteen:{name:'Комплексный обед',cost:10,fx:{food:50,warmth:10}},
 w_cafe:{name:'Уха',cost:14,fx:{food:40,warmth:25}},
 c_cafe:{name:'Пельмени',cost:18,fx:{food:50,warmth:20,nerves:5}}
};
})();
