require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Проверка наличия необходимых переменных окружения
if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.error('Ошибка: Отсутствуют необходимые переменные окружения TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID');
    process.exit(1);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Инициализация бота
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// Валидация данных формы
function validateFormData(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Имя должно содержать минимум 2 символа');
    }
    
    if (!data.phone || !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(data.phone)) {
        errors.push('Неверный формат телефона');
    }
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Неверный формат email');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Сообщение должно содержать минимум 10 символов');
    }
    
    return errors;
}

// Обработка заявок
app.post('/api/submit-form', async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;

        // Валидация данных
        const errors = validateFormData(req.body);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Ошибка валидации',
                errors: errors
            });
        }

        // Формируем сообщение для Telegram
        const telegramMessage = `
🔔 Новая заявка с сайта Apple House!

👤 Имя: ${name}
📱 Телефон: ${phone}
📧 Email: ${email}
💬 Сообщение: ${message}

⏰ Время: ${new Date().toLocaleString('ru-RU')}
        `;

        // Отправляем сообщение в Telegram
        await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, telegramMessage, {
            parse_mode: 'HTML'
        });

        console.log('Заявка успешно отправлена:', { name, phone, email });
        res.json({ success: true, message: 'Заявка успешно отправлена' });
    } catch (error) {
        console.error('Ошибка при отправке заявки:', error);
        
        // Определяем тип ошибки
        let errorMessage = 'Произошла ошибка при отправке заявки';
        if (error.message.includes('chat not found')) {
            errorMessage = 'Ошибка конфигурации Telegram бота';
        } else if (error.message.includes('network')) {
            errorMessage = 'Ошибка сети при отправке заявки';
        }
        
        res.status(500).json({ 
            success: false, 
            message: errorMessage
        });
    }
});

// Обработка ошибок 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Страница не найдена'
    });
});

// Обработка всех остальных ошибок
app.use((err, req, res, next) => {
    console.error('Необработанная ошибка:', err);
    res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера'
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
    console.log(`Режим: ${process.env.NODE_ENV || 'development'}`);
}); 