var express = require('express');
var mongoose = require('mongoose');
var Rule = require('../models/rule');
var Validator = require('jsonschema').Validator;

var router = express.Router();

router.post('/', function (req, res) {
  var transformObject = {};
  var naturalRegex = /^(señor|señora|señor\sy\sseñora)$/;
  var juridicalRegex = /^(empresa)$/;
  var localAccountsGroupRegex = /^(CPD\s0|PACC\s09|PDIR\s07|PEMG\s10|PEMP\s06|PNAC\s04|POTR\s08)$/;
  var noDomiciliarioRegex = /^(PEXT\s05)$/;
  var paraisoFiscalRegex = /^(PMJD\s07)$/

  // Without transformations
  transformObject.tipo_operacion = req.body.tipo_operacion;
  transformObject.tipo_nif = req.body.tipo_nif;
  transformObject.clase_impuesto = req.body.clase_impuesto;
  transformObject.tipo_articulo = req.body.tipo_articulo;
  transformObject.tipo_inventario = req.body.tipo_inventario;

  // With transformations
  if (naturalRegex.test(req.body.tratamiento)) {
    transformObject.tratamiento = "natural";
  } else if (juridicalRegex.test(req.body.tratamiento)) {
    transformObject.tratamiento = "juridica";
  } else {
    transformObject = undefined;
  }

  if (localAccountsGroupRegex.test(req.body.grupo_cuentas)) {
    transformObject.grupo_cuentas = "local";
  } else if (noDomiciliarioRegex.test(req.body.grupo_cuentas)) {
    transformObject.grupo_cuentas = "no domiciliario";
  } else if (paraisoFiscalRegex.test(req.body.grupo_cuentas)) {
    transformObject.grupo_cuentas = "paraiso fiscal";
  } else {
    transformObject = undefined;
  }

  res.json(transformObject);
});

router.post('/rules', function(req, res) {
  var validator = new Validator();
  var errorObject = { errors: [] };

  var objectSchemaValidator = {
    "id": "/SimpleObject",
    "type": "object"
  };

  var ruleSchemaValidator = {
    "id": "/Rule",
    "type": "object",
    "properties": {
      "columns": { "$ref": "/SimpleObject" },
      "result": { "$ref": "/SimpleObject" },
    },
    "required": ["columns", "result"]
  };

  validator.addSchema(objectSchemaValidator, '/SimpleObject');

  var rulesArray = req.body
  var rulesValidation = validator.validate(rulesArray, { "type": "array" })

  if (rulesValidation.errors.length > 0) {
    res.status(422);
    errorObject.errors.push("Se esperaba un arreglo como parámetro.");
    res.json(errorObject);
  }

  var hasErrors = false;
  for (var i = 0; i < rulesArray.length; i++) {
    var rule = rulesArray[i];
    var ruleValidation = validator.validate(rule, ruleSchemaValidator);

    if (ruleValidation.errors.length > 0) {
      hasErrors = true;
      res.status(422);
      errorObject.errors.push("La regla " + i + " no cumple con el esquema JSON.");
    }
  }

  if (hasErrors) {
    res.json(errorObject);
  }
  // removing all rules
  var insertingRulesCallback = function(index, array) {
    if (index < array.length) {
      var rule = array[index];
      var query = Rule.find({});
      for (var key in Object.keys(rule)) {
        query = query.where('columns.' + key).equals(rule[key])
      }
      query.exec(function(err, duplicateRule) {
        if (err) {
          res.status(500);
          errorObject.errors.push("No es posible actualizar la lista de reglas");
          res.json(errorObject);
        }

        if (duplicateRule.length <= 0) {
          var neoRule = new Rule(rule);
          neoRule.save();
          insertingRulesCallback(index + 1, array)
        }
      });
    }
  };

  Rule.remove({}, function(err) {
    insertingRulesCallback(0, rulesArray);
  });

  res.status(200);
  res.json({status: "ok"});
});

router.get('/rules', function(req, res) {
  Rule.find({}).select("columns result").exec(function(err, rules) {
    if (err) {
      res.status(500);
      res.json({ errors: ["Error al obtener la lista actual de reglas."] });
    }

    res.status(200);
    res.json(rules);
  });
});

router.get('/rules/new', function(req, res) {
  Rule.findOne({}).select('columns -_id').exec(function(err, rule) {
    if (err) {
      res.status(500);
      res.json({ errors: ["Error al obtener el esquema del nuevo objeto."] });
    }

    var columns = Object.keys(rule.columns);

    for (var i = 0; i < columns.length; i++) {
      rule['columns'][columns[i]] = '';
    }

    res.status(200);
    res.json(rule);
  });
});

module.exports = router;
