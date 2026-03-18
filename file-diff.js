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

        // 1ページずつ取得し、見つかったら早期終了
        let result = false;
        let page = 1;
        while (true) {
            const { data } = await octkit.rest.pulls.listFiles({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                pull_number: prNum,
                per_page: 30,
                page: page
            });
            if (data.length === 0) break;

            data.forEach(v => console.log(`fileNames: ${v.filename}`));
            if (data.some(v => v.filename === target)) {
                result = true;
                break;
            }
            page++;
        }
        core.setOutput("isChanged", result); // outputを設定

        if (!result) {
            const filePath = `${github.context.payload.repository.html_url}/blob/${head_ref}/${target}`
            console.log(`filePath: ${filePath}`)
            const message = `[${target}](${filePath}) が更新されていません🙅‍♀️`

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
