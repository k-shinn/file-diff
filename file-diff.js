// actions kit
const core = require('@actions/core');
const github = require('@actions/github');

try {
    const target = core.getInput("target");
    const token = core.getInput("token");    // token = ${{ github.token }}
    const octkit = github.getOctokit(token);

    const prNum = github.context.payload.pull_request.number;
    const {data} = await octkit.rest.pulls.listFiles({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: prNum
    });

    const files = data.map((v) => v.filename);
    data.forEach(v => console.log(`fileNames: ${v.filename}`));
    const fill = data.filter(v => v.filename == target);
    const result = fill.length > 0
    core.setOutput("isChanged", result)
} catch(error) {
    core.setFailed(error.message);
}