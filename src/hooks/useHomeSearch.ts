import { useMemo, useRef, useState } from "react";
import type { Meal } from "../context/context";
import {
    detectCategory,
    getCategoryLabel,
    pickMessage,
    pickPluralMessage,
} from "../utils/homeHelpers";

const MIN_CHARS_FOR_NOT_FOUND = 4;

type UseHomeSearchParams = {
    data: Meal[];
};

export function useHomeSearch({ data }: UseHomeSearchParams) {
    const [search, setSearch] = useState("");
    const [showDriveThru, setShowDriveThru] = useState(false);

    const ignoreSearchRef = useRef(false);

    const searchTrim = useMemo(() => search.trim().toLowerCase(), [search]);

    const detected = useMemo(() => detectCategory(searchTrim), [searchTrim]);
    const isCategorySearch = !!detected;

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const name = item.name.toLowerCase();
            const category = (item.category || "").toLowerCase();

            if (detected) return category === detected;

            return name.includes(searchTrim) || category.includes(searchTrim);
        });
    }, [data, detected, searchTrim]);

    const hasResults = filteredData.length > 0;
    const isSearching = searchTrim.length > 0;
    const charsLeft = Math.max(0, MIN_CHARS_FOR_NOT_FOUND - searchTrim.length);

    const showKeepTyping =
        isSearching &&
        !hasResults &&
        searchTrim.length > 0 &&
        searchTrim.length < MIN_CHARS_FOR_NOT_FOUND;

    const showNotFound =
        isSearching &&
        !hasResults &&
        searchTrim.length >= MIN_CHARS_FOR_NOT_FOUND;

    const headlineText = useMemo(() => {
        if (isCategorySearch) return getCategoryLabel(detected);

        return filteredData.length === 1
            ? pickMessage(searchTrim)
            : pickPluralMessage(searchTrim);
    }, [isCategorySearch, detected, filteredData.length, searchTrim]);

    const driveModeActive = showDriveThru;
    const shouldShowOrderPreview = driveModeActive;
    const shouldShowCarousel = !isSearching && !driveModeActive;
    const hidePromos = isSearching || driveModeActive;

    function scrollPageToTop() {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });

        const se = document.scrollingElement as HTMLElement | null;
        if (se) se.scrollTo({ top: 0, left: 0, behavior: "auto" });

        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }

    function enterFastThru() {
        ignoreSearchRef.current = true;

        setShowDriveThru(true);
        setSearch("");

        requestAnimationFrame(() => {
            scrollPageToTop();
            ignoreSearchRef.current = false;
        });
    }

    function handleSearchInput(value: string) {
        if (ignoreSearchRef.current) return;

        setSearch(value);

        if (value.trim().length > 0) {
            setShowDriveThru(false);
        }
    }

    function exitFastThru() {
        setShowDriveThru(false);
    }

    return {
        search,
        setSearch,
        showDriveThru,
        setShowDriveThru,
        searchTrim,
        detected,
        isCategorySearch,
        filteredData,
        hasResults,
        isSearching,
        charsLeft,
        showKeepTyping,
        showNotFound,
        headlineText,
        driveModeActive,
        shouldShowOrderPreview,
        shouldShowCarousel,
        hidePromos,
        enterFastThru,
        exitFastThru,
        handleSearchInput,
    };
}