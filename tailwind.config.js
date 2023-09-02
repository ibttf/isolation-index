/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: 
  {
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '0.5':'0.5px',
      '1':'1px',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    },
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '850px',
      // => @media (min-width: 850px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... },
      '3xl': '1800px'
    },

    extend: {
      transitionProperty: {
        'border':"border",
        'scale':"scale"
      },
      height: {
        '108': '36rem',
        '116': '42rem',
        '128': '50rem',
        '140': '60rem',
        '160':'70rem'
      },
      spacing: {
        '0.25':'1px',
        '22px':'22px',
        '66px':'66px',
        '90':'22rem',
        '98':'26rem',
        '100':'28rem',
        '108': '36rem',
        '128': '44rem',
        '140': '46rem',
      },
      borderWidth: {
        DEFAULT: '1px',
        '0': '0',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
        '16': '16px',
        '20':'20px',
        '80':'80px',
        '40':'40px'
      },
      scale: {
        '10': '0.10',
        '20': '0.20',
        '30': '0.30',
        '40': '0.40',
        '60': '0.60',
        '70': '0.70',
        '80': '0.80',
        '90': '0.90',
        '120': '1.20',
        '175':'1.75',
        '500':'5.00',
      },
      fontSize: {
        xxs: ['6px','8px'],
        xs: ['12px','16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['20px', '28px'],
        xl: ['24px', '32px'],
      }
    },
  }
}