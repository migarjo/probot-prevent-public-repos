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
        this.utilities = require('./utilities')
      }

      update () {
        var configParams = Object.assign({}, require('./defaults'), this.config || {})

        if (this.isAddDefaultTeamsDisabled(configParams.enableAddDefaultTeams)) return

        getTeamFromName(configParams.defaultTeams)

        if (!configParams.monitorOnly) {
          //return this.executePrivatize(configParams)
        }

        //return this.executeMonitorOnly(configParams.privatizeIssueTitle, configParams.privatizeIssueBody, configParams.ccList)
      }

      isAddDefaultTeamsDisabled (enableAddDefaultTeams) {
        if (this.payload.action === 'publicized' && !enableAddDefaultTeams) {
          this.logger.info(`Repo: ${this.repo.repo} was created but enableAddDefaultTeams is set to false`)
          return true
        }
        return false
      }

      async getTeamFromName (teamName) {
        console.log("teamName:", teamName)
        console.log('repo', this.repo)
        const result = await github.orgs.getTeams({org, page, per_page})
      }
    }


  module.exports = AddDefaultTeams
