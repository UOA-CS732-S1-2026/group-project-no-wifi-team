import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QuarterlySummary } from './QuarterSummary';

// Mock motion/react to avoid animation delays and visibility issues during testing
vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();
  const { forwardRef, createElement } = await import('react');
  const noAnim = (tag: string) =>
    forwardRef(({ children, initial: _i, animate: _a, exit: _e, transition: _t, whileHover: _wh, whileTap: _wt, ...rest }: any, ref: any) => {
      return createElement(tag, { ...rest, ref }, children);
    });
  return {
    ...actual,
    motion: new Proxy(actual.motion, {
      get: (_target, key: string) => noAnim(key),
    }),
    AnimatePresence: ({ children }: any) => children,
  };
});

// Mock MusicContext
vi.mock('../contexts/MusicContext', () => ({
  useMusicContext: () => ({
    musicEnabled: true,
    setMusicEnabled: vi.fn(),
    sfxEnabled: true,
    setSfxEnabled: vi.fn(),
  }),
}));

// Mock CountUp to render the target value immediately
vi.mock('../utils/CountUp', () => ({
  CountUp: ({ to }: { to: number }) => <span>{to}</span>,
}));

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('QuarterlySummary Screen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSummaryData = {
    quarterName: 'Autumn Quarter',
    quarterIndex: 1,
    tasksCompleted: 5,
    totalTasks: 6,
    quartersRemaining: 3,
    stats: [
      { label: 'Intelligence', value: 10, delta: 2 },
      { label: 'Health', value: 8, delta: -1 },
      { label: 'Wealth', value: 5, delta: 0 },
    ],
  };

  it('renders correctly with data passed from navigation state', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/quarterly-summary', state: mockSummaryData }]}>
        <QuarterlySummary />
      </MemoryRouter>
    );

    expect(screen.getByText('Autumn Quarter')).toBeInTheDocument();
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText(/Graduation in/i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // quartersRemaining
    expect(screen.getByText('5')).toBeInTheDocument(); // tasksCompleted
    expect(screen.getByText('/ 6')).toBeInTheDocument();
    expect(screen.getByText('Intelligence')).toBeInTheDocument();
  });

  it('renders special message and button when it is the final graduation assessment', () => {
    const finalData = { ...mockSummaryData, quartersRemaining: 0 };
    render(
      <MemoryRouter initialEntries={[{ pathname: '/quarterly-summary', state: finalData }]}>
        <QuarterlySummary />
      </MemoryRouter>
    );

    expect(screen.getByText('Graduation Assessment Time!')).toBeInTheDocument();
    expect(screen.getByAltText('View Ending')).toBeInTheDocument();
  });

  it('navigates to next-quarter when the action button is clicked', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/quarterly-summary', state: mockSummaryData }]}>
        <QuarterlySummary />
      </MemoryRouter>
    );

    const img = screen.getByAltText(/Next Quarter/i);
    const btn = img.closest('button');
    if (btn) fireEvent.click(btn);
    
    expect(mockNavigate).toHaveBeenCalledWith('/next-quarter');
  });

  it('falls back to default values when no navigation state is provided', () => {
    render(
      <MemoryRouter>
        <QuarterlySummary />
      </MemoryRouter>
    );
    
    expect(screen.getByText('First Quarter')).toBeInTheDocument();
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText(/Graduation in/i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // 默认 4 - 1 = 3
  });
});