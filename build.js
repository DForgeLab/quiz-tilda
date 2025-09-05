const fs = require('fs');
const path = require('path');

// Конфигурация файлов для сборки
const config = {
    // Базовый URL для всех относительных ссылок
    // GitHub Raw URL формат: https://raw.githubusercontent.com/USERNAME/REPO/BRANCH/PATH
    baseUrl: 'https://raw.githubusercontent.com/DForgeLab/quiz-tilda/refs/heads/main/dist', // GitHub Raw URL

    // CSS файлы в порядке подключения
    cssFiles: [
        'css/fancybox.css',
        'css/style.css',
        'css/ion.rangeSlider.css',
        'css/swiper-bundle.min.css',
        'css/swiper.css'
    ],

    // JS файлы в порядке подключения
    jsFiles: [
        'js/swiper-bundle.min.js',
        'js/fancybox.js',
        'js/imask.js',
        'js/ion.rangeSlider.min.js',
        'js/nice-select2.js',
        'js/functions.js',
        'js/script.js'
    ],

    // Выходные файлы
    output: {
        html: 'index.html',
        css: 'styles.css',
        js: 'scripts.js'
    }
};

// Функция для чтения файла
function readFile(filename) {
    try {
        return fs.readFileSync(filename, 'utf8');
    } catch (error) {
        console.error(`Ошибка чтения файла ${filename}:`, error.message);
        return '';
    }
}

// Функция для записи файла
function writeFile(filename, content) {
    try {
        fs.writeFileSync(filename, content, 'utf8');
        console.log(`✓ Создан файл: ${filename}`);
    } catch (error) {
        console.error(`Ошибка записи файла ${filename}:`, error.message);
    }
}

// Функция для добавления базового URL к относительным ссылкам
function addBaseUrl(html) {
    if (!config.baseUrl) return html;

    // Убираем слеш в конце baseUrl если есть
    const baseUrl = config.baseUrl.replace(/\/$/, '');

    // Заменяем относительные ссылки на CSS и JS файлы
    let updatedHtml = html
        .replace(/href="([^"]*\.css)"/g, (match, url) => {
            if (url.startsWith('/') || url.startsWith('http')) {
                return match; // Абсолютные ссылки не трогаем
            }
            return `href="${baseUrl}/${url}"`;
        })
        .replace(/src="([^"]*\.js)"/g, (match, url) => {
            if (url.startsWith('/') || url.startsWith('http')) {
                return match; // Абсолютные ссылки не трогаем
            }
            return `src="${baseUrl}/${url}"`;
        })
        .replace(/src="([^"]*\.(jpg|png|svg|gif|webp|jpeg))"/g, (match, url) => {
            if (url.startsWith('/') || url.startsWith('http')) {
                return match; // Абсолютные ссылки не трогаем
            }
            return `src="${baseUrl}/${url}"`;
        });

    return updatedHtml;
}

// Функция для объединения CSS файлов
function combineCSS() {
    console.log('📦 Объединяю CSS файлы...');
    let combinedCSS = '';

    config.cssFiles.forEach(filename => {
        const content = readFile(filename);
        if (content) {
            combinedCSS += `/* ===== ${filename} ===== */\n`;
            combinedCSS += content;
            combinedCSS += '\n\n';
        }
    });

    return combinedCSS;
}

// Функция для объединения JS файлов
function combineJS() {
    console.log('📦 Объединяю JS файлы...');
    let combinedJS = '';

    config.jsFiles.forEach(filename => {
        const content = readFile(filename);
        if (content) {
            combinedJS += `/* ===== ${filename} ===== */\n`;
            combinedJS += content;
            combinedJS += '\n\n';
        }
    });

    return combinedJS;
}

