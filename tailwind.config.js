/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"], content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",], theme: {
        fontSize: {
            xs: ['0.75rem', {
                lineHeight: '1rem'
            }], sm: ['0.875rem', {
                lineHeight: '1.25rem'
            }], base: ['0.875rem', {
                lineHeight: '1.5rem'
            }], lg: ['1rem', {
                lineHeight: '1.75rem'
            }], xl: ['1.125rem', {
                lineHeight: '1.75rem'
            }], '2xl': ['1.25rem', {
                lineHeight: '2rem'
            }], '3xl': ['1.5rem', {
                lineHeight: '2rem'
            }], '4xl': ['1.875rem', {
                lineHeight: '2.25rem'
            }], '5xl': ['2.25rem', {
                lineHeight: '2.5rem'
            }]
        }, extend: {
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                }
            }, fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif']
            }, animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out', 'slide-up': 'slideUp 0.3s ease-out'
            }, keyframes: {
                fadeIn: {
                    '0%': {
                        opacity: '0'
                    }, '100%': {
                        opacity: '1'
                    }
                }, slideUp: {
                    '0%': {
                        transform: 'translateY(10px)', opacity: '0'
                    }, '100%': {
                        transform: 'translateY(0)', opacity: '1'
                    }
                }
            }, borderRadius: {
                lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
};
