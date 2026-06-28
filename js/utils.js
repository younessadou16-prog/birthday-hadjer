/**
 * utils.js
 * Helper functions for the Aurora experience.
 */

const Utils = {
    // DOM Element selector
    $: (selector) => document.querySelector(selector),
    $$: (selector) => document.querySelectorAll(selector),
    
    // Calculates exact age based on a birthdate string (YYYY-MM-DD)
    calculateAge: (birthDateStr) => {
        const birthDate = new Date(birthDateStr + 'T00:00:00');
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return Math.max(0, age);
    },

    // Gets the ordinal suffix for a number (st, nd, rd, th)
    getOrdinalSuffix: (i) => {
        let j = i % 10, k = i % 100;
        if (j == 1 && k != 11) return i + "st";
        if (j == 2 && k != 12) return i + "nd";
        if (j == 3 && k != 13) return i + "rd";
        return i + "th";
    },

    // Random number generator in a range
    randomRange: (min, max) => Math.random() * (max - min) + min,

    // Delay helper
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms))
};

window.Utils = Utils;
