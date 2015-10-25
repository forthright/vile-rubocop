let _ = require("lodash")
let vile = require("@brentlintner/vile")
let ignore = require("ignore-file")

const RC_SEVERITY = {
  REFACTOR: "refactor",
  CONVENTION: "convention",
  WARNING: "warning",
  ERROR: "error",
  FATAL: "fatal"
}

let allowed = (ignore_list = []) => {
  let ignored = ignore.compile(ignore_list.join("\n"))
  return (file) => file.match(/\.rb$/) && !ignored(file)
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
    case RC_SEVERITY.REFACTOR:
      return vile.WARNING

    case RC_SEVERITY.ERROR:
    case RC_SEVERITY.FATAL:
    case RC_SEVERITY.CONVENTION:
      return vile.ERROR

    default:
      return vile.ERROR
  }
}

let vile_issue = (record) => (offense) => {
  return vile.issue(
    to_issue_type(offense.severity),
    record.path,
    `${offense.message} (${offense.cop_name})`,
    {
      line: _.result(offense, "location.line"),
      character: _.result(offense, "location.column")
    }
  )
}

let into_issues = (rc_json) => {
  return _.flatten(rc_json.files.map((record) => {
    return record.offenses.map(vile_issue(record))
  }))
}

// TODO: support toggling stuff like --rails

let punish = (plugin_config) => {
  return vile.promise_each(
    process.cwd(),
    allowed(plugin_config.ignore),
    (filepath) => vile.issue(vile.OK, filepath),
    { read_data: false }
  )
  .then((all_files) => {
    return rubocop(_.get(plugin_config, "config"))
      .then((rc_json) => into_issues(rc_json))
      .then((issues) => {
        return _.reject(all_files, (file) => {
          return _.any(issues, (issue) => issue.file == file)
        }).concat(issues)
      })
  })
}

module.exports = {
  punish: punish
}
