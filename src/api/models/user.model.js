const Sequelize = require('sequelize');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const APIError = require('../errors/api-error');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

const { Model } = Sequelize;

const roles = ['USER', 'ADMIN', 'SYSADMIN', '_loggedUser'];

class User extends Model {
  static get modelFields() {
    return {
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: Sequelize.STRING,
        field: 'last_name',
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
      },
      profilePic: {
        type: Sequelize.STRING,
        field: 'profile_pic',
      },
      role: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: roles.pop(),
      },
      verifyToken: {
        type: Sequelize.STRING,
        defaultValue: null,
        field: 'verify_token',
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: 'is_verified',
      },
    };
  }

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  }

  transform() {
    const transformed = {};
    const fields = [
      'id',
      'firstName',
      'lastName',
      'email',
      'role',
      'createdAt',
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }

  token() {
    const payload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this.id,
    };
    return jwt.encode(payload, jwtSecret);
  }

  static async findAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email) {
      throw new APIError({
        message: 'An email is required to generate a token',
      });
    }
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    const user = await User.findOne({ where: { email } });

    if (password) {
      if (user && (await user.passwordMatches(password))) {
        return { user, accessToken: user.token() };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.email === email) {
      return { user, accessToken: user.token() };
    } else if (!refreshObject) {
      err.message = 'Invalid refresh token.';
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  }

  static init(sequelize) {
    const options = { ...this.modelOptions, sequelize };
    return super.init(this.modelFields, options);
  }

  static associate(models) {
    this.hasOne(models.Permission);
  }

  static hooks() {
    User.beforeCreate(async (user, options) => {
      const rounds = env === 'test' ? 1 : 10;
      const hash = await bcrypt.hash(user.password, rounds);
      user.password = hash;
    });
  }
}

module.exports = User;
