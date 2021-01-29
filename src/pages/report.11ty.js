module.exports = {
  data() {
    return {
      pagination: {
        data: "repos",
        size: 1,
        alias: "repo",
      },
      permalink(data) {
        const { owner, repo } = data.repo;
        data.title = `${owner}/${repo}`;
        return this.url(`/repo/${owner}/${repo}/`);
      },
    };
  },

  render(data) {
    const { owner, repo } = data.repo;
    const repoJson = data._repos[owner][repo];

    const section = (label = "", files = [], showIfEmpty = false, emptyMsg = "NO FILES FOUND") => {
      if (files.length === 0 && !showIfEmpty) {
        return "";
      }
      const content = files
        .filter((file) => file.type === "blob")
        .map(
          (file) =>
            `<li><a href="${file.html_url}">${file.path}</a> &mdash; ${
              file.mode
            }; ${this.bytes(file.size)}</li>`
        );
      return `
        <section>
          ${ label ? `<h2>${label}</h2>` : "" }
          ${ content.length !== 0 ? `<ul>${content.join("\n")}</ul>` : emptyMsg }
        </section>
      `;
    };

    const m = repoJson.meta;

    return `
      <header>
        <h1><a href="${repoJson.html_url}">${repoJson.full_name}</a></h1>
        <blockquote>
          <p>${repoJson.description}</p>
        </blockquote>
      </header>
      <article>
        <ul>
          <li>Homepage: ${ repoJson.homepage ? `<a href="${repoJson.homepage}">${
      repoJson.homepage 
    }</a>` : "NO HOMEPAGE SET" }</li>
          <li>Size: ${this.bytes(repoJson.size)}</li>
          <li>Open issues: ${repoJson.open_issues_count}</li>
          <li>License: ${
            repoJson.license
              ? `${repoJson.license.spdx_id} (${repoJson.license.name})`
              : "NO LICENSE FOUND"
          }</li>
          <li>Default branch: ${repoJson.default_branch}</li>
        </ul>
        
        <hr/>

        <!-- CI -->
        ${ "" && section("Circle CI", m.circleci_files) }
        ${ "" && section("Travis CI", m.travisci_files)}
        ${ "" && section("GitHub Actions", m.githubactions_files)}
        ${ "" && section("Taskcluster", m.taskcluster_files)}

        ${section("CI", [
          ...m.circleci_files,
          ...m.travisci_files,
          ...m.githubactions_files,
          ...m.taskcluster_files,
        ])}

        <!-- Dependencies -->
        ${section("Dependabot", m.dependabot_files)}
        ${section("Renovate", m.renovate_files)}

        <!-- Files -->
        ${section("CODE OF CONDUCT", m.codeofconduct_files, true, "NO CODE_OF_CONDUCT.md FILE FOUND")}
        ${section("CONTRIBUTING", m.contributing_files, true, "NO CONTRIBUTING.md FILE FOUND")}
        ${section("LICENSE", m.license_files, true, "NO LICENSE FILE FOUND")}
        ${section("README.md", m.readme_files, true, "NO README.md FILE FOUND")}
        ${section("CODEOWNERS", m.codeowners_files)}
        ${section("Large files", m.large_files)}
        ${section("Suspicious permissions", m.suspicious_permissions_files)}

        <!-- Node -->
        ${section("package.json", m.packagejson_files)}
        ${section("ESLint", m.eslint_files)}
        
        <!-- Python -->
        ${section("requirements.txt", m.requirementstxt_files)}
        ${section("Flake8", m.flake8_files)}
      </article>
    `;
  },
};

