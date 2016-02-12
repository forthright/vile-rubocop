let _ = require("lodash")
let vile = require("@forthright/vile")

const RC_SEVERITY = {
  REFACTOR: "refactor",
  CONVENTION: "convention",
  WARNING: "warning",
  ERROR: "error",
  FATAL: "fatal"
}

// TODO: support custom ignoring (with is_not_ignored)

let rubocop = (custom_config_path) => {
  let opts = {}

  if (custom_config_path) {
    opts.c = custom_config_path
  }

  opts.args = _.reduce(opts, (arr, option, name) => {
    return arr.concat([`-${name}`, option])
  }, []).concat([".", "--format", "json", "--rails"])

  return vile
    .spawn("rubocop", opts)
    .then((stdout) => stdout ?
          JSON.parse(stdout) : { files: [] })
}

let to_issue_type = (severity) => {
  switch(severity) {
    case RC_SEVERITY.WARNING:
    case RC_SEVERITY.CONVENTION:
      return vile.STYL

    case RC_SEVERITY.REFACTOR:
      return vile.MAIN

    case RC_SEVERITY.ERROR:
    case RC_SEVERITY.FATAL:
      return vile.ERR

    default:
      return vile.STYL
  }
}

let vile_issue = (record) => (offense) =>
  vile.issue({
    type: to_issue_type(offense.severity),
    path: record.path,
    title: `${offense.message} (${offense.cop_name})`,
    message: `${offense.message} (${offense.cop_name})`,
    signature: `rubocop::${offense.cop_name}`,
    where: {
      start: {
        line: _.result(offense, "location.line"),
        character: _.result(offense, "location.column")
      }
    }
  })

let into_issues = (rc_json) =>
  _.flatten(rc_json.files.map((record) =>
    record.offenses.map(vile_issue(record))
  ))

// TODO: support toggling stuff like --rails

let punish = (plugin_config) =>
  rubocop(_.get(plugin_config, "config"))
    .then((rc_json) => into_issues(rc_json))

module.exports = {
  punish: punish
}
