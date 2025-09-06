const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Конфигурация
const config = {
    // Папки для наблюдения
    watchDirs: ['js', 'css', 'img'],
    // Файлы для наблюдения
    watchFiles: ['index.html', 'build.js'],
    // Команда для пересборки (локальная разработка)
    buildCommand: 'node build.js --base-url=',
    // Задержка перед пересборкой (в миллисекундах)
    debounceDelay: 1000
};

let buildTimeout = null;
let isBuilding = false;

// Функция для выполнения сборки
function runBuild() {
    if (isBuilding) {
        console.log('⏳ Сборка уже выполняется, пропускаем...');
        return;
    }

    isBuilding = true;

    exec(config.buildCommand, (error, stdout, stderr) => {
        isBuilding = false;

        if (error) {
            console.error('❌ Ошибка сборки:', error.message);
            return;
        }

        if (stderr) {
            console.error('⚠️ Предупреждения:', stderr);
        }
    });
}

// Функция для отложенной сборки (debounce)
function scheduleBuild() {
    if (buildTimeout) {
        clearTimeout(buildTimeout);
    }

    buildTimeout = setTimeout(() => {
        runBuild();
    }, config.debounceDelay);
}

// Функция для наблюдения за папкой
function watchDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.log(`⚠️ Папка ${dirPath} не найдена, пропускаем...`);
        return;
    }

    console.log(`👀 Наблюдаю за папкой: ${dirPath}/`);

    fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
        if (filename) {
            console.log(`📝 Изменение в ${dirPath}/${filename} (${eventType})`);
            scheduleBuild();
        }
    });
}

// Функция для наблюдения за файлом
function watchFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️ Файл ${filePath} не найден, пропускаем...`);
        return;
    }

    console.log(`👀 Наблюдаю за файлом: ${filePath}`);

    fs.watchFile(filePath, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
            console.log(`📝 Изменение в файле: ${filePath}, запускаю пересборку...`);
            scheduleBuild();
        }
    });
}

// Основная функция
function startWatching() {
    console.log('🚀 Запускаю файловый наблюдатель...\n');

    // Наблюдаем за папками
    config.watchDirs.forEach(dir => {
        watchDirectory(dir);
    });

    // Наблюдаем за файлами
    config.watchFiles.forEach(file => {
        watchFile(file);
    });

    console.log('\n✅ Наблюдение запущено!');
    console.log('🏠 Режим: ЛОКАЛЬНАЯ РАЗРАБОТКА');
    console.log('📁 Отслеживаемые папки:', config.watchDirs.join(', '));
    console.log('📄 Отслеживаемые файлы:', config.watchFiles.join(', '));
    console.log(`⏱️ Задержка пересборки: ${config.debounceDelay}ms`);
    console.log('\n💡 Измените любой файл в отслеживаемых папках для автоматической пересборки');
    console.log('🛑 Нажмите Ctrl+C для остановки\n');

    // Выполняем первоначальную сборку
    runBuild();
}

// Обработка сигнала завершения
process.on('SIGINT', () => {
    console.log('\n\n🛑 Остановка файлового наблюдателя...');
    process.exit(0);
});

// Запускаем наблюдение
startWatching();
