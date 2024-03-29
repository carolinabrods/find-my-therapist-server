const { Schema, model } = require('mongoose');

const profileSchema = new Schema({
  age: { type: Number, min: 5, max: 99 },
  gender: {
    type: String,
    enum: ['Female', 'Male', 'Transgender', 'Non-binary'],
  },
  location: {
    type: String,
    enum: [
      'Aveiro',
      'Beja',
      'Braga',
      'Bragança',
      'Castelo Branco',
      'Coimbra',
      'Évora',
      'Faro',
      'Guarda',
      'Leiria',
      'Lisboa',
      'Portalegre',
      'Porto',
      'Madeira',
      'Açores',
      'Santarém',
      'Setúbal',
      'Viana do Castelo',
      'Vila Real',
      'Viseu',
    ],
  },
  therapySetup: { type: [String], enum: ['Online', 'In-person'] },
  psyApproach: {
    type: [String],
    enum: [
      'Cognitive Behavioral',
      'Psychoanalytical',
      'Humanistic',
      'Systematic',
      'Constructionist',
      "I don't know",
    ],
  },
  price: { type: Number, min: 0, max: 1000 },
  description: String,
  addressStreet: String,
  addressCode: String,
  calendarLink: String,
  picture: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Profile = model('Profile', profileSchema);

module.exports = Profile;
