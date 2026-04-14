import { Redirect } from 'expo-router';
import { useAuth } from './context/auth';

export default function Index() {
  const { role } = useAuth();
  return <Redirect href={role ? '/(tabs)' : '/login'} />;
}
