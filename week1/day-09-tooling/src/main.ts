import './style.css';
 
type Language = 'javascript' | 'typescript';
type ToolName = 'prettier' | 'eslint' | 'typescript';
type Message = { kind: 'ok' | 'warn' | 'error'; text: string };
 
const toolLabels: Record<ToolName, string> = {
  prettier: 'Prettier',
  eslint: 'ESLint',
  typescript: 'TypeScript',
};
const icons = { ok: '✓', warn: '⚠', error: '❌' };
 
function getElement<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}
 
const editor = getElement<HTMLTextAreaElement>('editor');
const languageSelect = getElement<HTMLSelectElement>('language');
const resultsBox = getElement('results');
const formattedBox = getElement('formatted');
const preview = getElement<HTMLIFrameElement>('preview');
 
editor.value = `const message="Hello"
console.log( message )
const age: number = "21"`;
 
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
 
function getLanguage(): Language {
  return languageSelect.value as Language;
}
 
function getSelectedTools(): Record<ToolName, boolean> {
  const isChecked = (id: string) => getElement<HTMLInputElement>(id).checked;
  return {
    prettier: isChecked('tool-prettier'),
    eslint: isChecked('tool-eslint'),
    typescript: isChecked('tool-typescript'),
  };
}
 
async function postJson<T>(url: string, body: object): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data as T;
}
 
function showError(error: unknown) {
  const text = error instanceof Error ? error.message : String(error);
  resultsBox.innerHTML = `<p class="error">${escapeHtml(text)}</p>`;
}
 
async function getRunnableJavaScript(): Promise<string> {
  if (getLanguage() === 'javascript') return editor.value;
  const data = await postJson<{ javascript: string }>('/api/transpile', { code: editor.value });
  return data.javascript;
}
 
function buildPreviewPage(script: string): string {
  const safeScript = script.replace(/<\/script>/gi, '<\\/script>');
  return `<body style="font-family:monospace;padding:8px;color:#222"><pre id="out"></pre>
<script>
  const out = document.getElementById('out');
  console.log = (...args) => { out.textContent += args.join(' ') + '\\n'; };
  window.onerror = (message) => { out.textContent += 'Error: ' + message + '\\n'; };
<\/script>
<script>${safeScript}<\/script></body>`;
}
 
async function runCode() {
  try {
    preview.srcdoc = buildPreviewPage(await getRunnableJavaScript());
  } catch (error) {
    showError(error);
  }
}
 
function renderResults(results: Partial<Record<ToolName, Message[]>>) {
  const toolNames = Object.keys(results) as ToolName[];
  if (toolNames.length === 0) {
    resultsBox.textContent = 'No tools selected.';
    return;
  }
  resultsBox.innerHTML = toolNames
    .map((tool) => {
      const lines = (results[tool] ?? [])
        .map((m) => `<li class="${m.kind}">${icons[m.kind]} ${escapeHtml(m.text)}</li>`)
        .join('');
      return `<div class="tool-result"><h3>${toolLabels[tool]}</h3><ul>${lines}</ul></div>`;
    })
    .join('');
}
 
async function checkCode() {
  const tools = getSelectedTools();
  if (!Object.values(tools).some(Boolean)) {
    renderResults({});
    return;
  }
  resultsBox.textContent = 'Checking...';
  try {
    const data = await postJson<{ results: Partial<Record<ToolName, Message[]>> }>('/api/check', {
      code: editor.value,
      language: getLanguage(),
      tools,
    });
    renderResults(data.results);
  } catch (error) {
    showError(error);
  }
}
 
async function formatCode() {
  if (!getSelectedTools().prettier) {
    formattedBox.textContent = 'Select Prettier to format code.';
    return;
  }
  try {
    const data = await postJson<{ formatted: string }>('/api/format', {
      code: editor.value,
      language: getLanguage(),
    });
    formattedBox.textContent = data.formatted;
  } catch (error) {
    formattedBox.textContent = error instanceof Error ? error.message : 'Formatting failed';
  }
}
 
function clearAll() {
  editor.value = '';
  preview.srcdoc = '';
  resultsBox.textContent = 'Click Check to analyze your code.';
  formattedBox.textContent = 'Click Format to see the result.';
}
 
getElement('run').addEventListener('click', runCode);
getElement('check').addEventListener('click', checkCode);
getElement('format').addEventListener('click', formatCode);
getElement('clear').addEventListener('click', clearAll);