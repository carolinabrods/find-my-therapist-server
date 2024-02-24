const { Schema, model } = require('mongoose');

const matchSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
  therapistId: { type: Schema.Types.ObjectId, ref: 'Therapist' },
  matchedSetup: Boolean,
  matchedApproach: Boolean,
  matchedPrice: Boolean,
  matchedTraits: Boolean,
  didClientConfirmed: Boolean,
  didTherapistConfirmed: Boolean,
});

const Match = model('Match', matchSchema);

module.exports = Match;