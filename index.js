const PreventPublicRepos = require('./lib/prevent-public-repos')
const AddDefaultTeams = require('./lib/add-default-teams')

function probot (robot) {
  robot.on('repository.created', async context => {
    return PreventPublicRepos.analyze(context.github, context.repo(), context.payload, robot.log)
  })

  robot.on('repository.publicized', async context => {
    robot.log('New repo was publicized')
    return PreventPublicRepos.analyze(context.github, context.repo(), context.payload, robot.log)
  })

  robot.on('repository.created', async context => {
    return AddDefaultTeams.analyze(context.github, context.repo(), context.payload, robot.log)
  })
}

module.exports = probot
