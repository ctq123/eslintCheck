import { spawn } from 'child_process';
// git clone 
execCmd(`git clone ${url} ${dir}`, {
  cwd: this.root,
  verbose: this.verbose
});
// npm run build
const cmd = ['npm run build', cmdOption].filter(Boolean).join(' ');
execCmd(cmd, options);
// 执行 shell 命令
function execCmd(cmd: string, options:any = {}): Promise<any> {
  const [ shell, ...args ] = cmd.split(' ').filter(Boolean);
  const { verbose, ...others } = options;
  return new Promise((resolve, reject) => {
    let child: any = spawn(shell, args, others);
    let stdout = '';
    let stderr = '';
    child.stdout && child.stdout.on('data', (buf: Buffer) => {
      stdout = `${stdout}${buf}`;
      if (verbose) {
        logger.info(`${buf}`);
      }
    });
    child.stderr && child.stderr.on('data', (buf: Buffer) => {
      stderr = `${stderr}${buf}`;
      if (verbose) {
        logger.error(`${buf}`);
      }
    });
    child.on('exit', (code: number) => {
      if (code !== 0) {
        const reason = stderr || 'some unknown error';
        reject(`exited with code ${code} due to ${reason}`);
      } else {
        resolve({stdout,  stderr});
      }
      child.kill();
      child = null;
    });
    child.on('error', err => {
      reject(err.message);
      child.kill();
      child = null;
    });
  });
};
