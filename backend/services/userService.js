const { User, Wallet } = require('../models');

const userService = {
  async createUser(userData) {
    const user = await User.create(userData);
    await Wallet.create({ userId: user.id, balance: 0.00, currency: 'USD' });
    return user;
  },

  async getAllUsers() {
    return User.findAll({
      include: [{ model: Wallet, as: 'wallet' }]
    });
  },

  async getUserById(id) {
    return User.findByPk(id, {
      include: [{ model: Wallet, as: 'wallet' }]
    });
  },

  async getUserByEmail(email) {
    return User.findOne({ where: { email } });
  },

  async updateUser(id, userData) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return user.update(userData);
  },

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) return false;
    await user.destroy();
    return true;
  }
};

module.exports = userService;