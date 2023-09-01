import { useAppSelector } from '../../hooks';
import { selectAuthName } from '../login/authSlice';

function Team() {
  const name = useAppSelector(selectAuthName);

  return <>You are logged in as team with name: {name}</>;
}

export default Team;
