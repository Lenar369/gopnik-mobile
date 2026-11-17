# gopnik-mobile — правила для ИИ-помощников

Концепция и все договорённости: [GAME_DESIGN_DECISIONS.md](GAME_DESIGN_DECISIONS.md). Режим выживания: [SURVIVAL_DESIGN.md](SURVIVAL_DESIGN.md).

## Правила
- Графику не рисуем сами: пишем ТЗ в `art/REQUEST_XX_*.md` и пушим в GitHub; ChatGPT рисует, согласует с пользователем и кладёт готовые файлы в `art/`. Мы подключаем готовое в игру.
- Старые сборки (`kazan/`, `preview-v1`…`preview-v5`) не менять; новое — в новой папке `preview-vN`.
- Код игры меняем только по явному разрешению пользователя; дизайн фиксируем в GAME_DESIGN_DECISIONS.md.
