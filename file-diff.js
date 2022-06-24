// actions kit, githubが用意してくれている便利なTool群
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const target = core.getInput("target"); // toolkitを使用してInputを取得
        const token = core.getInput("token");    // token = ${{ github.token }}
        const octkit = github.getOctokit(token); // toolkitを使用してGithubのRestApi用Client取得
        const head_ref = core.getInput("head_ref");

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

        if (result == false) {
            const filePath = `${github.context.payload.repository.html_url}/blob/${head_ref}/${target}`
            console.log(`filePath: ${filePath}`)
            const message = `[${target}](${filePath})が更新されていません🙅‍♀️`

            await octkit.rest.issues.createComment({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                issue_number: prNum,
                body: message
            }) // APIでPRにComment
            core.setFailed(message);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}
run();
