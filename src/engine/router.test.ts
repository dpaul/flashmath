import { describe, it, expect } from 'vitest';
import { parseRouteFromLocation, getHashForRoute, AppRoute } from './router';

describe('Router & URL Navigation', () => {
  it('parses empty or root hash as mode-select', () => {
    expect(parseRouteFromLocation({ hash: '', pathname: '/' })).toEqual({
      view: 'mode-select',
    });
    expect(parseRouteFromLocation({ hash: '#/', pathname: '/' })).toEqual({
      view: 'mode-select',
    });
    expect(parseRouteFromLocation({ hash: '#', pathname: '/' })).toEqual({
      view: 'mode-select',
    });
  });

  it('parses math routes properly', () => {
    expect(parseRouteFromLocation({ hash: '#/math', pathname: '/' })).toEqual({
      view: 'math',
    });
    expect(parseRouteFromLocation({ hash: '#/math/practice', pathname: '/' })).toEqual({
      view: 'math-practice',
    });
    expect(parseRouteFromLocation({ hash: '#/math-practice', pathname: '/' })).toEqual({
      view: 'math-practice',
    });
    expect(parseRouteFromLocation({ hash: '#/math/history', pathname: '/' })).toEqual({
      view: 'history',
    });
    expect(parseRouteFromLocation({ hash: '#/history', pathname: '/' })).toEqual({
      view: 'history',
    });
  });

  it('parses spelling routes and level query parameters', () => {
    expect(parseRouteFromLocation({ hash: '#/spelling', pathname: '/' })).toEqual({
      view: 'spelling-levels',
    });
    expect(
      parseRouteFromLocation({ hash: '#/spelling/practice?level=2026-09-12', pathname: '/' })
    ).toEqual({
      view: 'spelling-practice',
      levelId: '2026-09-12',
    });
    expect(
      parseRouteFromLocation({ hash: '#/spelling/practice/level-1', pathname: '/' })
    ).toEqual({
      view: 'spelling-practice',
      levelId: 'level-1',
    });
    expect(
      parseRouteFromLocation({ hash: '#/spelling/history?level=2026-09-15', pathname: '/' })
    ).toEqual({
      view: 'spelling-history',
      levelId: '2026-09-15',
    });
  });

  it('falls back to pathname when hash is empty', () => {
    expect(parseRouteFromLocation({ hash: '', pathname: '/math' })).toEqual({
      view: 'math',
    });
    expect(parseRouteFromLocation({ hash: '', pathname: '/flashmath/spelling' })).toEqual({
      view: 'spelling-levels',
    });
  });

  it('generates canonical hash strings for routes', () => {
    expect(getHashForRoute({ view: 'mode-select' })).toBe('#/');
    expect(getHashForRoute({ view: 'math' })).toBe('#/math');
    expect(getHashForRoute({ view: 'math-practice' })).toBe('#/math/practice');
    expect(getHashForRoute({ view: 'history' })).toBe('#/math/history');
    expect(getHashForRoute({ view: 'spelling-levels' })).toBe('#/spelling');
    expect(getHashForRoute({ view: 'spelling-practice', levelId: '2026-09-12' })).toBe(
      '#/spelling/practice?level=2026-09-12'
    );
    expect(getHashForRoute({ view: 'spelling-history', levelId: '2026-09-15' })).toBe(
      '#/spelling/history?level=2026-09-15'
    );
  });

  it('round-trips all routes correctly', () => {
    const routes: AppRoute[] = [
      { view: 'mode-select' },
      { view: 'math' },
      { view: 'math-practice' },
      { view: 'history' },
      { view: 'spelling-levels' },
      { view: 'spelling-practice', levelId: 'roots' },
      { view: 'spelling-history', levelId: 'most-missed' },
    ];

    for (const route of routes) {
      const hash = getHashForRoute(route);
      const parsed = parseRouteFromLocation({ hash, pathname: '/' });
      expect(parsed).toEqual(route);
    }
  });
});
