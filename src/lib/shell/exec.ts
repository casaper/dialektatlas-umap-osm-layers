import { exec as cpExec, ExecOptionsWithStringEncoding } from 'child_process';

import { projectRoot } from '../../paths';
import { isArray } from '../typecheck';

export const exec = (
  cmd: string | string[],
  {
    cwd = projectRoot,
    encoding = 'utf-8',
    ...execOptions
  }: ExecOptionsWithStringEncoding = {}
) =>
  new Promise<{ stdout: string; stderr: string }>((resolve, reject) =>
    cpExec(
      isArray(cmd) ? cmd.join(' ') : cmd,
      { cwd, encoding, ...execOptions },
      (error, stdout, stderr) => {
        const outVals = {
          stdout: (stdout ?? '').trim(),
          stderr: (stderr ?? '').trim(),
        };
        if (error) {
          if (error instanceof Error) {
            error.cause = {
              ...(error.cause ?? {}),
              execFnEnv: {
                ...outVals,
                cmd,
                options: { ...execOptions, cwd, encoding },
              },
            };
          }
          reject({ error, ...outVals });
        }
        resolve(outVals);
      }
    )
  );
