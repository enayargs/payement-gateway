require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    await sequelize.sync({ alter: true });
    console.log('✅ Models synchronized');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 API endpoints:`);
      console.log(`   - Users:      http://localhost:${PORT}/api/users`);
      console.log(`   - Wallets:    http://localhost:${PORT}/api/wallets`);
      console.log(`   - Payments:   http://localhost:${PORT}/api/payments`);
      console.log(`   - Transactions: http://localhost:${PORT}/api/transactions`);
      console.log(`   - Webhooks:   http://localhost:${PORT}/api/webhooks`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();