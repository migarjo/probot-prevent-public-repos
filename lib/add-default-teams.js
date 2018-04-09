const yaml = require('js-yaml')

class AddDefaultTeams {

  static analyze (github, repo, payload, logger) {
    const defaults = require('./defaults')
    const orgRepo = (process.env.ORG_WIDE_REPO_NAME) ? process.env.ORG_WIDE_REPO_NAME : defaults.ORG_WIDE_REPO_NAME
    const filename = (process.env.FILE_NAME) ? process.env.FILE_NAME : defaults.FILE_NAME
    logger.info('Get config from: ' + repo.owner + '/' + orgRepo + '/' + filename)

    return github.repos.getContent({
      owner: repo.owner,
      repo: orgRepo,
      path: filename
    }).catch(() => ({
      noOrgConfig
    }))
      .then((orgConfig) => {
        if ('noOrgConfig' in orgConfig) {
          logger.info('NOTE: config file not found in: ' + orgRepo + '/' + filename + ', using defaults.')
          return new AddDefaultTeams(github, repo, payload, logger, '').update()
        } else {
          const content = Buffer.from(orgConfig.data.content, 'base64').toString()
          return new AddDefaultTeams(github, repo, payload, logger, content).update()
        }
      })
  }

      constructor (github, repo, payload, logger, config) {
        this.github = github
        this.repo = repo
        this.payload = payload
        this.logger = logger
        this.config = yaml.safeLoad(config)
      }

      async update () {
        var configParams = Object.assign({}, require('./defaults'), this.config || {})

        if (this.isAddDefaultTeamsDisabled(configParams.enableAddDefaultTeams)) return

        const teamId = await getTeamFromName(configParams.defaultTeams, this.repo.owner, this.github)

        console.log("ID:", teamId)

        const result = addTeamAccess(teamId, this.repo.repo, this.repo.owner, this.github)


        //return this.executeMonitorOnly(configParams.privatizeIssueTitle, configParams.privatizeIssueBody, configParams.ccList)
      }

      isAddDefaultTeamsDisabled (enableAddDefaultTeams) {
        if (this.payload.action === 'publicized' && !enableAddDefaultTeams) {
          this.logger.info(`Repo: ${this.repo.repo} was created but enableAddDefaultTeams is set to false`)
          return true
        }
        return false
      }







    }

    async function getTeamFromName (teamName, org, github) {
      const args = {org, per_page:1}
      const result = await paginate(github.orgs.getTeams, args, github)
      for (var i = 0; i < result.length; i++) {
        const name = result[i].name.toLowerCase()
        teamName = String(teamName).toLowerCase()
        if(name === teamName) {
          return result[i].id
        }

      }
    }

    async function paginate (method, args, github) {
      let response = await method(args)
      let {data} = response
      while (github.hasNextPage(response)) {
        response = await github.getNextPage(response)
        data = data.concat(response.data)
      }
      return data
    }

    async function addTeamAccess (id, repo, org, github) {
      console.log(this.repo)
      const args = {
        id: id,
        org: org,
        repo: repo,
        permission: "pull"
      }
      github.orgs.addTeamRepo(args)
    }

  module.exports = AddDefaultTeams
