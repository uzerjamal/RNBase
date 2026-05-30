import { useAppStore } from './app.store';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      theme: 'system',
      isHydrated: false,
    });
    jest.clearAllMocks();
  });

  it('has correct initial state', () => {
    const { theme, isHydrated } = useAppStore.getState();
    expect(theme).toBe('system');
    expect(isHydrated).toBe(false);
  });

  it('sets theme to dark', () => {
    useAppStore.getState().setTheme('dark');
    expect(useAppStore.getState().theme).toBe('dark');
  });

  it('sets theme to light', () => {
    useAppStore.getState().setTheme('light');
    expect(useAppStore.getState().theme).toBe('light');
  });

  it('hydrate sets isHydrated to true', () => {
    useAppStore.getState().hydrate();
    expect(useAppStore.getState().isHydrated).toBe(true);
  });
});
