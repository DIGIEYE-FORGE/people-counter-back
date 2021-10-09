const Sequelize = require('sequelize');
const crypto = require('crypto');
const moment = require('moment-timezone');

const { Model } = Sequelize;

class PasswordResetToken extends Model {
  static get modelFields() {
    return {
      PasswordResetTokenId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id',
      },
      resetToken: {
        type: Sequelize.STRING,
        allowNull: false,
        index: true,
        field: 'reset_token',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      userEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'user_email',
      },
      expires: {
        type: Sequelize.DATE,
      },
    };
  }

  /**
   * Generate a reset token object and saves it into the database
   *
   * @param {User} user
   * @returns {ResetToken}
   */
  static async generate(user) {
    const userId = user._id;
    const userEmail = user.email;
    const resetToken = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
    const expires = moment().add(2, 'hours').toDate();
    const ResetTokenObject = new PasswordResetToken({
      resetToken,
      userId,
      userEmail,
      expires,
    });
    await ResetTokenObject.save();
    return ResetTokenObject;
  }

  static init(sequelize) {
    const options = { ...this.modelOptions, sequelize };
    return super.init(this.modelFields, options);
  }

  static associate(models) {
    this.belongsTo(models.User);
  }
}

module.exports = PasswordResetToken;
