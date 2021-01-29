module.exports = {
  data() {
    return {
      pagination: {
        data: "repos",
        size: 1,
        alias: "repo",
      },
      layout: "",
      permalink(data) {
        const { owner, repo } = data.repo;
        return this.url(`/repo/${owner}/${repo}/repo.json`);
      },
    };
  },

  render(data) {
    const { owner, repo } = data.repo;
    const repoJson = data._repos[owner][repo];
    return `${JSON.stringify(repoJson, null, 2)}`;
  },
};
