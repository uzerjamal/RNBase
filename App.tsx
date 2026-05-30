import './src/i18n';

import * as Sentry from '@sentry/react-native';
import React, { useEffect } from 'react';
import Config from 'react-native-config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from '@/navigation';
import { useAppStore } from '@/store/app.store';

Sentry.init({
  dsn: Config.SENTRY_DSN ?? '',
  enabled: !__DEV__,
  tracesSampleRate: 0.2,
});

const gestureHandlerStyle = { flex: 1 };

function App(): React.JSX.Element {
  const hydrate = useAppStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <GestureHandlerRootView style={gestureHandlerStyle}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
