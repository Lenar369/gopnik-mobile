// Музыка игры: список треков. Играют по очереди в случайном порядке (один и тот же два раза подряд не повторяется).
// Новый трек: положить mp3 в art/music/ (или kazan/assets/audio/) и добавить строку {title, src}. Путь — от папки preview-v6.
(function(){
const GD=window.GD=window.GD||{};
GD.MUSIC=[
 {title:'Пацаны нашего двора',src:'../kazan/assets/audio/Gopnik_Patsany_Nashego_Dvora.mp3'}
];
})();
