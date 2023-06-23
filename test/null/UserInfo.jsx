const UserInfo = ({ user }) => {
  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

const getUser = ({ user }) => {
  // user가 null인 경우 대신 사용할 null 객체

  return user ?? {
    name: 'Not Available',
    email: 'Not Available',
  };
}

const ParentComponent = ({ user }) => {
  return <UserInfo user={ getUser(user) } />;
};