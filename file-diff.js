// actions kit, githubが用意してくれている便利なTool群
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const target = core.getInput("target"); // toolkitを使用してInputを取得
        const token = core.getInput("token");    // token = ${{ github.token }}
        const octkit = github.getOctokit(token); // toolkitを使用してGithubのRestApi用Client取得

        const prNum = github.context.payload.pull_request.number; // PRのNumber取得
        const { data } = await octkit.rest.pulls.listFiles({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            pull_number: prNum
        }); // APIからPRのファイルリストを取得

        const files = data.map((v) => v.filename);
        data.forEach(v => console.log(`fileNames: ${v.filename}`));

        const fill = data.filter(v => v.filename == target);
        const result = fill.length > 0
        core.setOutput("isChanged", result) // outputを設定

        let message = ``
        if (result == true) {
            message = `更新されています💯 [link-test](https://github.com/`
        } else {
            message = `更新されていません🙅‍♀️ [link-test](https://github.com/)`
        }

        console.log(`github.serverUrl: ${github.serverUrl}`)
        console.log(`github.repo: ${github.repo}`)
        console.log(`github.ref: ${github.ref}`)

        console.log(`github.context.serverUrl: ${github.context.serverUrl}`)
        console.log(`github.context.repo: ${github.context.repo}`)
        console.log(`github.context.ref: ${github.context.ref}`)

        console.log(`github.context.payload.serverUrl: ${github.context.payload.serverUrl}`)
        console.log(`github.context.payload.repo: ${github.context.payload.repo}`)
        console.log(`github.context.payload.ref: ${github.context.payload.ref}`)
        console.log(`github.context.payload.repository.html_url: ${github.context.payload.repository.html_url}`)
        console.log(`github.context.payload.html_url: ${github.context.payload.html_url}`)

        await octkit.rest.issues.createComment({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: prNum,
            body: `${target} は ${message}`
        }) // APIでPRにComment
    } catch (error) {
        core.setFailed(error.message);
    }
}
run();
