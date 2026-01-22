export default function translator(externalLang) {
    const langs = {};
    let currentLang = externalLang ?? "en";

    const detect = () => {
        if (navigator.language === "ru-RU") {
            currentLang = "ru";
        }
    };

    const getLang = () => currentLang;

    detect();

    const getString = async (key, lang) => {
        if (langs[lang]) {
            const dict = langs[lang];
            return dict[key];
        }
        let module;
        if (lang === "ru") {
            module = await import("../locales/ru.json", {
                with: {
                    type: "json"
                }
            });
        } else {
            module = await import("../locales/en.json", {
                with: {
                    type: "json"
                }
            });
        }
        const dict = module.default;
        langs[lang] = dict;
        return dict[key];
    };

    const t = (key) => getString(key, currentLang);
    return {
        t,
        detect,
        getLang
    };
}