// "meta": {
//   "circleci_files": [
//     {
//       "path": ".circleci/config.yml",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "4d7fb1712deb2c3e485016e0842215495859cb64",
//       "size": 6048,
//       "name": "config.yml",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/.circleci/config.yml",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/.circleci/config.yml",
//       "permissions": "rw-r--r--",
//       "ext": ".yml",
//       "mime": "text/yaml"
//     },
//     {
//       "path": ".circleci/scripts",
//       "mode": "040000",
//       "type": "tree",
//       "sha": "e20e4fee654a8eff89f632321600f46a68142e56",
//       "name": "scripts"
//     },
//     {
//       "path": ".circleci/scripts/sync-static",
//       "mode": "100755",
//       "type": "blob",
//       "sha": "2816902a9a2bb3fc612faf7fa51ac35c38cb1fd9",
//       "size": 406,
//       "name": "sync-static",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/.circleci/scripts/sync-static",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/.circleci/scripts/sync-static",
//       "permissions": "rwxr-xr-x",
//       "ext": ""
//     }
//   ],
//   "githubactions_files": [],
//   "travisci_files": [
//     {
//       "path": ".travis.yml",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "477204f74e619663723394878cca63b51a9c8c36",
//       "size": 973,
//       "name": ".travis.yml",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/.travis.yml",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/.travis.yml",
//       "permissions": "rw-r--r--",
//       "ext": ".yml",
//       "mime": "text/yaml"
//     }
//   ],
//   "taskcluster_files": [],
//   "dependabot_files": [],
//   "renovate_files": [
//     {
//       "path": "renovate.json",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "3f14bc1d7432921fc8d4d0246bbbcef873af285b",
//       "size": 70,
//       "name": "renovate.json",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/renovate.json",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/renovate.json",
//       "permissions": "rw-r--r--",
//       "ext": ".json",
//       "mime": "application/json"
//     }
//   ],
//   "codeofconduct_files": [
//     {
//       "path": "CODE_OF_CONDUCT.md",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "498baa3fb0f09a2042d2c8657b67fc7832cc2c30",
//       "size": 691,
//       "name": "CODE_OF_CONDUCT.md",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/CODE_OF_CONDUCT.md",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/CODE_OF_CONDUCT.md",
//       "permissions": "rw-r--r--",
//       "ext": ".md",
//       "mime": "text/markdown"
//     }
//   ],
//   "codeowners_files": [],
//   "contributing_files": [
//     {
//       "path": "docs/CONTRIBUTING.md",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "2972873d992e6253750cc8992442eaae2bdb00f0",
//       "size": 1523,
//       "name": "CONTRIBUTING.md",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/docs/CONTRIBUTING.md",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/docs/CONTRIBUTING.md",
//       "permissions": "rw-r--r--",
//       "ext": ".md",
//       "mime": "text/markdown"
//     }
//   ],
//   "license_files": [
//     {
//       "path": "LICENSE",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "14e2f777f6c395e7e04ab4aa306bbcc4b0c1120e",
//       "size": 16726,
//       "name": "LICENSE",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/LICENSE",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/LICENSE",
//       "permissions": "rw-r--r--",
//       "ext": ""
//     }
//   ],
//   "readme_files": [
//     {
//       "path": "README.md",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "dfab0886c4aca7af84caa11011d075feb0d7a3fa",
//       "size": 3697,
//       "name": "README.md",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/README.md",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/README.md",
//       "permissions": "rw-r--r--",
//       "ext": ".md",
//       "mime": "text/markdown"
//     }
//   ],
//   "large_files": [
//     {
//       "path": "tests/integration/tests/Visual_Baseline/desktop_firefox/SecurityTips_Page-1920x1080.png",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "561aafb3738f46ffaa747114b98ff19a74537a9c",
//       "size": 3283940,
//       "name": "SecurityTips_Page-1920x1080.png",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/tests/integration/tests/Visual_Baseline/desktop_firefox/SecurityTips_Page-1920x1080.png",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/tests/integration/tests/Visual_Baseline/desktop_firefox/SecurityTips_Page-1920x1080.png",
//       "permissions": "rw-r--r--",
//       "ext": ".png",
//       "mime": "image/png"
//     },
//     {
//       "path": "tests/integration/tests/Visual_Baseline/desktop_firefox/SecurityTips_Page-headless-1920x1080.png",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "561aafb3738f46ffaa747114b98ff19a74537a9c",
//       "size": 3283940,
//       "name": "SecurityTips_Page-headless-1920x1080.png",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/tests/integration/tests/Visual_Baseline/desktop_firefox/SecurityTips_Page-headless-1920x1080.png",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/tests/integration/tests/Visual_Baseline/desktop_firefox/SecurityTips_Page-headless-1920x1080.png",
//       "permissions": "rw-r--r--",
//       "ext": ".png",
//       "mime": "image/png"
//     },
//     {
//       "path": "package-lock.json",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "d916a0f4998a00ad63b0026f7740bef213aa003c",
//       "size": 708611,
//       "name": "package-lock.json",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/package-lock.json",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/package-lock.json",
//       "permissions": "rw-r--r--",
//       "ext": ".json",
//       "mime": "application/json"
//     },
//     {
//       "path": "tests/integration/tests/Visual_Baseline/desktop_firefox/Home_Page-1920x1080.png",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "4aa641f489d29c468af775d7737ac7cdaacad7dc",
//       "size": 431788,
//       "name": "Home_Page-1920x1080.png",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/tests/integration/tests/Visual_Baseline/desktop_firefox/Home_Page-1920x1080.png",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/tests/integration/tests/Visual_Baseline/desktop_firefox/Home_Page-1920x1080.png",
//       "permissions": "rw-r--r--",
//       "ext": ".png",
//       "mime": "image/png"
//     },
//     {
//       "path": "tests/integration/tests/Visual_Baseline/desktop_firefox/Home_Page-headless-1920x1080.png",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "4aa641f489d29c468af775d7737ac7cdaacad7dc",
//       "size": 431788,
//       "name": "Home_Page-headless-1920x1080.png",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/tests/integration/tests/Visual_Baseline/desktop_firefox/Home_Page-headless-1920x1080.png",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/tests/integration/tests/Visual_Baseline/desktop_firefox/Home_Page-headless-1920x1080.png",
//       "permissions": "rw-r--r--",
//       "ext": ".png",
//       "mime": "image/png"
//     },
//     {
//       "path": "public/fonts/Inter/Inter-UI.var.woff2",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "c13e9f3ce5df335d24ffbad266b414972cc64762",
//       "size": 272268,
//       "name": "Inter-UI.var.woff2",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/public/fonts/Inter/Inter-UI.var.woff2",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/public/fonts/Inter/Inter-UI.var.woff2",
//       "permissions": "rw-r--r--",
//       "ext": ".woff2",
//       "mime": "font/woff2"
//     },
//     {
//       "path": "public/fonts/Inter/Inter-UI-italic.var.woff2",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "e01f815e53fff69b3ff43639e77cf0f6ad2d1c36",
//       "size": 199312,
//       "name": "Inter-UI-italic.var.woff2",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/public/fonts/Inter/Inter-UI-italic.var.woff2",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/public/fonts/Inter/Inter-UI-italic.var.woff2",
//       "permissions": "rw-r--r--",
//       "ext": ".woff2",
//       "mime": "font/woff2"
//     },
//     {
//       "path": "public/fonts/Inter/Inter-UI-upright.var.woff2",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "b2eed61f6243ebf1e932ce87b1b8063d2667ef26",
//       "size": 186736,
//       "name": "Inter-UI-upright.var.woff2",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/public/fonts/Inter/Inter-UI-upright.var.woff2",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/public/fonts/Inter/Inter-UI-upright.var.woff2",
//       "permissions": "rw-r--r--",
//       "ext": ".woff2",
//       "mime": "font/woff2"
//     },
//     {
//       "path": "public/fonts/Inter/Inter-UI-ExtraBoldItalic.woff",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "d53c8714749f40ed7ddf9c7619df42c276448e01",
//       "size": 134156,
//       "name": "Inter-UI-ExtraBoldItalic.woff",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/public/fonts/Inter/Inter-UI-ExtraBoldItalic.woff",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/public/fonts/Inter/Inter-UI-ExtraBoldItalic.woff",
//       "permissions": "rw-r--r--",
//       "ext": ".woff",
//       "mime": "font/woff"
//     },
//     {
//       "path": "public/fonts/Inter/Inter-UI-SemiBoldItalic.woff",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "3587629fad9b36121ed540510ff9491cb591a976",
//       "size": 133832,
//       "name": "Inter-UI-SemiBoldItalic.woff",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/public/fonts/Inter/Inter-UI-SemiBoldItalic.woff",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/public/fonts/Inter/Inter-UI-SemiBoldItalic.woff",
//       "permissions": "rw-r--r--",
//       "ext": ".woff",
//       "mime": "font/woff"
//     }
//   ],
//   "suspicious_permissions_files": [
//     {
//       "path": ".env-dist",
//       "mode": "100755",
//       "type": "blob",
//       "sha": "a471e6eda1ab04511fdd477ef76261fbc573df3f",
//       "size": 2634,
//       "name": ".env-dist",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/.env-dist",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/.env-dist",
//       "permissions": "rwxr-xr-x",
//       "ext": ""
//     },
//     {
//       "path": "public/fonts/Metropolis/Metropolis-Bold.woff2",
//       "mode": "100755",
//       "type": "blob",
//       "sha": "54bb59f65767d35360b16b0a4dd8903dcfd0e725",
//       "size": 16728,
//       "name": "Metropolis-Bold.woff2",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/public/fonts/Metropolis/Metropolis-Bold.woff2",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/public/fonts/Metropolis/Metropolis-Bold.woff2",
//       "permissions": "rwxr-xr-x",
//       "ext": ".woff2",
//       "mime": "font/woff2"
//     },
//     {
//       "path": "public/fonts/Metropolis/Metropolis-Medium.woff2",
//       "mode": "100755",
//       "type": "blob",
//       "sha": "d5aabb6e99e2d24ea957b07536078147c99f250b",
//       "size": 16496,
//       "name": "Metropolis-Medium.woff2",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/public/fonts/Metropolis/Metropolis-Medium.woff2",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/public/fonts/Metropolis/Metropolis-Medium.woff2",
//       "permissions": "rwxr-xr-x",
//       "ext": ".woff2",
//       "mime": "font/woff2"
//     },
//     {
//       "path": "public/fonts/Metropolis/Metropolis-SemiBold.woff2",
//       "mode": "100755",
//       "type": "blob",
//       "sha": "2ad1a7e00416144da43aa88a23242a38ac44a21c",
//       "size": 16576,
//       "name": "Metropolis-SemiBold.woff2",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/public/fonts/Metropolis/Metropolis-SemiBold.woff2",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/public/fonts/Metropolis/Metropolis-SemiBold.woff2",
//       "permissions": "rwxr-xr-x",
//       "ext": ".woff2",
//       "mime": "font/woff2"
//     },
//     {
//       "path": "public/img/svg/resolution-overlays/another-breach-resolved.svg",
//       "mode": "100755",
//       "type": "blob",
//       "sha": "020954383ddf03bd121bd172ef16c1febc9dab57",
//       "size": 5831,
//       "name": "another-breach-resolved.svg",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/public/img/svg/resolution-overlays/another-breach-resolved.svg",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/public/img/svg/resolution-overlays/another-breach-resolved.svg",
//       "permissions": "rwxr-xr-x",
//       "ext": ".svg",
//       "mime": "image/svg+xml"
//     },
//     {
//       "path": "public/img/svg/resolution-overlays/marked-as-resolved.svg",
//       "mode": "100755",
//       "type": "blob",
//       "sha": "21c0389db34a60d7e0359f7d97d0adbd0ec948ff",
//       "size": 4866,
//       "name": "marked-as-resolved.svg",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/public/img/svg/resolution-overlays/marked-as-resolved.svg",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/public/img/svg/resolution-overlays/marked-as-resolved.svg",
//       "permissions": "rwxr-xr-x",
//       "ext": ".svg",
//       "mime": "image/svg+xml"
//     },
//     {
//       "path": "public/img/svg/resolution-overlays/resolved-first-breach.svg",
//       "mode": "100755",
//       "type": "blob",
//       "sha": "95d41422eeeb41b6a71b900842e5f1e08d124a3c",
//       "size": 9983,
//       "name": "resolved-first-breach.svg",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/public/img/svg/resolution-overlays/resolved-first-breach.svg",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/public/img/svg/resolution-overlays/resolved-first-breach.svg",
//       "permissions": "rwxr-xr-x",
//       "ext": ".svg",
//       "mime": "image/svg+xml"
//     }
//   ],
//   "eslint_files": [
//     {
//       "path": ".eslintignore",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "43fb3eb8dd46b4a2e7bebd67e49385101d1fa308",
//       "size": 64,
//       "name": ".eslintignore",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/.eslintignore",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/.eslintignore",
//       "permissions": "rw-r--r--",
//       "ext": ""
//     },
//     {
//       "path": ".eslintrc.js",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "9ab4c134f673b93abacaf144ea5fd4bc56ac7db3",
//       "size": 1555,
//       "name": ".eslintrc.js",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/.eslintrc.js",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/.eslintrc.js",
//       "permissions": "rw-r--r--",
//       "ext": ".js",
//       "mime": "application/javascript"
//     }
//   ],
//   "packagejson_files": [
//     {
//       "path": "package.json",
//       "mode": "100644",
//       "type": "blob",
//       "sha": "673b5f49c1316c258355dcd4efa1231e4dfe8517",
//       "size": 5101,
//       "name": "package.json",
//       "html_url": "https://github.com/mozilla/blurts-server/blob/main/package.json",
//       "raw_url": "https://raw.githubusercontent.com/mozilla/blurts-server/main/package.json",
//       "permissions": "rw-r--r--",
//       "ext": ".json",
//       "mime": "application/json",
//       "pkg": {
//         "name": "blurts-server",
//         "description": "Blurts backend Server",
//         "version": "0.0.1",
//         "author": "Nihanth Subramanya",
//         "bugs": {
//           "url": "https://github.com/mozilla/blurts-server/issues"
//         },
//         "dependencies": {
//           "@sentry/node": "5.27.2",
//           "arg": "4.1.3",
//           "babel-minify": "0.5.1",
//           "basic-auth": "2.0.1",
//           "body-parser": "1.19.0",
//           "clean-css-cli": "4.3.0",
//           "client-oauth2": "4.3.2",
//           "concat": "1.0.3",
//           "connect-redis": "5.0.0",
//           "cpr": "3.0.1",
//           "csurf": "1.11.0",
//           "dotenv": "8.2.0",
//           "express": "4.17.1",
//           "express-bearer-token": "2.4.0",
//           "express-handlebars": "5.1.0",
//           "express-session": "1.17.1",
//           "fluent": "0.12.0",
//           "fluent-langneg": "0.2.0",
//           "full-icu": "1.3.1",
//           "git-rev-sync": "1.12.0",
//           "got": "8.3.2",
//           "helmet": "4.2.0",
//           "intl-pluralrules": "1.2.1",
//           "isemail": "3.2.0",
//           "knex": "0.21.12",
//           "knex-paginate": "1.2.2",
//           "lodash": "4.17.19",
//           "mozlog": "3.0.1",
//           "nodemailer": "4.7.0",
//           "nodemailer-express-handlebars": "3.3.0",
//           "npm-run-all": "4.1.5",
//           "pg": "7.18.2",
//           "redis": "3.0.2",
//           "sns-validator": "0.3.4",
//           "uuid": "3.4.0"
//         },
//         "devDependencies": {
//           "@wdio/cli": "5.23.0",
//           "@wdio/dot-reporter": "5.22.4",
//           "@wdio/firefox-profile-service": "5.21.0",
//           "@wdio/local-runner": "5.23.0",
//           "@wdio/mocha-framework": "5.23.0",
//           "@wdio/selenium-standalone-service": "5.16.10",
//           "@wdio/spec-reporter": "5.23.0",
//           "@wdio/sync": "5.23.0",
//           "chai": "4.2.0",
//           "clean-css-cli": "4.3.0",
//           "coveralls": "3.1.0",
//           "eslint": "7.12.1",
//           "eslint-plugin-node": "6.0.1",
//           "faucet": "0.0.1",
//           "htmllint-cli": "0.0.7",
//           "jest": "26.4.2",
//           "jest-tap-reporter": "1.9.0",
//           "node-mocks-http": "1.9.0",
//           "nodemon": "2.0.4",
//           "npm-audit-ci-wrapper": "3.0.1",
//           "onchange": "6.1.1",
//           "postcss-cli": "6.1.3",
//           "redis-mock": "0.52.0",
//           "stylelint": "9.10.1",
//           "stylelint-config-standard": "18.3.0",
//           "uglify-js": "3.11.5",
//           "wdio-docker-service": "2.4.0",
//           "wdio-image-comparison-service": "1.13.6",
//           "wdio-video-reporter": "2.0.1"
//         },
//         "engines": {
//           "node": "10"
//         },
//         "homepage": "https://github.com/mozilla/blurts-server",
//         "license": "MPL-2.0",
//         "main": "server.js",
//         "nodemonConfig": {
//           "ignore": [
//             "version.json"
//           ]
//         },
//         "jest": {
//           "collectCoverageFrom": [
//             "**/*.js",
//             "!coverage/**/**.js",
//             "!db/seeds/**.js",
//             "!db/migrations/**.js",
//             "!public/**/**.js",
//             "!scripts/*.js",
//             "!loadtests/**/**.js",
//             "!.eslintrc.js"
//           ],
//           "setupFilesAfterEnv": [
//             "./tests/jest.setup.js"
//           ]
//         },
//         "private": true,
//         "repository": {
//           "type": "git",
//           "url": "git+https://github.com/mozilla/blurts-server.git"
//         },
//         "scripts": {
//           "js:minify": "minify public/dist/app.min.js -o public/dist/app.min.js",
//           "js:concat": "concat -o public/dist/app.min.js public/js/*.js",
//           "js:allBreaches": "minify public/js/all-breaches/all-breaches.js -o public/dist/all-breaches.min.js",
//           "css:minify": "cleancss -o public/dist/app.min.css public/dist/app.min.css",
//           "css:concat": "concat -o public/dist/app.min.css public/css/*.css",
//           "build:css": "run-s css:concat css:minify",
//           "build:js": "run-s js:concat js:allBreaches js:minify",
//           "build:polyfills": "minify public/js/polyfills/edge.js -o public/dist/edge.min.js",
//           "watch:js": "onchange 'public/js/*.js' -- npm run build:js",
//           "watch:css": "onchange 'public/css/*.css' -- npm run build:css",
//           "watch:all": "run-p watch:css watch:js",
//           "build:dev": "run-s build:js build:css watch:all",
//           "build:all": "run-s build:js build:css build:polyfills",
//           "db:migrate": "knex migrate:latest --knexfile db/knexfile.js",
//           "docker:build": "docker build -t blurts-server .",
//           "docker:run": "docker run -p 6060:6060 blurts-server",
//           "lint": "npm-run-all lint:*",
//           "lint:js": "eslint .",
//           "lint:css": "stylelint --fix 'public/css/**/*.css'",
//           "lint:audit": "npm-audit-ci-wrapper -t 'high'",
//           "get-hashsets": "node scripts/get-hashsets",
//           "server": "NODE_ICU_DATA=./node_modules/full-icu nodemon server.js",
//           "start": "run-p build:all watch:all server",
//           "test:db:migrate": "NODE_ENV=tests knex migrate:latest --knexfile db/knexfile.js --env tests",
//           "test:tests": "NODE_ENV=tests HIBP_THROTTLE_DELAY=1000 HIBP_THROTTLE_MAX_TRIES=3 jest --runInBand --coverage tests/",
//           "test:coveralls": "cat ./coverage/lcov.info | coveralls",
//           "test:integration": "wdio tests/integration/wdio.conf.js",
//           "test:integration-headless": "MOZ_HEADLESS=1 wdio tests/integration/wdio.conf.js",
//           "test:integration-headless-ci": "MOZ_HEADLESS=1 ERROR_SHOTS=1 wdio tests/integration/wdio.conf.js",
//           "test:integration-docker": "MOZ_HEADLESS=1 wdio tests/integration/wdio.docker.js",
//           "test": "run-s test:db:migrate test:tests test:coveralls"
//         },
//         "supportedLocales": "cak,cs,cy,da,de,el,en,en-CA,en-GB,es-AR,es-CL,es-ES,es-MX,fi,fr,fy-NL,gn,hu,kab,ia,id,it,ja,nb-NO,nl,nn-NO,pt-BR,pt-PT,ro,ru,sk,sl,sq,sv-SE,tr,uk,vi,zh-CN,zh-TW"
//       }
//     }
//   ],
//   "node_modules_files": [],
//   "flake8_files": [],
//   "requirementstxt_files": []
// }
// }
