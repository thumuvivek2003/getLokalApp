import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import App from '../App';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return <App/>
}
