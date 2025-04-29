import React, { useCallback, useMemo } from 'react';
import SideMenuItem from './sideMenuItem';
import siteContent from '../../../constants/siteContent';

interface SideMenuProps {
    sectionWidth: number;
    sectionHeight: number;
    language?: 'en' | 'jp';
}

const SideMenu: React.FC<SideMenuProps> = ({ sectionWidth, sectionHeight, language = 'en' }) => {
    const { fontSize, sideMenuItems: menuItems } = siteContent[language].sideMenu
    const primaryFont = siteContent[language].primaryFont
    const { textColor, squareColor, shadowColor, shadowOpacity} = siteContent.colors.menu

    // menu item size for x and y
    const menuItemSize = 0.11
    // offset in y for aesthetic puproses
    const offset = 0.05

    const itemCount = useMemo(() => menuItems.length, [menuItems]);
    // Calculate the middle point of the menu list dynamically
    const posAdjustment = useMemo(() => 
        ((itemCount * menuItemSize) + ((itemCount - 1) * (menuItemSize / 2))) / 2, 
        [itemCount, menuItemSize]
    );
    // Items are positioned from center
    // So for a 50% size gap between, you need half of two items plus the desired gap
    const gap = useMemo(() => menuItemSize * 1.5, [menuItemSize]);

    // Calculate the position of menu items and increment y using index
    const calculatePosition = useCallback((index: number): [number, number, number] => {

        
        const x = -sectionWidth / 2
        const y = posAdjustment - (gap * index) + offset
        const z = 0.15
        
        console.log({posAdjustment, y})
        
        return [x, y, z]
    }, [sectionWidth, sectionHeight, itemCount, posAdjustment, gap])

    return (
        <>
            {menuItems.map((item, index) => (
                <SideMenuItem
                    key={item.id}
                    width={menuItemSize}
                    height={menuItemSize}
                    position={calculatePosition(index)}
                    icon={item.icon}
                    font={primaryFont}
                    fontSize={fontSize}
                    textColor={textColor}
                    squareColor={squareColor}
                    shadowColor={shadowColor}
                    shadowOpacity={shadowOpacity}
                />
            ))}
        </>
    );
};

export default SideMenu;