mimus = require "mimus"
newline = require "./../lib"
chai = require "./helpers/sinon_chai"
expect = chai.expect

describe "rubocop plugin", ->
  afterEach newline.reset
  after newline.restore
