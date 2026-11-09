import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import { styled } from 'styled-components';
import { problemRoute, submissionsRoute, problemSubmissionsRoute } from '../../utils/Apiroutes';
import HintPanel from '../../components/judge/HintPanel';

// Verdict display config: colour + label for each verdict string
const VERDICT_CONFIG = {
  PENDING:    { color: '#888',    label: 'Pending…'            },
  AC:         { color: '#4ade80', label: 'Accepted ✓'          },
  WA:         { color: '#f87171', label: 'Wrong Answer ✗'      },
  TLE:        { color: '#fb923c', label: 'Time Limit Exceeded' },
  RE:         { color: '#f87171', label: 'Runtime Error'       },
  CE:         { color: '#facc15', label: 'Compilation Error'   },
};

// Monaco language IDs differ slightly from our server-side keys
const MONACO_LANG = { cpp: 'cpp', java: 'java', python: 'python' };

/**
 * ProblemPage — the full-screen coding environment.
 *
 * Layout:
 *   ┌────────────────┬──────────────────────────────┐
 *   │  Statement     │   Monaco Editor              │
 *   │  (left 40%)    │   (right 60%)                │
 *   │                ├──────────────────────────────│
 *   │                │   Results / History panel    │
 *   └────────────────┴──────────────────────────────┘
 *
 * Requires login — redirects to /login if not authenticated.
 */
