import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { client } from '../../apollo';
import { Button } from '@strapi/design-system';


export default function LogoutButton() {
  const { setUser } = useContext(UserContext);

  function handleLogout() {
    localStorage.clear();
    setUser(null);
    client.clearStore();
  }
  return <div>
    <Button onClick={handleLogout}>Logout</Button>
  </div>;
}
