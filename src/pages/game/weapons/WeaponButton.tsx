import { Weapon } from "./weaponData";
import { Headline } from "@/components/Typography/Headline";
import { useWeaponSound } from "./useWeaponSound";

/** Weapon name control that plays sound and reports hover/selection. */
export const WeaponButton = ({
  weapon,
  onHover,
  isActive,
}: {
  weapon: Weapon;
  onHover: (weapon: Weapon) => void;
  isActive?: boolean;
}) => {
  const playWeaponSound = useWeaponSound(weapon.sound);

  const handleSelect = () => {
    playWeaponSound();
    onHover(weapon);
  };

  return (
    <div>
      <Headline
        as="button"
        level={3}
        variant="md"
        className={`cursor-pointer hover:text-heading-3-hover active:text-heading-3-hover focus-visible:text-heading-3-hover whitespace-nowrap${isActive ? " text-heading-3-hover" : ""}`}
        onMouseEnter={handleSelect}
        onClick={handleSelect}
      >
        {weapon.name}
      </Headline>
    </div>
  );
};
