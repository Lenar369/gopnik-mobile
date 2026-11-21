// Музыка игры: список треков. zone — где играет: 'city' — в городе (районы, карта города), 'out' — за городом (окраины).
// В одной зоне треки идут по очереди в случайном порядке (один и тот же два раза подряд не повторяется).
// Новый трек: положить mp3 в art/music/ (или kazan/assets/audio/) и добавить строку {title, src, zone}. Путь — от папки preview-v6.
(function(){
const GD=window.GD=window.GD||{};
GD.MUSIC=[
 {title:'Ритм района',src:'../kazan/assets/audio/Gopnik_Kazan_1998_Ritm_Rayona.mp3',zone:'city'},
 {title:'Пацаны нашего двора',src:'../kazan/assets/audio/Gopnik_Patsany_Nashego_Dvora.mp3',zone:'out'}
];
})();
