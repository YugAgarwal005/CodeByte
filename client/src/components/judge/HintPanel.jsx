import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { styled } from 'styled-components';
import { hintRoute, hintMetaRoute } from '../../utils/Apiroutes';

/**
 * HintPanel — progressive hint ladder shown inside ProblemPage.
 *
 * Props:
 *   slug        string  — problem slug
 *   visible     boolean — whether the panel is open
 *   onClose     fn      — called when the user closes the panel
 *
 * Behaviour:
 *   - On mount, fetches meta (how many hints exist, which level is revealed).
 *   - User clicks "Get Hint N" → fetches that level, unlocks it.
 *   - Already-revealed hints stay visible (they are returned by the API).
 *   - Sequential: can't skip from 1 to 3.
 */
function HintPanel({ slug, visible, onClose }) {
  const [hints,        setHints]        = useState([]);       // revealed hint objects
  const [totalAvail,   setTotalAvail]   = useState(0);        // how many hints exist
  const [revealedLvl,  setRevealedLvl]  = useState(0);        // highest level shown
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');

  // Fetch meta when panel opens
  useEffect(() => {
    if (!visible || !slug) return;
    (async () => {
      try {
        const { data } = await axios.get(hintMetaRoute(slug));
        if (data.status) {
          setTotalAvail(data.totalAvailable);
          setRevealedLvl(data.revealedLevel);
          // If user already revealed some hints in this session, re-fetch them
          if (data.revealedLevel > 0) {
            await revealLevel(data.revealedLevel);
          }
        }
      } catch {
        // Silently ignore — hints are optional
      }
    })();
  }, [visible, slug]);

  const revealLevel = async (level) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(hintRoute(slug), { params: { level } });
      if (data.status) {
        setHints(data.hints);
        setTotalAvail(data.totalAvailable);
        setRevealedLvl(level);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load hint.');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  const nextLevel = revealedLvl + 1;
  const canRevealMore = nextLevel <= totalAvail;

  // Label for each hint level
  const levelLabel = (lvl) => ['Nudge 💡', 'Approach 🗺️', 'Step-by-step 🔍'][lvl - 1] || `Hint ${lvl}`;

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="panel-header">
          <span className="panel-title">💡 Hints</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="panel-body">
          {/* Revealed hints */}
          {hints.length === 0 && (
            <p className="intro">
              Stuck? Hints are revealed progressively — each one goes a little deeper.
              Try to solve it with the smallest hint possible!
            </p>
          )}

          {hints.map((h) => (
            <div key={h.level} className="hint-card">
              <div className="hint-level-label">{levelLabel(h.level)}</div>
              <div className="hint-content">
                <ReactMarkdown>{h.content}</ReactMarkdown>
              </div>
            </div>
          ))}

          {/* Error */}
          {error && <p className="hint-error">{error}</p>}

          {/* Reveal next hint button */}
          {canRevealMore && (
            <button
              className="reveal-btn"
              onClick={() => revealLevel(nextLevel)}
              disabled={loading}
            >
              {loading
                ? 'Loading…'
                : `Reveal ${levelLabel(nextLevel)} (${nextLevel}/${totalAvail})`}
            </button>
          )}

          {/* All revealed */}
          {!canRevealMore && hints.length > 0 && (
            <p className="all-done">
              All hints revealed. If you're still stuck, try walking through each hint
              slowly and sketching the algorithm on paper before coding.
            </p>
          )}

          {/* No hints available */}
          {totalAvail === 0 && (
            <p className="no-hints">No hints are available for this problem yet.</p>
          )}
        </div>
      </Panel>
    </Overlay>
  );
}

// ─── Styled components ────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 60px 1rem 1rem;
`;

const Panel = styled.div`
  width: 380px;
  max-height: calc(100vh - 80px);
  background: #111;
  border: 1px solid #252525;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
  overflow: hidden;

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #1e1e1e;
    background: #0d0d0d;

    .panel-title {
      font-size: 1rem;
      font-weight: 700;
      color: #facc15;
      letter-spacing: 0.02em;
    }
    .close-btn {
      background: none;
      border: none;
      color: #555;
      font-size: 1rem;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 4px;
      &:hover { color: #ccc; background: #1a1a1a; }
    }
  }

  .panel-body {
    padding: 1.25rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;

    .intro {
      color: #666;
      font-size: 0.87rem;
      line-height: 1.6;
    }

    .hint-card {
      border: 1px solid #1e1e1e;
      border-radius: 10px;
      overflow: hidden;

      .hint-level-label {
        background: #1a1a1a;
        padding: 0.5rem 0.9rem;
        font-size: 0.78rem;
        font-weight: 700;
        color: #facc15;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .hint-content {
        padding: 0.75rem 0.9rem;
        color: #c8c8c8;
        font-size: 0.88rem;
        line-height: 1.65;

        p { margin: 0 0 0.5rem; }
        code {
          background: #1e1e2e;
          color: #a5b4fc;
          padding: 1px 5px;
          border-radius: 4px;
          font-size: 0.84em;
        }
        strong { color: #e0e0e0; }
      }
    }

    .reveal-btn {
      padding: 0.7rem 1.2rem;
      border-radius: 10px;
      border: 1.5px solid #facc15;
      background: rgba(250, 204, 21, 0.08);
      color: #facc15;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      letter-spacing: 0.02em;

      &:hover:not(:disabled) {
        background: rgba(250, 204, 21, 0.16);
        transform: translateY(-1px);
      }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .all-done {
      color: #4ade80;
      font-size: 0.84rem;
      line-height: 1.6;
      border: 1px solid #1a4731;
      border-radius: 8px;
      padding: 0.75rem;
      background: rgba(74, 222, 128, 0.06);
    }

    .hint-error {
      color: #f87171;
      font-size: 0.85rem;
    }

    .no-hints {
      color: #555;
      font-size: 0.85rem;
    }
  }

  @media (max-width: 600px) {
    width: 95vw;
  }
`;

export default HintPanel;

