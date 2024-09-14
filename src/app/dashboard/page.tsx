import { authorized } from "@/auth";

export default async function Page() {
  const { session, user, can } = await authorized();

  const canCreateComments = can("create", "comment");

  return (
    <div className="container">
      {user.role ? (
        <p className="text-green-800">Your account has role {user.role.name}</p>
      ) : (
        <p className="text-red-800">You account does not have any role</p>
      )}
      {user.role?.isSuperAdmin ? (
        <p className="text-green-800">You are super admin</p>
      ) : (
        <p className="text-red-800">You are NOT super admin</p>
      )}
      {canCreateComments ? (
        <p className="text-green-800">You are allowed to create comments</p>
      ) : (
        <p className="text-red-800">You are NOT allowed to create comments</p>
      )}

      <pre>{JSON.stringify({ user, session }, null, 4)}</pre>
    </div>
  );
}