function ProblemPage() {
  const { slug }    = useParams();
  const navigate    = useNavigate();

  // ── Data state ────────────────────────────────────────────────────────────
  const [problem,    setProblem]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [notFound,   setNotFound]   = useState(false);

  // ── Editor state ──────────────────────────────────────────────────────────
  const [language,   setLanguage]   = useState('cpp');
  const [code,       setCode]       = useState('');

  // ── Submission state ──────────────────────────────────────────────────────
  const [running,    setRunning]    = useState(false);   // true while waiting for judge
  const [verdict,    setVerdict]    = useState(null);    // null | 'AC' | 'WA' | ...
  const [testResults,setTestResults]= useState([]);      // per-test result objects
  const [errorOutput,setErrorOutput]= useState('');      // CE / RE message

  // ── Tabs: 'results' | 'history' ───────────────────────────────────────────
  const [activeTab,  setActiveTab]  = useState('results');
  const [history,    setHistory]    = useState([]);

  // ── First-AC celebration toast (Phase 2) ─────────────────────────────────
  const [showXpToast, setShowXpToast] = useState(false);

  // ── Hint panel (Phase 3) ─────────────────────────────────────────────────
  const [showHints, setShowHints] = useState(false);

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!localStorage.getItem('codebyte-user')) {
      navigate('/login');
    }
  }, []);

  // ── Fetch problem ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await axios.get(`${problemRoute}/${slug}`);
        if (!data.status) { setNotFound(true); return; }
        setProblem(data.problem);

        // Pre-load starter code: use requiredLanguage or first available language
        const targetLang = data.problem.requiredLanguage ||
          (data.problem.starterCode?.length > 0 ? data.problem.starterCode[0].language : 'cpp');
        setLanguage(targetLang);

        const starter = data.problem.starterCode?.find(s => s.language === targetLang) || data.problem.starterCode?.[0];
        if (starter) setCode(starter.code);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [slug]);

  // ── When language changes, load that language's starter code ─────────────
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (!problem) return;
    const starter = problem.starterCode?.find(s => s.language === lang);
    // Only replace code if the editor still has the old starter code
    // (i.e. the user hasn't written anything new yet)
    if (starter) setCode(starter.code);
  };

  // ── Fetch submission history ──────────────────────────────────────────────
  const fetchHistory = async () => {
    try {
      const { data } = await axios.get(problemSubmissionsRoute(slug));
      if (data.status) setHistory(data.submissions);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'history') fetchHistory();
  };

  // ── Submit / Run ──────────────────────────────────────────────────────────
  const handleSubmit = async (mode) => {
    // mode = 'run' (visible tests only) | 'submit' (all tests)
    if (!problem || running) return;

    setRunning(true);
    setVerdict(null);
    setTestResults([]);
    setErrorOutput('');
    setActiveTab('results');

    try {
      const { data } = await axios.post(submissionsRoute, {
        problemSlug: slug,
        language,
        code,
        mode,
      });

      if (data.status) {
        const sub = data.submission;
        setVerdict(sub.verdict);
        setTestResults(sub.testResults || []);
        setErrorOutput(sub.errorOutput || '');

        // Phase 2: celebrate first AC with a temporary XP toast
        if (mode === 'submit' && sub.verdict === 'AC' && sub.firstAC) {
          setShowXpToast(true);
          setTimeout(() => setShowXpToast(false), 4000);
        }
      }
    } catch (err) {
      setVerdict('RE');
      setErrorOutput(err.response?.data?.message || 'Network error');
    } finally {
      setRunning(false);
    }
  };

  // ── Render guards ─────────────────────────────────────────────────────────
  if (loading) return <LoadingScreen><div className="spinner"/><p>Loading problem…</p></LoadingScreen>;
  if (notFound) return <LoadingScreen><h2>Problem not found</h2><button onClick={() => navigate('/')}>← Back to problems</button></LoadingScreen>;

  const vc = verdict ? (VERDICT_CONFIG[verdict] || VERDICT_CONFIG.PENDING) : null;

  return (
    <PageWrap>
      {/* ── First-AC XP toast (Phase 2) ──────────────────────────────────── */}
      {showXpToast && (
        <XpToast>
          🎉 <strong>+50 XP</strong> — First solve! Keep it up!
        </XpToast>
      )}
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <TopBar>
        <button className="back-btn" onClick={() => navigate('/')}>← Course</button>
        <div className="problem-title">
          <span className="title">{problem.title}</span>
          <span className={`diff-badge ${problem.difficulty}`}>{problem.difficulty}</span>
        </div>
        <div className="actions">
          {/* Language selector — locked if challenge is track-specific */}
          {problem.requiredLanguage ? (
            <div className="locked-lang-badge" title={`This coding challenge is locked to ${problem.requiredLanguage === 'cpp' ? 'C++' : problem.requiredLanguage === 'java' ? 'Java' : 'Python'} for this course track.`}>
              <span className="lock-icon">🔒</span>
              <span className="lang-label">
                {problem.requiredLanguage === 'cpp' ? 'C++' : problem.requiredLanguage === 'java' ? 'Java' : 'Python'}
              </span>
            </div>
          ) : (
            <select
              className="lang-select"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          )}
          {/* Run — only visible test cases */}
          <button
            className="btn-run"
            onClick={() => handleSubmit('run')}
            disabled={running}
          >
            {running ? '…Running' : '▶ Run'}
          </button>
          {/* Submit — all test cases */}
          <button
            className="btn-submit"
            onClick={() => handleSubmit('submit')}
            disabled={running}
          >
            {running ? '…Judging' : '⬆ Submit'}
          </button>
          {/* Hint — Phase 3 */}
          <button
            className="btn-hint"
            onClick={() => setShowHints(true)}
            title="Progressive hints — try to use as few as possible!"
          >
            💡 Hint
          </button>
        </div>
      </TopBar>

      {/* ── Hint panel (Phase 3) ────────────────────────────────────────────── */}
      <HintPanel
        slug={slug}
        visible={showHints}
        onClose={() => setShowHints(false)}
      />

      {/* ── Main split panel ─────────────────────────────────────────────── */}
      <SplitPane>
        {/* Left: problem statement */}
        <StatementPane>
          <div className="statement-scroll">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {problem.statement}
            </ReactMarkdown>

            {/* Visible test cases */}
            {problem.testCases && problem.testCases.length > 0 && (
              <div className="sample-cases">
                <h3>Sample Test Cases</h3>
                {problem.testCases.map((tc, i) => (
                  <div key={i} className="tc">
                    <div className="tc-label">Example {i + 1}</div>
                    <div className="tc-row">
                      <div className="tc-col">
                        <div className="tc-head">Input</div>
                        <pre>{tc.input || '(no input)'}</pre>
                      </div>
                      <div className="tc-col">
                        <div className="tc-head">Expected Output</div>
                        <pre>{tc.expected}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </StatementPane>

        {/* Right: editor + results */}
        <EditorPane>
          {/* Monaco editor */}
          <div className="editor-wrap">
            <Editor
              height="100%"
              language={MONACO_LANG[language]}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                minimap:    { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                tabSize: language === 'python' ? 4 : 4,
              }}
            />
          </div>

          {/* Results / History panel */}
          <ResultsPane>
            {/* Tab bar */}
            <div className="tab-bar">
              <button
                className={`tab ${activeTab === 'results' ? 'active' : ''}`}
                onClick={() => handleTabChange('results')}
              >
                Results
              </button>
              <button
                className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => handleTabChange('history')}
              >
                My Submissions
              </button>

              {/* Verdict chip (shown on results tab) */}
              {activeTab === 'results' && vc && (
                <span className="verdict-chip" style={{ color: vc.color, borderColor: vc.color }}>
                  {running ? 'Judging…' : vc.label}
                </span>
              )}
            </div>

            <div className="panel-body">
              {activeTab === 'results' && (
                <>
                  {running && (
                    <div className="waiting">
                      <div className="mini-spinner" />
                      <span>Running your code…</span>
                    </div>
                  )}

                  {!running && !verdict && (
                    <p className="hint">Click <strong>Run</strong> to test with sample cases, or <strong>Submit</strong> to judge against all tests.</p>
                  )}

                  {/* ── Phase 3: First Failing Test card (shown on WA for visible tests) ── */}
                  {!running && verdict === 'WA' && (() => {
                    const firstFail = testResults.find(r => !r.passed && !r.hidden);
                    if (!firstFail) return null;
                    return (
                      <div className="first-fail-card">
                        <div className="ff-header">❌ First Failing Test</div>
                        {firstFail.input != null && (
                          <div className="ff-row">
                            <span className="ff-label">Input</span>
                            <pre>{firstFail.input || '(none)'}</pre>
                          </div>
                        )}
                        <div className="ff-row">
                          <span className="ff-label">Expected</span>
                          <pre className="expected">{firstFail.expected ?? '(hidden)'}</pre>
                        </div>
                        <div className="ff-row">
                          <span className="ff-label">Your Output</span>
                          <pre className="got">{firstFail.stdout || '(empty)'}</pre>
                        </div>
                        <button
                          className="hint-shortcut"
                          onClick={() => setShowHints(true)}
                        >
                          💡 Need a nudge? Open Hints
                        </button>
                      </div>
                    );
                  })()}

                  {/* Compilation / runtime error block */}
                  {!running && errorOutput && (
                    <div className="error-block">
                      <div className="error-label">
                        {verdict === 'CE' ? 'Compilation Error' : 'Runtime Error'}
                      </div>
                      <pre className="error-pre">{errorOutput}</pre>
                    </div>
                  )}

                  {/* Per-test result rows */}
                  {!running && testResults.length > 0 && (
                    <div className="test-results">
                      {testResults.map((r, i) => (
                        <div
                          key={i}
                          className={`test-row ${r.passed ? 'pass' : 'fail'}`}
                        >
                          <div className="test-header">
                            <span className="test-num">
                              {r.hidden ? `Test ${i + 1} (hidden)` : `Test ${i + 1}`}
                            </span>
                            <span className="test-verdict" style={{
                              color: r.passed ? '#4ade80' : '#f87171'
                            }}>
                              {r.passed ? '✓ Passed' : `✗ ${r.verdict || 'Failed'}`}
                            </span>
                            {r.time != null && (
                              <span className="test-meta">{r.time}ms</span>
                            )}
                          </div>

                          {/* For visible tests, show actual vs expected on failure */}
                          {!r.passed && !r.hidden && r.stdout !== undefined && (
                            <div className="test-detail">
                              <div className="td-row">
                                <span className="td-label">Your Output</span>
                                <pre>{r.stdout || '(empty)'}</pre>
                              </div>
                              {r.stderr && (
                                <div className="td-row">
                                  <span className="td-label">Error</span>
                                  <pre className="err">{r.stderr}</pre>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'history' && (
                <div className="history">
                  {history.length === 0 ? (
                    <p className="hint">No submissions yet for this problem.</p>
                  ) : (
                    history.map((s, i) => (
                      <div key={i} className="history-row">
                        <span className="history-verdict" style={{
                          color: VERDICT_CONFIG[s.verdict]?.color || '#888'
                        }}>
                          {s.verdict}
                        </span>
                        <span className="history-lang">{s.language}</span>
                        <span className="history-mode">{s.mode}</span>
                        <span className="history-time">
                          {new Date(s.createdAt).toLocaleString()}
                        </span>
                        {s.runtimeMs != null && (
                          <span className="history-ms">{s.runtimeMs}ms</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </ResultsPane>
        </EditorPane>
      </SplitPane>
    </PageWrap>
  );
}

// ─── Styled components ────────────────────────────────────────────────────────

const LoadingScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1rem;
  color: #666;
  background: #0f0f0f;
  .spinner {
    width: 44px; height: 44px;
    border: 3px solid #333;
    border-top-color: #1cb0f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  button {
    margin-top: 1rem;
    padding: 0.6rem 1.4rem;
    background: #1cb0f6;
    color: #fff;
    border: none; border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
  }
`;

const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0f0f0f;
  color: #e0e0e0;
  overflow: hidden;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 1.2rem;
  background: #111;
  border-bottom: 1px solid #222;
  flex-wrap: wrap;

  .back-btn {
    background: transparent;
    border: 1px solid #333;
    color: #888;
    padding: 0.35rem 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.82rem;
    white-space: nowrap;
    &:hover { border-color: #555; color: #ccc; }
  }

  .problem-title {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex: 1;
    .title { font-weight: 600; font-size: 0.95rem; }
    .diff-badge {
      padding: 0.15rem 0.55rem;
      border-radius: 10px;
      font-size: 0.72rem;
      font-weight: 600;
      border: 1px solid;
      text-transform: capitalize;
      &.easy   { color: #4ade80; border-color: #4ade8040; background: #4ade8010; }
      &.medium { color: #facc15; border-color: #facc1540; background: #facc1510; }
      &.hard   { color: #f87171; border-color: #f8717140; background: #f8717110; }
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    .lang-select {
      background: #1a1a1a;
      color: #ccc;
      border: 1px solid #333;
      border-radius: 6px;
      padding: 0.35rem 0.6rem;
      font-size: 0.83rem;
      cursor: pointer;
      outline: none;
    }
    button {
      padding: 0.4rem 1rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      transition: opacity 0.15s;
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
    .btn-run {
      background: #1e2a1e;
      color: #4ade80;
      border: 1px solid #4ade8040;
      &:hover:not(:disabled) { background: #253325; }
    }
    .btn-submit {
      background: #1cb0f6;
      color: #fff;
      &:hover:not(:disabled) { background: #0fa3e6; }
    }
    /* Phase 3: Hint button */
    .btn-hint {
      padding: 0.4rem 1rem;
      border-radius: 8px;
      border: 1px solid #facc1560;
      background: rgba(250,204,21,0.07);
      color: #facc15;
      font-size: 0.84rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      &:hover { background: rgba(250,204,21,0.14); border-color: #facc15; }
    }
  }
`;

const SplitPane = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StatementPane = styled.div`
  width: 40%;
  min-width: 280px;
  border-right: 1px solid #222;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .statement-scroll {
    overflow-y: auto;
    padding: 1.5rem;
    flex: 1;
    /* Style markdown output */
    h2 { font-size: 1.3rem; margin-top: 0; color: #fff; }
    h3 { font-size: 1rem; color: #ccc; margin-top: 1.5rem; }
    p  { line-height: 1.7; color: #aaa; }
    code {
      background: #1a1a1a;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-family: 'Fira Code', monospace;
      font-size: 0.85em;
      color: #e0e0e0;
    }
    pre {
      background: #141414;
      border: 1px solid #222;
      border-radius: 8px;
      padding: 1rem;
      overflow-x: auto;
      code { background: transparent; padding: 0; }
    }
    strong { color: #e0e0e0; }
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
  }

  .sample-cases {
    margin-top: 1.5rem;
    border-top: 1px solid #222;
    padding-top: 1rem;
    h3 { margin-top: 0; }
    .tc {
      margin-bottom: 1rem;
      border: 1px solid #222;
      border-radius: 8px;
      overflow: hidden;
      .tc-label {
        padding: 0.4rem 0.8rem;
        background: #161616;
        font-size: 0.78rem;
        color: #555;
        border-bottom: 1px solid #222;
      }
      .tc-row { display: flex; }
      .tc-col {
        flex: 1;
        padding: 0.6rem 0.8rem;
        &:first-child { border-right: 1px solid #222; }
        .tc-head { font-size: 0.72rem; color: #555; margin-bottom: 0.4rem; text-transform: uppercase; }
        pre {
          margin: 0;
          background: transparent;
          border: none;
          padding: 0;
          font-size: 0.83rem;
          color: #bbb;
          white-space: pre-wrap;
        }
      }
    }
  }

  @media (max-width: 768px) { width: 100%; border-right: none; border-bottom: 1px solid #222; max-height: 40vh; }
`;

const EditorPane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .editor-wrap {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
`;

const ResultsPane = styled.div`
  height: 220px;
  border-top: 1px solid #222;
  display: flex;
  flex-direction: column;
  background: #0f0f0f;

  .tab-bar {
    display: flex;
    align-items: center;
    gap: 0;
    background: #111;
    border-bottom: 1px solid #222;
    padding: 0 1rem;
    flex-shrink: 0;
    .tab {
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: #555;
      padding: 0.6rem 1rem;
      cursor: pointer;
      font-size: 0.83rem;
      transition: color 0.15s;
      &:hover { color: #aaa; }
      &.active { color: #1cb0f6; border-bottom-color: #1cb0f6; }
    }
    .verdict-chip {
      margin-left: auto;
      padding: 0.2rem 0.75rem;
      border-radius: 20px;
      border: 1px solid;
      font-size: 0.8rem;
      font-weight: 700;
    }
  }

  .panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 0.75rem 1rem;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
  }

  .hint { color: #444; font-size: 0.88rem; margin: 0; }

  .waiting {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #888;
    font-size: 0.88rem;
    .mini-spinner {
      width: 16px; height: 16px;
      border: 2px solid #333;
      border-top-color: #1cb0f6;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  }

  .error-block {
    background: #1a0a0a;
    border: 1px solid #4a1a1a;
    border-radius: 8px;
    padding: 0.75rem;
    .error-label { color: #f87171; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem; }
    .error-pre { margin: 0; font-size: 0.8rem; color: #f87171; white-space: pre-wrap; word-break: break-all; }
  }

  .test-results { display: flex; flex-direction: column; gap: 0.5rem; }
  .test-row {
    border: 1px solid #222;
    border-radius: 8px;
    overflow: hidden;
    &.pass { border-color: #1a3a1a; }
    &.fail { border-color: #3a1a1a; }
    .test-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.45rem 0.75rem;
      background: #111;
      .test-num { font-size: 0.8rem; color: #666; }
      .test-verdict { font-size: 0.8rem; font-weight: 600; }
      .test-meta { margin-left: auto; font-size: 0.75rem; color: #555; }
    }
    .test-detail {
      padding: 0.5rem 0.75rem;
      .td-row { margin-bottom: 0.4rem; }
      .td-label { font-size: 0.72rem; color: #555; text-transform: uppercase; display: block; margin-bottom: 0.2rem; }
      pre { margin: 0; font-size: 0.8rem; color: #bbb; background: #141414; padding: 0.4rem 0.6rem; border-radius: 4px; white-space: pre-wrap; }
      pre.err { color: #f87171; }
    }
  }

  .history { display: flex; flex-direction: column; gap: 0.4rem; }
  .history-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid #1a1a1a;
    border-radius: 8px;
    font-size: 0.82rem;
    &:hover { background: #111; }
    .history-verdict { font-weight: 700; min-width: 50px; }
    .history-lang { color: #666; text-transform: capitalize; }
    .history-mode { color: #444; font-size: 0.75rem; }
    .history-time { margin-left: auto; color: #444; font-size: 0.78rem; }
    .history-ms { color: #555; font-size: 0.78rem; }
  }

  /* ── Phase 3: First Failing Test card ───────────────────────────────────── */
  .first-fail-card {
    border: 1px solid #3a1a1a;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 0.5rem;

    .ff-header {
      background: #1a0808;
      padding: 0.5rem 0.9rem;
      font-size: 0.82rem;
      font-weight: 700;
      color: #f87171;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .ff-row {
      padding: 0.5rem 0.9rem;
      border-top: 1px solid #2a1a1a;
      .ff-label {
        display: block;
        font-size: 0.72rem;
        color: #555;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.25rem;
      }
      pre {
        margin: 0;
        font-size: 0.82rem;
        color: #ccc;
        background: #141414;
        padding: 0.4rem 0.6rem;
        border-radius: 6px;
        white-space: pre-wrap;
        word-break: break-all;
        &.expected { color: #4ade80; }
        &.got      { color: #f87171; }
      }
    }
    .hint-shortcut {
      display: block;
      width: 100%;
      padding: 0.6rem 0.9rem;
      border: none;
      border-top: 1px solid #2a1a1a;
      background: rgba(250,204,21,0.05);
      color: #facc15;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      text-align: left;
      transition: background 0.15s;
      &:hover { background: rgba(250,204,21,0.12); }
    }
  }
`;

// ── XP Toast — slides in from the top when the user gets their first AC ───────
const XpToast = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #16a34a, #4ade80);
  color: #fff;
  padding: 14px 28px;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 4px 24px rgba(74, 222, 128, 0.4);
  z-index: 9999;
  animation: slideDown 0.4s ease, fadeOut 0.5s ease 3.5s forwards;

  @keyframes slideDown {
    from { top: -60px; opacity: 0; }
    to   { top: 20px;  opacity: 1; }
  }
  @keyframes fadeOut {
    to { opacity: 0; pointer-events: none; }
  }
`;

export default ProblemPage;
