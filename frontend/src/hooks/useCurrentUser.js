// src/hooks/useCurrentUser.js
import { useSelector } from 'react-redux';

export default function useCurrentUser() {
  // your state slice was: state.user.user.user → the “real” user object
  return useSelector(s => s.user?.user?.user);
}
