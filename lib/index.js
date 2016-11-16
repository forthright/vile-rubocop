"use strict";

var _ = require("lodash");
var vile = require("@forthright/vile");

var RC_SEVERITY = {
  REFACTOR: "refactor",
  CONVENTION: "convention",
  WARNING: "warning",
  ERROR: "error",
  FATAL: "fatal"
};

// TODO: support custom ignoring (with is_not_ignored)

var rubocop = function rubocop(custom_config_path, allowed_paths) {
  var opts = {};

  if (custom_config_path) {
    opts.c = custom_config_path;
  }

  opts.args = _.reduce(opts, function (arr, option, name) {
    return arr.concat(["-" + name, option]);
  }, []).concat(allowed_paths).concat(["--format", "json", "--rails"]);

  return vile.spawn("rubocop", opts).then(function (spawn_data) {
    var stdout = _.get(spawn_data, "stdout");
    return stdout ? JSON.parse(stdout) : { files: [] };
  });
};

var to_issue_type = function to_issue_type(severity) {
  switch (severity) {
    case RC_SEVERITY.WARNING:
    case RC_SEVERITY.CONVENTION:
      return vile.STYL;

    case RC_SEVERITY.REFACTOR:
      return vile.MAIN;

    case RC_SEVERITY.ERROR:
    case RC_SEVERITY.FATAL:
      return vile.ERR;

    default:
      return vile.STYL;
  }
};

var vile_issue = function vile_issue(record) {
  return function (offense) {
    return vile.issue({
      type: to_issue_type(offense.severity),
      path: record.path,
      title: offense.message + " (" + offense.cop_name + ")",
      message: offense.message + " (" + offense.cop_name + ")",
      signature: "rubocop::" + offense.cop_name,
      where: {
        start: {
          line: _.result(offense, "location.line"),
          character: _.result(offense, "location.column")
        }
      }
    });
  };
};

var into_issues = function into_issues(rc_json) {
  return _.flatten(rc_json.files.map(function (record) {
    return record.offenses.map(vile_issue(record));
  }));
};

// TODO: support toggling stuff like --rails

var punish = function punish(plugin_config) {
  var allow = _.get(plugin_config, "allow", ["."]);
  var config_path = _.get(plugin_config, "config");
  return rubocop(config_path, allow).then(function (rc_json) {
    return into_issues(rc_json);
  });
};

module.exports = {
  punish: punish
};