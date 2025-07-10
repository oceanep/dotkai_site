const siteContent = {
    en: {
        primaryFont: "/fonts/Crude.otf",
        secondaryFont: "/fonts/PPNeueMachina-InktrapRegular.otf",
        sideMenu: {
            fontSize: 0.05,
            mobileFontSize: 0.08,
            sideMenuItems: [
                {
                    id: "contact",
                    icon: "📞",
                    label: "Contact",
                },
                {
                    id: "about",
                    icon: "👤",
                    label: "About Me",
                },
            ],
        },
        menu: {
            title: "PROJECTS",
            fontSize: 0.08,
            buttons: {
                viewMore: "View More",
                back: "Back",
                enter: "Enter",
            },
        },
    },
    jp: {
        primaryFont: "/fonts/851letrogo_007.ttf",
        secondaryFont: "/fonts/851letrogo_007.ttf",
        sideMenu: {
            fontSize: 0.05,
            mobileFontSize: 0.08,
            sideMenuItems: [
                {
                    id: "contact",
                    icon: "📞",
                    label: "お問い合わせ",
                },
                {
                    id: "about",
                    icon: "👤",
                    label: "僕について",
                },
            ],
        },
        menu: {
            title: "プロジェクト",
            fontSize: 0.08,
            buttons: {
                viewMore: "もっと見る",
                back: "戻る",
                enter: "入る",
            },
        },
    },
    colors: {
        menu: {
            textColor: "black",
            squareColor: "white",
            shadowColor: "gray",
            shadowOpacity: 0.25,
        }
    }
};

export default siteContent;
