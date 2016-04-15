var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var RuleSchema = new Schema({
  columns: Schema.Types.Mixed,
  result: Schema.Types.Mixed
});

mongoose.model('Rule', RuleSchema);
