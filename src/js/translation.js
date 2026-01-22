export default function translator(externalLang) {
    const langs = {};
    let currentLang = externalLang;
    let currentLoad = null;

    const detect = () => {
        if (navigator.language === "ru-RU") {
            currentLang = "ru";
        } else {
            currentLang = "en";
        }
    };

    const getLang = () => currentLang;

    const loadLang = async (lang) => {
        if (langs[lang]) {
            return;
        }
        if (currentLoad) {
            return currentLoad;
        }
        if (lang === "ru") {
            currentLoad = await import("../locales/ru.json", {
                with: {
                    type: "json"
                }
            });
        } else {
            currentLoad = await import("../locales/en.json", {
                with: {
                    type: "json"
                }
            });
        }
        const dict = currentLoad.default;
        langs[lang] = dict;
        currentLoad = null;
    };

    if (!currentLang) {
        detect();
    }

    loadLang(getLang());

    const getString = async (key, lang) => {
        await loadLang(lang);
        const dict = langs[lang];
        return dict[key];
    };

    const t = (key) => getString(key, currentLang);
    return {
        t,
        detect,
        getLang
    };
}
