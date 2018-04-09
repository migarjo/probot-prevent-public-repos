module.exports = {
  monitorOnly: false,
  enablePrivateToPublic: true,
  enableAddDefaultTeams: true,
  privatizedIssueTitle: '[CRITICAL] Public Repositories are Disabled for this Org',
  privatizedIssueBody: 'NOTE: Public Repos are disabled for this organization! Repository was automatically converted to a Private Repo. Please contact an admin to override.',
  monitorIssueBody: 'Please note that this repository is publicly visible to the internet!\n\n',
  ccList: '',
  excludeRepos: [],
  defaultTeams: ['test-team'],
  FILE_NAME: '.github/prevent-public-repos.yml',
  ORG_WIDE_REPO_NAME: 'org-settings'
}