// Функция для создания HTML файла
function createHTML() {
    console.log('📦 Создаю HTML файл...');

    const htmlTemplate = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Квиз</title>
    <link rel="stylesheet" href="${config.output.css}">
</head>
<body>
    <!-- Основной контент квиза -->
    <div class="quiz">
        <div class="row">
            <div class="data">
                <div class="head">
                    <div class="count">
                        <span class="current">1</span> из <span class="total">4</span>
                    </div>
                    <div class="progress">
                        <div style="width: 25%"></div>
                    </div>
                </div>

                <!-- Шаг 1 -->
                <div class="step step1" style="display: block;">
                    <div class="question">Выберите ваш тип телосложения</div>
                    <div class="exp">Это поможет нам подобрать оптимальный размер</div>

                    <div class="swiper">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide">
                                <label>
                                    <input type="radio" name="body_type" value="slim">
                                    <div class="thumb">
                                        <img src="s5-pk.jpg" alt="Худощавое">
                                    </div>
                                    <div class="check">
                                        <svg class="icon" viewBox="0 0 9 9">
                                            <path d="M1 4.5L3.5 7L8 1" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                        </svg>
                                    </div>
                                    <div class="name">Худощавое</div>
                                </label>
                            </div>
                            <div class="swiper-slide">
                                <label>
                                    <input type="radio" name="body_type" value="normal">
                                    <div class="thumb">
                                        <img src="s5-pk.jpg" alt="Нормальное">
                                    </div>
                                    <div class="check">
                                        <svg class="icon" viewBox="0 0 9 9">
                                            <path d="M1 4.5L3.5 7L8 1" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                        </svg>
                                    </div>
                                    <div class="name">Нормальное</div>
                                </label>
                            </div>
                            <div class="swiper-slide">
                                <label>
                                    <input type="radio" name="body_type" value="athletic">
                                    <div class="thumb">
                                        <img src="s5-pk.jpg" alt="Спортивное">
                                    </div>
                                    <div class="check">
                                        <svg class="icon" viewBox="0 0 9 9">
                                            <path d="M1 4.5L3.5 7L8 1" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                        </svg>
                                    </div>
                                    <div class="name">Спортивное</div>
                                </label>
                            </div>
                        </div>
                        <div class="swiper-scrollbar"></div>
                    </div>
                </div>

                <!-- Шаг 2 -->
                <div class="step step2" style="display: none;">
                    <div class="question">Ваш рост</div>
                    <div class="exp">Укажите ваш рост в сантиметрах</div>
                    <div class="range">
                        <input type="text" id="height_range" name="height" value="168">
                    </div>
                </div>

                <!-- Шаг 3 -->
                <div class="step step3" style="display: none;">
                    <div class="question">Ваш вес</div>
                    <div class="exp">Укажите ваш вес в килограммах</div>
                    <div class="range">
                        <input type="text" id="weight_range" name="weight" value="70">
                    </div>
                </div>

                <!-- Шаг 4 -->
                <div class="step step4" style="display: none;">
                    <div class="question">Ваш возраст</div>
                    <div class="exp">Это поможет подобрать подходящий стиль</div>
                    <div class="radios">
                        <label>
                            <input type="radio" name="age" value="18-25">
                            <div>18-25 лет</div>
                        </label>
                        <label>
                            <input type="radio" name="age" value="26-35">
                            <div>26-35 лет</div>
                        </label>
                        <label>
                            <input type="radio" name="age" value="36-45">
                            <div>36-45 лет</div>
                        </label>
                        <label>
                            <input type="radio" name="age" value="46-55">
                            <div>46-55 лет</div>
                        </label>
                        <label>
                            <input type="radio" name="age" value="55+">
                            <div>55+ лет</div>
                        </label>
                    </div>
                </div>

                <!-- Шаг 5 - Форма контактов -->
                <div class="step step5" style="display: none;">
                    <div class="block_head">
                        <div class="title">Получите персональную подборку</div>
                        <div class="desc">Оставьте контакты и мы отправим вам рекомендации</div>
                    </div>

                    <form class="form">
                        <div class="line">
                            <div class="label">Ваше имя</div>
                            <div class="field">
                                <input type="text" class="input" name="name" placeholder="Введите ваше имя" required>
                            </div>
                        </div>

                        <div class="line">
                            <div class="label">Номер телефона</div>
                            <div class="field">
                                <input type="tel" class="input" name="phone" placeholder="+7 (999) 999-99-99" required>
                            </div>
                        </div>

                        <div class="line">
                            <div class="label">Email</div>
                            <div class="field">
                                <input type="email" class="input" name="email" placeholder="your@email.com">
                            </div>
                        </div>

                        <div class="submit">
                            <button type="submit" class="submit_btn">Получить подборку</button>
                            <div class="agree">
                                <label class="checkbox">
                                    <input type="checkbox" name="agree" required>
                                    <div class="check">
                                        <svg class="icon" viewBox="0 0 9 9">
                                            <path d="M1 4.5L3.5 7L8 1" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                        </svg>
                                    </div>
                                    <span>Согласен с <a href="#" target="_blank">условиями обработки данных</a></span>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="btns">
                    <button class="prev_btn disabled">
                        <svg class="icon" viewBox="0 0 10 20">
                            <path d="M8 2L2 10L8 18" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </button>
                    <button class="next_btn">
                        <span>Далее</span>
                        <svg class="icon" viewBox="0 0 10 20">
                            <path d="M2 2L8 10L2 18" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="col_right">
                <div class="manager">
                    <div class="photo">
                        <img src="manager.jpg" alt="Менеджер">
                    </div>
                    <div>
                        <div class="name">Анна Смирнова</div>
                        <div class="post">Стилист-консультант</div>
                        <div class="text">Помогу подобрать идеальный размер и стиль для вас</div>
                    </div>
                </div>

                <div class="contacts">
                    <div class="phone">
                        <a href="tel:+79991234567">+7 (999) 123-45-67</a>
                    </div>
                    <div class="consult_btn">Консультация</div>
                    <div class="messengers">
                        <a href="#" class="messenger">
                            <svg class="icon" viewBox="0 0 18 18">
                                <path d="M9 0C4.03 0 0 3.8 0 8.5c0 2.7 1.4 5.1 3.6 6.7L2.5 18l3.2-.8c.9.2 1.8.3 2.8.3 4.97 0 9-3.8 9-8.5S13.97 0 9 0z"/>
                            </svg>
                        </a>
                        <a href="#" class="messenger">
                            <svg class="icon" viewBox="0 0 18 18">
                                <path d="M9 0C4.03 0 0 3.8 0 8.5c0 2.7 1.4 5.1 3.6 6.7L2.5 18l3.2-.8c.9.2 1.8.3 2.8.3 4.97 0 9-3.8 9-8.5S13.97 0 9 0z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <div class="what_we_give">
                    <a href="#" class="btn">
                        <svg class="icon" viewBox="0 0 16 11">
                            <path d="M1 5.5L6 10L15 1" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                        <span>Что вы получите</span>
                        <img src="s5-pk.jpg" alt="Подарок">
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Модальное окно успеха -->
    <div id="success_modal" class="modal" style="display: none;">
        <div class="block_head">
            <div class="title">Спасибо!</div>
            <div class="desc">Ваша заявка принята. Мы свяжемся с вами в ближайшее время.</div>
        </div>
        <div class="image">
            <img src="s5-pk.jpg" alt="Успех">
        </div>
        <button class="close_btn">Закрыть</button>
    </div>

    <script src="${config.output.js}"></script>
</body>
</html>`;

    return htmlTemplate;
}

// Основная функция сборки
function build() {
    console.log('🚀 Начинаю сборку проекта...\n');

    // Создаем выходную директорию если её нет
    const outputDir = 'dist';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Объединяем CSS
    const combinedCSS = combineCSS();
    writeFile(path.join(outputDir, config.output.css), combinedCSS);

    // Объединяем JS
    const combinedJS = combineJS();
    writeFile(path.join(outputDir, config.output.js), combinedJS);

    // Копируем HTML и добавляем базовый URL
    const htmlContent = readFile('index.html');
    if (htmlContent) {
        const updatedHtml = addBaseUrl(htmlContent);
        writeFile(path.join(outputDir, config.output.html), updatedHtml);
        console.log('✓ Скопирован HTML файл с базовым URL');
    } else {
        console.error('❌ Исходный index.html не найден!');
    }

    // Копируем папку с изображениями
    const imgDir = 'img';
    const outputImgDir = path.join(outputDir, 'img');

    if (fs.existsSync(imgDir)) {
        // Создаем папку img в dist
        if (!fs.existsSync(outputImgDir)) {
            fs.mkdirSync(outputImgDir);
        }

        // Копируем все файлы из папки img
        const imgFiles = fs.readdirSync(imgDir);
        imgFiles.forEach(file => {
            const srcPath = path.join(imgDir, file);
            const destPath = path.join(outputImgDir, file);
            fs.copyFileSync(srcPath, destPath);
            console.log(`✓ Скопирован файл: img/${file}`);
        });
    } else {
        console.error('❌ Папка img не найдена!');
    }

    console.log('\n✅ Сборка завершена!');
    console.log(`📁 Файлы созданы в папке: ${outputDir}/`);
    console.log(`📄 HTML: ${config.output.html}`);
    console.log(`🎨 CSS: ${config.output.css}`);
    console.log(`⚡ JS: ${config.output.js}`);
    if (config.baseUrl) {
        console.log(`🌐 Базовый URL: ${config.baseUrl}`);
    }
    console.log('\n💡 Теперь вы можете загрузить эти файлы в Тильду!');
}

// Запускаем сборку
build();
