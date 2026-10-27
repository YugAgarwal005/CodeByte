import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { styled } from 'styled-components';
import { problemsRoute } from '../../utils/Apiroutes';

/**
 * ProblemList — displays all available coding problems as a table.
 * Renders inside the CodeByte layout (SideNavbar is visible).
 * Requires login (redirects to /login if not authenticated).
 */
function ProblemList() {
  const navigate   = useNavigate();
  const [problems, setProblems]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [filter,   setFilter]     = useState('all'); // 'all' | 'easy' | 'medium' | 'hard'
  const [search,   setSearch]     = useState('');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!localStorage.getItem('codebyte-user')) {
      navigate('/login');
      return;
    }
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const { data } = await axios.get(problemsRoute);
      if (data.status) setProblems(data.problems);
    } catch (err) {
      console.error('Failed to fetch problems:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter by difficulty and search query
  const visible = problems.filter((p) => {
    const matchesDiff   = filter === 'all' || p.difficulty === filter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          (p.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesDiff && matchesSearch;
  });

  const difficultyColor = (d) => {
    if (d === 'easy')   return '#4ade80'; // green
    if (d === 'medium') return '#facc15'; // yellow
    return '#f87171';                     // red = hard
  };

  if (loading) {
    return (
      <Container>
        <div className="loading">
          <div className="spinner" />
          <p>Loading problems…</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* ── Page header ───────────────────────────────────── */}
      <div className="header">
        <div className="title-block">
          <h1>Practice</h1>
          <p className="sub">Sharpen your skills with coding challenges</p>
        </div>
        <div className="stats">
          <span className="stat easy">{problems.filter(p=>p.difficulty==='easy').length} Easy</span>
          <span className="stat medium">{problems.filter(p=>p.difficulty==='medium').length} Medium</span>
          <span className="stat hard">{problems.filter(p=>p.difficulty==='hard').length} Hard</span>
        </div>
      </div>

      {/* ── Filters ───────────────────────────────────────── */}
      <div className="controls">
        <input
          className="search"
          placeholder="Search by title or tag…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-buttons">
          {['all','easy','medium','hard'].map(d => (
            <button
              key={d}
              className={`filter-btn ${filter === d ? 'active' : ''} ${d}`}
              onClick={() => setFilter(d)}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Problem table ─────────────────────────────────── */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={4} style={{textAlign:'center', padding:'2rem', color:'#555'}}>No problems match your filter.</td></tr>
            ) : (
              visible.map((p, i) => (
                <tr
                  key={p.slug}
                  className="problem-row"
                  onClick={() => navigate(`/problems/${p.slug}`)}
                >
                  <td className="num">{i + 1}</td>
                  <td className="title-cell">{p.title}</td>
                  <td>
                    <span
                      className="badge"
                      style={{ color: difficultyColor(p.difficulty), borderColor: difficultyColor(p.difficulty) }}
                    >
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="tags-cell">
                    {(p.tags || []).slice(0, 3).map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
}

// ─── Styled component ─────────────────────────────────────────────────────────

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem 2.5rem;
  color: #e0e0e0;
  box-sizing: border-box;
  max-width: 1000px;

  /* loading state */
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    gap: 1rem;
    color: #555;
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid #333;
      border-top-color: #1cb0f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  }

  /* header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
    border-bottom: 1px solid #222;
    padding-bottom: 1.5rem;
    h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.25rem;
      background: linear-gradient(90deg, #1cb0f6, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .sub { margin: 0; color: #555; font-size: 0.9rem; }
  }
  .stats {
    display: flex; gap: 0.75rem; flex-wrap: wrap;
    .stat {
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      border: 1px solid;
    }
    .easy   { color: #4ade80; border-color: #4ade8040; background: #4ade8010; }
    .medium { color: #facc15; border-color: #facc1540; background: #facc1510; }
    .hard   { color: #f87171; border-color: #f8717140; background: #f8717110; }
  }

  /* controls */
  .controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    align-items: center;
    .search {
      flex: 1;
      min-width: 200px;
      background: #111;
      border: 1px solid #333;
      border-radius: 8px;
      color: #ddd;
      padding: 0.6rem 1rem;
      font-size: 0.9rem;
      outline: none;
      &:focus { border-color: #1cb0f6; }
    }
    .filter-buttons { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .filter-btn {
      padding: 0.4rem 1rem;
      border-radius: 20px;
      border: 1px solid #333;
      background: transparent;
      color: #777;
      font-size: 0.82rem;
      cursor: pointer;
      transition: all 0.15s;
      &:hover { border-color: #555; color: #ccc; }
      &.active { color: #fff; }
      &.active.all    { border-color: #1cb0f6; background: #1cb0f620; color: #1cb0f6; }
      &.active.easy   { border-color: #4ade80; background: #4ade8020; color: #4ade80; }
      &.active.medium { border-color: #facc15; background: #facc1520; color: #facc15; }
      &.active.hard   { border-color: #f87171; background: #f8717120; color: #f87171; }
    }
  }

  /* table */
  .table-wrap {
    border: 1px solid #222;
    border-radius: 12px;
    overflow: hidden;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.93rem;
    th {
      background: #111;
      padding: 0.85rem 1rem;
      text-align: left;
      color: #555;
      font-weight: 600;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #222;
    }
    .problem-row {
      cursor: pointer;
      transition: background 0.12s;
      &:hover { background: #1a1a1a; }
      td { padding: 0.9rem 1rem; border-bottom: 1px solid #1a1a1a; vertical-align: middle; }
      &:last-child td { border-bottom: none; }
    }
    .num { color: #444; width: 44px; font-size: 0.8rem; }
    .title-cell { font-weight: 500; color: #e0e0e0; }
    .badge {
      padding: 0.2rem 0.65rem;
      border-radius: 12px;
      border: 1px solid;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    .tags-cell { display: flex; gap: 0.4rem; flex-wrap: wrap; }
    .tag {
      background: #1e1e2e;
      color: #6366f1;
      border: 1px solid #2d2d4e;
      border-radius: 6px;
      padding: 0.15rem 0.5rem;
      font-size: 0.72rem;
    }
  }

  @media (max-width: 600px) {
    padding: 1rem;
    .header { flex-direction: column; }
    table th:nth-child(4), table td:nth-child(4) { display: none; }
  }
`;

export default ProblemList;
