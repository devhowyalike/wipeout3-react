import { Headline } from "@/components/Typography/Headline";
import { Weapon } from "./weaponData";
import { WEAPON_ICON_PATH } from "./weaponConstants";

/** Icon, description, and categories for the selected weapon. */
export const WeaponDetails = ({ weapon }: { weapon: Weapon | null }) => {
  if (!weapon) return null;

  const bgColorClass =
    // If both offensive and defensive, use offensive
    weapon.category.length === 1 && weapon.category[0] === "Defensive"
      ? "bg-weapons-defensive"
      : "bg-weapons-offensive";

  return (
    <div className="md:flex max-w-[550px] ml-4 -mt-3">
      <div className="w-8 pt-1">
        <Headline level={3} variant="bodyCopy" className="text-w3-xs leading-5">
          Logo
        </Headline>
      </div>
      <div className="w-24 pt-2 mr-4 relative">
        <div
          className={`flex items-center justify-center aspect-170/111 bg-contain bg-no-repeat ${bgColorClass}`}
        >
          <img
            src={`${WEAPON_ICON_PATH}/${weapon.icon}`}
            alt={`${weapon.name} icon`}
            className="max-w-[70px] h-auto mt-1"
            decoding="async"
          />
        </div>
        <div className="hidden md:block h-[64px] bg-border-label w-px absolute top-1 -right-2"></div>
      </div>
      <div className="mt-3 md:mt-0 w-64 relative mr-2 pr-2">
        <Headline
          level={3}
          variant="bodyCopy"
          className="block text-w3-xs leading-5"
        >
          Text Description
        </Headline>
        <p className="text-w3-xs leading-normal">{weapon.desc}</p>
        <div className="hidden md:block h-[64px] bg-border-label w-px absolute top-1 right-0"></div>
      </div>
      <div className="mt-3 md:mt-0 w-24">
        <Headline
          level={3}
          variant="bodyCopy"
          className="block text-w3-xs leading-5"
        >
          Weapon Category
        </Headline>
        <p className="text-w3-xs leading-normal whitespace-pre">
          {weapon.category.join("\n")}
        </p>
      </div>
    </div>
  );
};
