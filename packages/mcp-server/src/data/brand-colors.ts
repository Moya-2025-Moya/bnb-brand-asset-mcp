export const brandColors = {
  light: {
    primary: {
      yellow: "#F0B90B",
      yellowHover: "#D4A20A",
      yellowPressed: "#B88B09",
      black: "#181A20",
      white: "#FFFFFF",
    },
    text: {
      primary: "#1E2329",
      secondary: "#474D57",
      tertiary: "#76808F",
      disabled: "#AEB4BC",
      brand: "#C99400",
      inverse: "#FFFFFF",
    },
    background: {
      primary: "#FFFFFF",
      secondary: "#FAFAFA",
      tertiary: "#F5F5F5",
      card: "#FFFFFF",
    },
    border: {
      primary: "#EAECEF",
      secondary: "#E6E8EA",
      focus: "#F0B90B",
    },
    semantic: {
      success: "#0ECB81",
      error: "#F6465D",
      warning: "#F0B90B",
      info: "#1E88E5",
    },
  },
  dark: {
    primary: {
      yellow: "#FCD535",
      yellowHover: "#F0B90B",
      yellowPressed: "#D4A20A",
      black: "#181A20",
      white: "#FFFFFF",
    },
    text: {
      primary: "#EAECEF",
      secondary: "#B7BDC6",
      tertiary: "#848E9C",
      disabled: "#5E6673",
      brand: "#FCD535",
      inverse: "#181A20",
    },
    background: {
      primary: "#181A20",
      secondary: "#1E2329",
      tertiary: "#2B3139",
      card: "#1E2329",
    },
    border: {
      primary: "#2B3139",
      secondary: "#363C46",
      focus: "#FCD535",
    },
    semantic: {
      success: "#0ECB81",
      error: "#F6465D",
      warning: "#FCD535",
      info: "#1E88E5",
    },
  },
  gradients: {
    brandPrimary: "linear-gradient(135deg, #F0B90B 0%, #FCD535 100%)",
    brandDark: "linear-gradient(135deg, #181A20 0%, #2B3139 100%)",
    heroLight: "linear-gradient(135deg, #FFF9E6 0%, #FFFFFF 50%, #F5F5F5 100%)",
    heroDark: "linear-gradient(135deg, #181A20 0%, #1E2329 50%, #2B3139 100%)",
    cardShine: "linear-gradient(135deg, rgba(240,185,11,0.1) 0%, rgba(252,213,53,0.05) 100%)",
  },
  typography: {
    fontFamily: {
      heading: "'Space Grotesk', sans-serif",
      body: "'Inter', 'Space Grotesk', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  cssVariables: {
    light: `
:root {
  --bnb-yellow: #F0B90B;
  --bnb-yellow-hover: #D4A20A;
  --bnb-black: #181A20;
  --bnb-white: #FFFFFF;
  --bnb-bg-primary: #FFFFFF;
  --bnb-bg-secondary: #FAFAFA;
  --bnb-bg-tertiary: #F5F5F5;
  --bnb-text-primary: #1E2329;
  --bnb-text-secondary: #474D57;
  --bnb-text-tertiary: #76808F;
  --bnb-border-primary: #EAECEF;
  --bnb-success: #0ECB81;
  --bnb-error: #F6465D;
  --bnb-warning: #F0B90B;
  --bnb-info: #1E88E5;
  --bnb-gradient-brand: linear-gradient(135deg, #F0B90B 0%, #FCD535 100%);
  --bnb-font-heading: 'Space Grotesk', sans-serif;
  --bnb-font-body: 'Inter', 'Space Grotesk', sans-serif;
  --bnb-font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}`,
    dark: `
.dark, [data-theme="dark"] {
  --bnb-yellow: #FCD535;
  --bnb-yellow-hover: #F0B90B;
  --bnb-black: #181A20;
  --bnb-white: #FFFFFF;
  --bnb-bg-primary: #181A20;
  --bnb-bg-secondary: #1E2329;
  --bnb-bg-tertiary: #2B3139;
  --bnb-text-primary: #EAECEF;
  --bnb-text-secondary: #B7BDC6;
  --bnb-text-tertiary: #848E9C;
  --bnb-border-primary: #2B3139;
  --bnb-success: #0ECB81;
  --bnb-error: #F6465D;
  --bnb-warning: #FCD535;
  --bnb-info: #1E88E5;
  --bnb-gradient-brand: linear-gradient(135deg, #F0B90B 0%, #FCD535 100%);
}`,
  },
  tailwindConfig: `
// tailwind.config.ts - BNB Chain brand extension
{
  theme: {
    extend: {
      colors: {
        bnb: {
          yellow: '#F0B90B',
          'yellow-hover': '#D4A20A',
          'yellow-pressed': '#B88B09',
          'yellow-light': '#FCD535',
          black: '#181A20',
          dark: '#1E2329',
          'dark-2': '#2B3139',
          'dark-3': '#363C46',
          success: '#0ECB81',
          error: '#F6465D',
          warning: '#F0B90B',
          info: '#1E88E5',
        }
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'bnb-gradient': 'linear-gradient(135deg, #F0B90B 0%, #FCD535 100%)',
        'bnb-gradient-dark': 'linear-gradient(135deg, #181A20 0%, #2B3139 100%)',
      }
    }
  }
}`,
};
