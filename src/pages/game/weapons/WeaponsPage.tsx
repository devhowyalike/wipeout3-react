import { useState, useEffect } from "react";
import Page from "@/components/Page";
import { BorderedTable } from "@/components/BorderedTable";
import { Headline } from "@/components/Typography/Headline";
import { weaponData, Weapon } from "./weaponData";
import { WeaponDetails } from "./WeaponDetails";
import { WeaponButton } from "./WeaponButton";
import { preloadAllWeaponSounds } from "./useWeaponSound";

/** Weapons catalogue page. */
export default function WeaponsPage() {
  const [hoveredWeapon, setHoveredWeapon] = useState<Weapon | null>(null);

  useEffect(() => {
    preloadAllWeaponSounds(weaponData.map((w) => w.sound));
  }, []);

  return (
    <Page
      theme="slateGrayTheme"
      documentTitle="Weapons"
      footerTitle="Weapons"
      footerSubtitle="Game Select"
    >
      <Headline level={1} variant="xl" className="mb-14">
        Weapons
      </Headline>

      <BorderedTable title="W03.00.02 Warning: Offensive/Defensive Assistance">
        <div className="pb-4">
          <div className="md:grid md:grid-flow-col md:grid-rows-6 md:grid-cols-2">
            {weaponData.map((weapon, index) => (
              <WeaponButton
                key={`weapon-${index}`}
                weapon={weapon}
                onHover={setHoveredWeapon}
                isActive={hoveredWeapon?.name === weapon.name}
              />
            ))}
          </div>
        </div>
      </BorderedTable>

      <WeaponDetails weapon={hoveredWeapon} />
    </Page>
  );
}
