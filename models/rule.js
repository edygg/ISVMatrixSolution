var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var RuleSchema = new Schema({
  columns: Schema.Types.Mixed,
  result: Schema.Types.Mixed
});

var ruleModel = mongoose.model('Rule', RuleSchema);

module.exports = ruleModel; 
