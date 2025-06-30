import log4js from 'log4js';


log4js.configure({
    appenders: {
      everything: {
        type: 'dateFile',
        filename: 'logs/app.log', // בסיס השם
        pattern: 'yyyy-MM-dd',    // יצור קבצים כמו logs/app.log.2025-06-09
        compress: true,           // דוחס קבצים ישנים
        daysToKeep: 7,            // אופציונלי: שומר 7 ימים אחורה
        keepFileExt: true         // שומר את סיומת הקובץ גם אחרי ההוספה של התאריך
      }
    },
    categories: {
      default: { appenders: ['everything'], level: 'info' }
    }
  });

export default log4js;
