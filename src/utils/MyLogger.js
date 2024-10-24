// logger.js
export const MyLogger = (message, level = 'info') => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level,
        message,
    };

    const existingLogs = JSON.parse(localStorage.getItem('appLogs')) || [];
    existingLogs.push(logEntry);

    localStorage.setItem('appLogs', JSON.stringify(existingLogs));

    console[level](logEntry);
};
