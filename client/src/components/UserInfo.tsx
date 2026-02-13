import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

import { useAuthContext } from "@contexts/AuthContext";

export default function UserInfo() {
  const { user } = useAuthContext();
  const userName = `${user?.profile?.firstName ?? ""} ${user?.profile?.lastName ?? ""}`.trim();
  const defaultAvatarLetters =
    `${user?.profile?.firstName?.at(0)?.toUpperCase() ?? ""} ${user?.profile?.lastName?.at(0)?.toUpperCase() ?? ""}`.trim();

  return (
    <div className="flex items-center gap-4">
      <p className="m-0 text-sm leading-[2.4]">{userName}</p>
      <Avatar>
        {user?.profile?.avatar ? (
          <AvatarImage src={user?.profile?.avatar} loading="lazy" decoding="async" />
        ) : (
          <AvatarFallback className="bg-primary text-white">{defaultAvatarLetters}</AvatarFallback>
        )}
      </Avatar>
    </div>
  );
}
