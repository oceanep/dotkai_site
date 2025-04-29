import React, { useCallback } from 'react';
import SideMenuItem from './sideMenuItem';
import siteContent from '../../../constants/siteContent';

interface SideMenuProps {
    pageWidth: number;
    pageHeight: number;
    language?: 'en' | 'jp';
}

const SideMenu: React.FC<SideMenuProps> = ({ pageWidth, pageHeight, language = 'en' }) => {
    const { fontSize, sideMenuItems: menuItems } = siteContent[language].sideMenu
    const primaryFont = siteContent[language].primaryFont
    const { textColor, squareColor, shadowColor, shadowOpacity} = siteContent.colors.menu

    // Calculate the position of menu items and increment y using index
    const calculatePosition = useCallback((index: number): [number, number, number] => {
        const x = -pageWidth / 2;
        const initialY = pageHeight / 2 - 0.8;
        const y = initialY - (0.15 * index);
        const z = 0.15;

        return [x, y, z];
    }, [pageWidth, pageHeight])

    return (
        <>
            {menuItems.map((item, index) => (
                <SideMenuItem
                    key={item.id}
                    width={0.1}
                    height={0.1}
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