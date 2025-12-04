/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            backgroundImage: {
                'fitness-wallpaper': "url('/src/assets/fitness-bg.png')",
            },
        },
    },
    plugins: [],
}
