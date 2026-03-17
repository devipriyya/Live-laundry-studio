const { runAll } = require('./test_user_modules');

(async () => {
  try {
    await runAll();
    process.exit(0);
  } catch (error) {
    console.error('Final Execution Error:', error);
    process.exit(1);
  }
})();
