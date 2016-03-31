var express = require('express');
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

module.exports = router;
