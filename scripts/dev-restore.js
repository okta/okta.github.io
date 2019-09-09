const path = require("path");
const simpleGit = require("simple-git");
const projectPath = path.join(__dirname, "..");
const postsPath = path.join(projectPath, "_source", "_posts");
console.log(projectPath, postsPath);
const git = simpleGit(projectPath);

git.checkout(postsPath);
