import { teamMembers, angryManLogo } from "./teamMembers";

interface TeamMember {
  firstName: string;
  lastName: string;
  title: string;
}

/** Name, title, and logo for the hovered or default developer on the credits page. */
export const DeveloperDetails = ({
  developer,
}: {
  developer: TeamMember | null;
}) => {
  // Default to first team member if none is being hovered
  const displayDeveloper = developer || teamMembers[0];

  return (
    <div className="mt-4">
      <div className="grid grid-cols-[1fr,1fr,45px] sm:grid-cols-[45px_1fr_45px_1fr_30px_115px] text-w3-sm font-bold max-w-[550px] gap-y-0.5">
        {/* Headers */}
        <div className="text-body uppercase text-w3-xs font-bold items-start sm:row-start-1">
          Name
        </div>
        <div className="text-body uppercase text-w3-xs font-bold items-start sm:col-start-3 sm:row-start-1">
          Title
        </div>
        <div className="text-body uppercase text-w3-xs font-bold items-start col-start-3 row-start-1 sm:col-start-5 sm:row-start-1">
          Logo
        </div>

        {/* Developer Data */}
        <div className="text-body uppercase sm:col-start-2 sm:row-start-1 leading-none">
          {displayDeveloper.lastName}
          <br />
          {displayDeveloper.firstName}
        </div>
        <div className="text-body uppercase sm:col-start-4 sm:row-start-1 leading-none">
          {displayDeveloper.title}
        </div>

        {/* Logo */}
        <div className="text-body uppercase col-start-3 row-start-2 sm:col-start-6 sm:row-start-1 leading-none">
          <span className="hidden sm:inline">
            {angryManLogo.name} {angryManLogo.title}
          </span>
          <span className="sm:hidden">{angryManLogo.name}</span>
        </div>
      </div>
    </div>
  );
};
