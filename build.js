const fs = require('fs');
const path = require('path');

// Получаем базовый URL из аргументов командной строки
const args = process.argv.slice(2);
const baseUrlArg = args.find(arg => arg.startsWith('--base-url='));
const baseUrl = baseUrlArg ? baseUrlArg.split('=')[1] : 'https://dforgelab.github.io/quiz-tilda';

// Конфигурация файлов для сборки
const config = {
    // Базовый URL для всех относительных ссылок
    // GitHub Raw URL формат: https://raw.githubusercontent.com/USERNAME/REPO/BRANCH/PATH
    baseUrl: baseUrl,

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
        'js/jquery-3.7.1.min.js',
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
        // JS файлы копируются отдельно
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

// Функция для рекурсивного копирования папки
function copyDirRecursive(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);
    files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            copyDirRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

// Функция для добавления базового URL к относительным ссылкам
function addBaseUrl(html) {
    if (!config.baseUrl) return html;

    // Убираем слеш в конце baseUrl если есть
    const baseUrl = config.baseUrl.replace(/\/$/, '');

    // Заменяем относительные ссылки на CSS и JS файлы
    let updatedHtml = html
        .replace(/href="([^"]*\.css)"/g, (match, url) => {
            if (url.startsWith('/') || url.startsWith('http') || url.startsWith('#')) {
                return match; // Абсолютные ссылки не трогаем
            }
            return `href="${baseUrl}/${url}"`;
        })
        .replace(/src="([^"]*\.js)"/g, (match, url) => {
            if (url.startsWith('/') || url.startsWith('http') || url.startsWith('#')) {
                return match; // Абсолютные ссылки не трогаем
            }
            return `src="${baseUrl}/${url}"`;
        })
        .replace(/src="([^"]*\.(jpg|png|svg|gif|webp|jpeg))"/g, (match, url) => {
            if (url.startsWith('/') || url.startsWith('http') || url.startsWith('#')) {
                return match; // Абсолютные ссылки не трогаем
            }
            return `src="${baseUrl}/${url}"`;
        })
        .replace(/xlink:href="([^"]*\.svg[^"]*)"/g, (match, url) => {
            if (url.startsWith('/') || url.startsWith('http') || url.startsWith('#')) {
                return match; // Абсолютные ссылки не трогаем
            }
            return `xlink:href="${baseUrl}/${url}"`;
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

// Функция для копирования JS файлов отдельно
function copyJSFiles() {
    console.log('📦 Копирую JS файлы...');

    // Создаем папку js в dist
    const jsDir = path.join('dist', 'js');
    if (!fs.existsSync(jsDir)) {
        fs.mkdirSync(jsDir, { recursive: true });
    }

    config.jsFiles.forEach(filename => {
        const content = readFile(filename);
        if (content) {
            const outputPath = path.join(jsDir, path.basename(filename));
            writeFile(outputPath, content);
            console.log(`✓ Скопирован файл: ${filename}`);
        }
    });
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

    // Копируем JS файлы отдельно
    copyJSFiles();

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

        // Копируем все файлы и папки из папки img
        const imgFiles = fs.readdirSync(imgDir);
        imgFiles.forEach(file => {
            const srcPath = path.join(imgDir, file);
            const destPath = path.join(outputImgDir, file);
            const stat = fs.statSync(srcPath);

            if (stat.isDirectory()) {
                // Копируем папку рекурсивно
                copyDirRecursive(srcPath, destPath);
                console.log(`✓ Скопирована папка: img/${file}/`);
            } else {
                // Копируем файл
                fs.copyFileSync(srcPath, destPath);
                console.log(`✓ Скопирован файл: img/${file}`);
            }
        });
    } else {
        console.error('❌ Папка img не найдена!');
    }

    console.log('\n✅ Сборка завершена!');
    console.log(`📁 Файлы созданы в папке: ${outputDir}/`);
    console.log(`📄 HTML: ${config.output.html}`);
    console.log(`🎨 CSS: ${config.output.css}`);
    console.log(`⚡ JS: отдельные файлы в папке js/`);
    if (config.baseUrl) {
        console.log(`🌐 Базовый URL: ${config.baseUrl}`);
        console.log('🚀 Режим: ПРОДАКШН (GitHub Pages)');
    } else {
        console.log('🏠 Режим: ЛОКАЛЬНАЯ РАЗРАБОТКА');
        console.log('🌐 Базовый URL: не установлен (относительные ссылки)');
    }
    console.log('\n💡 Теперь вы можете загрузить эти файлы в Тильду!');
}

// Запускаем сборку
build();
