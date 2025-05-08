import React, { useCallback, useMemo } from 'react';
import SideMenuItem from './sideMenuItem';
import siteContent from '../../../constants/siteContent';
import { EMediaType } from '~/utils/types';
import { useMediaQuery } from '~/utils/hooks';

interface SideMenuProps {
    sectionWidth: number;
    sectionHeight: number;
    menuItemSize?: number;
    language?: 'en' | 'jp';
}

const SideMenu: React.FC<SideMenuProps> = ({ sectionWidth, sectionHeight, menuItemSize = 0.11, language = 'en' }) => {
    const { fontSize: desktopFontSize, mobileFontSize, sideMenuItems: menuItems } = siteContent[language].sideMenu
    const primaryFont = siteContent[language].primaryFont
    const { textColor, squareColor, shadowColor, shadowOpacity} = siteContent.colors.menu

    // mobile breakpoint
    const isMobile = useMediaQuery(EMediaType.SMARTPHONE)

    // set font size based on mobile or deskdtop for icons
    const fontSize = useMemo(() => isMobile ? mobileFontSize : desktopFontSize, [isMobile])

    // offset in y for aesthetic puproses
    const offset = 0.05

    const itemCount = useMemo(() => menuItems.length, [menuItems]);

    // Calculate the middle point of the menu list dynamically
    const posAdjustment = useMemo(() => 
        ((itemCount * menuItemSize) + ((itemCount - 1) * (menuItemSize / 2))) / 2
    , [itemCount, menuItemSize]);

    // Items are positioned from center
    // So for a 50% size gap between, you need half of two items plus the desired gap
    const gap = useMemo(() =>  menuItemSize * 1.5, [menuItemSize]);

    console.log({sectionHeight})

    // Calculate the position of menu items and increment y using index
    // position and space vertically for desktop, horizontally for mobile
    const calculatePosition = useCallback((index: number): [number, number, number] => {
        // sectionHeight * 0.07 is the title logo height
        // sectionWidth * 0.5 is the title logo width 
        const x = isMobile 
            ? posAdjustment/2 - (gap * index)
            : - (sectionWidth / 2)
        // space items around the title icon when on mobile
        const y = isMobile 
            ? sectionHeight/2 - 0.15 - (sectionHeight * 0.07) - (gap * 0.1)
            : posAdjustment - (gap * index) + offset
        const z = 0.15
        
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