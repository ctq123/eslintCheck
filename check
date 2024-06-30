import { CLIEngine } from 'eslint';
export function lintOnFiles(context) {
  const { root } = context;
  const [ err ] = createPluginSymLink(root);
  if (err) {
    return [ err ];
  }
  const linter = new CLIEngine({
    envs: [ 'browser' ],
    useEslintrc: true,
    cwd: root,
    configFile: path.join(__dirname, 'LintConfig.js'),
    ignorePattern: ['**/router-config.js']
  });
  let report = linter.executeOnFiles(['src']);
  const errorReport = CLIEngine.getErrorResults(report.results);
  const errorList = errorReport.map(item => {
    const file = path.relative(root, item.filePath);
    return {
      file,
      errorCount: item.errorCount,
      warningCount: item.warningCount,
      messages: item.messages
    };
  });
  const result = {
    errorList,
    errorCount: report.errorCount,
    warningCount: report.warningCount
  }
  return [ null, result ];
};
