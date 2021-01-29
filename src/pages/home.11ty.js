module.exports = {
  data() {
    return {
      title: "HOME",
      permalink(data) {
        return this.url("/");
      }
    };
  },

  render(data) {
    const repos = data.repos.map(({owner, repo}) => {
      const full_name = `${owner}/${repo}`;
      return `<li><a href="${ this.url(`/repo/${full_name}/`) }">${full_name}</a></li>`;
    });

    return `
      <h1>This is the homepage!!!</h1>
      <ul>${ repos.join("\n") }</ul>
    `;
  }
};