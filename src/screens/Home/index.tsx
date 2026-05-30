import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button, Screen, Text } from '@/components';
import { useAppStore } from '@/store/app.store';
import { spacing } from '@/theme/spacing';

export function HomeScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const { theme, setTheme } = useAppStore();

  function handleToggleTheme(): void {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="h2">{t('home.title')}</Text>
        <Text variant="body" color="secondary" style={styles.subtitle}>
          {t('home.subtitle')}
        </Text>
        <Button
          label={t(theme === 'dark' ? 'home.switchToLight' : 'home.switchToDark')}
          onPress={handleToggleTheme}
          style={styles.button}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: spacing[4],
  },
  container: {
    alignItems: 'center',
    flex: 1,
    gap: spacing[4],
    justifyContent: 'center',
    padding: spacing[6],
  },
  subtitle: {
    textAlign: 'center',
  },
});
