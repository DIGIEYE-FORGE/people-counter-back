const bcrypt = require('bcryptjs');
const { env } = require('../../config/vars');

const passwd = async (password) => {
  const rounds = env === 'test' ? 1 : 10;
  const hash = await bcrypt.hash(password, rounds);
  return hash;
};

module.exports = {
  up: async (queryInterface) =>
    queryInterface.bulkInsert('Users', [
      {
        first_name: 'admin',
        last_name: 'admin',
        email: 'admin@digieye.io',
        password: await passwd('2899100'),
        role: 'SYSADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),

  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
