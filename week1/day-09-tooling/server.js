// Local-only server. It runs real Prettier, ESLint and tsc on code you type.
// Do NOT deploy this publicly.
import express from 'express';
import ts from 'typescript';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

const execAsync = promisify(exec);
const tempFolder = path.resolve('.codebox-tmp');
const app = express();
app.use(express.json({ limit: '1mb' }));

function getExtension(language) {
  return language === 'typescript' ? 'ts' : 'js';
}

// Never throws: returns whatever the command printed.
async function runCommand(command) {
  try {
    const { stdout, stderr } = await execAsync(command, { timeout: 30000 });
    return { stdout, stderr, failed: false };
  } catch (error) {
    return { stdout: error.stdout || '', stderr: error.stderr || error.message, failed: true };
  }
}

async function withTempFile(code, language, useFile) {
  await mkdir(tempFolder, { recursive: true });
  const filePath = path.join(tempFolder, `snippet-${randomUUID()}.${getExtension(language)}`);
  await writeFile(filePath, code);
  try {
    return await useFile(filePath);
  } finally {
    await rm(filePath, { force: true });
  }
}

const message = (kind, text) => ({ kind, text });

async function formatCode(code, language) {
  return withTempFile(code, language, async (file) => {
    const result = await runCommand(`npx prettier "${file}"`);
    if (result.failed) throw new Error(result.stderr.trim());
    return result.stdout;
  });
}

async function checkPrettier(code, language) {
  try {
    const formatted = await formatCode(code, language);
    if (formatted === code) return [message('ok', 'Code is already formatted')];
    return [message('warn', 'Code is not formatted. Click Format to see the fix.')];
  } catch (error) {
    return [message('error', error.message)];
  }
}

async function checkEslint(code, language) {
  return withTempFile(code, language, async (file) => {
    const result = await runCommand(`npx eslint --format json "${file}"`);
    let report;
    try {
      report = JSON.parse(result.stdout);
    } catch {
      return [message('error', result.stderr.trim() || 'ESLint did not return a report')];
    }
    const problems = report[0].messages.map((problem) => {
      const kind = problem.severity === 2 ? 'error' : 'warn';
      const rule = problem.ruleId ? ` (${problem.ruleId})` : '';
      return message(kind, `${problem.line}:${problem.column} ${problem.message}${rule}`);
    });
    return problems.length ? problems : [message('ok', 'No problems found')];
  });
}

async function checkTypeScript(code, language) {
  if (language !== 'typescript') {
    return [message('warn', 'Switch the language to TypeScript to type check.')];
  }
  return withTempFile(code, language, async (file) => {
    const flags = '--noEmit --strict --target ES2020 --lib ES2020,DOM --pretty false';
    const result = await runCommand(`npx tsc ${flags} "${file}"`);
    const lines = result.stdout.split('\n').filter((line) => line.includes('error TS'));
    if (!lines.length) return [message('ok', 'No type errors')];
    // "file.ts(1,7): error TS2322: Type ..." -> "1:7 Type ..."
    return lines.map((line) => {
      const match = line.match(/\((\d+),(\d+)\): error (TS\d+): (.*)/);
      return message('error', match ? `${match[1]}:${match[2]} ${match[4]} (${match[3]})` : line);
    });
  });
}

app.post('/api/format', async (req, res) => {
  const { code = '', language = 'javascript' } = req.body;
  try {
    res.json({ formatted: await formatCode(code, language) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/check', async (req, res) => {
  const { code = '', language = 'javascript', tools = {} } = req.body;
  const results = {};
  if (tools.prettier) results.prettier = await checkPrettier(code, language);
  if (tools.eslint) results.eslint = await checkEslint(code, language);
  if (tools.typescript) results.typescript = await checkTypeScript(code, language);
  res.json({ results });
});

// Lets the preview run TypeScript by stripping the types first.
app.post('/api/transpile', (req, res) => {
  const { code = '' } = req.body;
  res.json({ javascript: ts.transpileModule(code, { compilerOptions: { target: 'ES2020' } }).outputText });
});

app.listen(3001, () => console.log('CodeBox API on http://localhost:3001'));