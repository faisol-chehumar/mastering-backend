import Joi from '@hapi/joi'
const schema = Joi.object().keys({
  id: Joi.number().required(),
  name: Joi.string().required(),
  status: Joi.string().required(),
  type: Joi.string().required(),
  location: Joi.string().required(),
  color: Joi.string().required(),
})
