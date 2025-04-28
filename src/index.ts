import * as core from '@actions/core';
import { execSync } from 'child_process';

async function run(): Promise<void> {
  try {
    const pattern = core.getInput('pattern');
    const shouldFail = core.getInput('fail') === 'true';

    core.info(`Usando o padrão de commit: ${pattern}`);

    const commitMessage = execSync('git log -1 --pretty=%B').toString().trim();
    core.info(`Mensagem do último commit: "${commitMessage}"`);

    if (commitMessage.startsWith('Merge pull request')) {
      core.info('💡 Commit de merge detectado, ignorando a validação do padrão');
      return;
    }

    const regex = new RegExp(pattern);

    if (!regex.test(commitMessage)) {
      const message = `❌ A mensagem de commit não segue o padrão: "${pattern}" ❌`;

      if (shouldFail) {
        core.setFailed(message);
      } else {
        core.warning(message);
      }
    } else {
      core.info('✅ A mensagem de commit segue o padrão ✅');
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
