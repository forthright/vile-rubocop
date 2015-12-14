"use strict";

var _ = require("lodash");
var vile = require("@brentlintner/vile");
var ignore = require("ignore-file");

var RC_SEVERITY = {
  REFACTOR: "refactor",
  CONVENTION: "convention",
  WARNING: "warning",
  ERROR: "error",
  FATAL: "fatal"
};

var allowed = function allowed() {
  var ignore_list = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

  var ignored = ignore.compile(ignore_list.join("\n"));
  return function (file) {
    return file.match(/\.rb$/) && !ignored(file);
  };
};

// TODO: support custom ignoring (with is_not_ignored)

var rubocop = function rubocop(custom_config_path) {
  var opts = {};

  if (custom_config_path) {
    opts.c = custom_config_path;
  }

  opts.args = _.reduce(opts, function (arr, option, name) {
    return arr.concat(["-" + name, option]);
  }, []).concat([".", "--format", "json", "--rails"]);

  return vile.spawn("rubocop", opts).then(function (stdout) {
    return stdout ? JSON.parse(stdout) : { files: [] };
  });
};

var to_issue_type = function to_issue_type(severity) {
  switch (severity) {
    case RC_SEVERITY.WARNING:
    case RC_SEVERITY.REFACTOR:
      return vile.WARNING;

    case RC_SEVERITY.ERROR:
    case RC_SEVERITY.FATAL:
    case RC_SEVERITY.CONVENTION:
      return vile.ERROR;

    default:
      return vile.ERROR;
  }
};

var vile_issue = function vile_issue(record) {
  return function (offense) {
    return vile.issue(to_issue_type(offense.severity), record.path, offense.message + " (" + offense.cop_name + ")", {
      line: _.result(offense, "location.line"),
      character: _.result(offense, "location.column")
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
  return vile.promise_each(process.cwd(), allowed(plugin_config.ignore), function (filepath) {
    return vile.issue(vile.OK, filepath);
  }, { read_data: false }).then(function (all_files) {
    return rubocop(_.get(plugin_config, "config")).then(function (rc_json) {
      return into_issues(rc_json);
    }).then(function (issues) {
      return _.reject(all_files, function (file) {
        return _.any(issues, function (issue) {
          return issue.file == file;
        });
      }).concat(issues);
    });
  });
};

module.exports = {
  punish: punish
};