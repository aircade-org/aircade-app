import { prisma, type User } from '@repo/database';

// Server Component example
export default async function UsersPage() {
  const users: User[] = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>Posts: {user.posts.length}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
