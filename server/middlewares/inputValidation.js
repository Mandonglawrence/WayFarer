import Joi from '@hapi/joi';

const email = Joi.string()
  .email({ minDomainSegments: 2 })
  .required()
  .error(new Error('Invalid email'));

const password = Joi.string()
  .min(6)
  .required()
  .error(new Error('Password must have minimum of six(6) characters'));

const signUpSchema = Joi.object().keys({
  first_name: Joi.string()
    .required()
    .error(new Error('First name cannot be empty')),
  last_name: Joi.string()
    .required()
    .error(new Error('Last name cannot be empty')),
  email,
  password,
  is_admin: Joi.boolean().error(new Error('Admin status can either be true or false')),
});
const setAdminStatus = userEmail => (!!userEmail.endsWith('@wayfarer.com'));
export const validateSignUp = async (req, res, next) => {
  try {
    await Joi.validate(req.body, signUpSchema);
    req.body.isAdmin = req.body.is_admin || setAdminStatus(req.body.email);
    next();
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

const loginSchema = Joi.object({
  email,
  password,
});
export const validateLogin = async (req, res, next) => {
  try {
    if (!req.body.email) throw new Error('No email Provided');
    await Joi.validate(req.body, loginSchema);
    next();
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

const errorMessage = (path) => {
  let msg = '';
  if (/trip/.test(path)) {
    msg = 'trip';
  } else if (/bus/.test(path)) {
    msg = 'bus';
  } else if (/booking/.test(path)) {
    msg = 'booking';
  } else {
    msg = 'user';
  }
  return msg;
};

export const validateParam = async (req, res, next) => {
  const path = errorMessage(req.originalUrl);
  if (!req.params[`${path}Id`]) {
    return res.status(400).json({
      status: 'error',
      message: `${path} id not given`,
    });
  }

  if (!parseInt(req.params[`${path}Id`], 10)) {
    return res.status(400).json({
      status: 'error',
      message: `Invalid ${path} Id`,
    });
  }
  return next();
};

const busSchema = Joi.object().keys({
  manufacturer: Joi.string()
    .required()
    .error(new Error('Invalid Manufacturer input')),
  model: Joi.string()
    .required()
    .error(new Error('Invalid Model Input')),
  year: Joi.number()
    .integer()
    .positive()
    .required()
    .error(new Error('Invalid Year')),
  capacity: Joi.number()
    .positive()
    .integer()
    .required()
    .error(new Error('Invalid Bus Capacity')),
  number_plate: Joi.string()
    .regex(/(^([a-z]+)-((\d{3})([a-zA-z]{2})))/i)
    .min(9, 'utf-8')
    .max(9)
    .required()
    .error(new Error('Invalid Number Plate')),
});

export const validateBus = async (req, res, next) => {
  try {
    await Joi.validate(req.body, busSchema);
    req.body.number_plate = req.body.number_plate.toUpperCase();
    next();
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};
const tripSchema = Joi.object().keys({
  origin: Joi.string().regex(/\w+/i).error(new Error('Invalid trip origin')),
  destination: Joi.string().regex(/\w+/i).error(new Error('Invalid Trip destination')),
  fare: Joi.number().integer().positive().error(new Error('Invalid Trip fare')),
  bus_id: Joi.number().integer().positive().error(new Error('Invalid Bus Id')),
  trip_date: Joi.string().error(new Error('Invalid Trip date')),
});

export const validateTrip = async (req, res, next) => {
  const inputs = Object.keys(req.body);
  for (let i = 0; i < inputs.length; i += 1) {
    if (!req.body[inputs[i]]) {
      return res.status(400).json({
        status: 'error',
        message: `${inputs[i]} is blank`,
      });
    }
  }
  try {
    await Joi.validate(req.body, tripSchema);
    return next();
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.mesage,
    });
  }
};
const querySchema = Joi.object().keys({
  origin: Joi.string().regex(/[a-z]+/i).error(new Error('Invalid Origin')),
  destination: Joi.string().regex(/[a-z]+/i).error(new Error('Invalid destination')),
});
export const validateQuery = async (req, res, next) => {
  try {
    await Joi.validate(req.query, querySchema);
    next();
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};
const bookingSchema = Joi.object().keys({
  trip_id: Joi.number()
    .integer()
    .positive()
    .required()
    .error(new Error('Invalid Trip Id')),
  seat_number: Joi.number()
    .integer()
    .positive()
    .allow('')
    .error(new Error('Invalid seat number')),
});
export const validateBooking = async (req, res, next) => {
  try {
    if (!req.body.trip_id) {
      throw new Error('No Trip Id given');
    }
    await Joi.validate(req.body, bookingSchema);
    next();
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};
