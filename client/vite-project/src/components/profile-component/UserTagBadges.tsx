import React from "react";

interface UserTagBadgesProps {
  tagPerson?: string | string[];
}

const UserTagBadges: React.FC<UserTagBadgesProps> = ({ tagPerson }) => {
  if (!tagPerson) return null;

  const tags = Array.isArray(tagPerson)
    ? tagPerson
    : typeof tagPerson === "string"
    ? tagPerson.split(",")
    : [];

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {tags.map((tag, i) => {
        const base = "font-bold px-2.5 py-1 rounded-full text-xs";
        let color = "bg-gray-200 text-gray-800";

        if (tag.includes("พวกเกรียน")) color = "bg-red-100 text-red-700";
        if (tag.includes("น่าเชื่อถือ")) color = "bg-green-100 text-green-700";
        if (tag.includes("สุดยอดนักรีวิว")) color = "bg-blue-100 text-blue-700";
        if (tag.includes("สุดยอดโอตาคุดีเด่น")) color = "bg-yellow-100 text-yellow-800";

        return (
          <span key={i} className={`${base} ${color}`}>
            {tag.trim()}
          </span>
        );
      })}
    </div>
  );
};

export default UserTagBadges;
