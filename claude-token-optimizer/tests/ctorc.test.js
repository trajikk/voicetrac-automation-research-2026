import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LOADER = path.join(ROOT, 'templates', 'hooks', 'lib', 'load-ctorc.sh');

// Runs a tiny bash script that sources the loader then echoes the vars we care about.
function loadCtorc(cwd, env = {}, vars = ['CTO_WARN_TOKENS', 'CTO_BLOCK_TOKENS', 'CTO_LEARNINGS_DIR']) {
  const echoLines = vars.map((v) => `echo "${v}=$${v}"`).join('\n');
  const script = `source "${LOADER}"\n${echoLines}\n`;
  const result = spawnSync('bash', ['-c', script], {
    cwd,
    env: { ...process.env, ...env },
    encoding: 'utf8',
  });
  const out = {};
  for (const line of result.stdout.split('\n')) {
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    out[line.slice(0, eq)] = line.slice(eq + 1);
  }
  return { code: result.status, stderr: result.stderr, vars: out };
}

describe('load-ctorc.sh', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cto-ctorc-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it('leaves vars unset when no .ctorc present and no env set', () => {
    const { vars } = loadCtorc(tmpDir);
    assert.strictEqual(vars.CTO_WARN_TOKENS, '');
  });

  it('reads KEY=value pairs from .ctorc at cwd root', () => {
    fs.writeFileSync(path.join(tmpDir, '.ctorc'), 'CTO_WARN_TOKENS=1500\nCTO_BLOCK_TOKENS=6000\n');
    const { vars } = loadCtorc(tmpDir);
    assert.strictEqual(vars.CTO_WARN_TOKENS, '1500');
    assert.strictEqual(vars.CTO_BLOCK_TOKENS, '6000');
  });

  it('env var overrides .ctorc value (env > file precedence)', () => {
    fs.writeFileSync(path.join(tmpDir, '.ctorc'), 'CTO_WARN_TOKENS=1500\n');
    const { vars } = loadCtorc(tmpDir, { CTO_WARN_TOKENS: '9999' });
    assert.strictEqual(vars.CTO_WARN_TOKENS, '9999');
  });

  it('ignores blank lines and comment lines starting with #', () => {
    fs.writeFileSync(path.join(tmpDir, '.ctorc'), '# comment\n\nCTO_WARN_TOKENS=1500\n');
    const { vars } = loadCtorc(tmpDir);
    assert.strictEqual(vars.CTO_WARN_TOKENS, '1500');
  });

  it('ignores unknown keys not in the recognized allowlist', () => {
    fs.writeFileSync(path.join(tmpDir, '.ctorc'), 'CTO_WARN_TOKENS=1500\nCTO_EVIL_INJECT=rm -rf /\n');
    const { vars } = loadCtorc(tmpDir, {}, ['CTO_WARN_TOKENS', 'CTO_EVIL_INJECT']);
    assert.strictEqual(vars.CTO_WARN_TOKENS, '1500');
    assert.strictEqual(vars.CTO_EVIL_INJECT, '');
  });

  it('does nothing (no error) when .ctorc is absent', () => {
    const { code } = loadCtorc(tmpDir);
    assert.strictEqual(code, 0);
  });
});
