export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'warning',
        text: '42',
      },
    },
    {
      title: true,
      name: 'AQI Monitoring',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Map',
      url: '/theme/colors',
      icon: 'fa fa-mixcloud',
    },
    {
      name: 'Routes',
      url: '/theme/typography',
      icon: 'fa fa-location-arrow',
    },
    {
      title: true,
      name: 'AQI Forecasts',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'By Station',
      url: '/base',
      icon: 'fa fa-crosshairs',
      children: [
        {
          name: 'Alphington',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle',
        },
        {
          name: 'Box Hill',
          url: '/base/cards',
          icon: 'icon-puzzle',
        }
      ],
    },
    {
      name: 'Traffic',
      url: '/buttons',
      icon: 'fa fa-car',
      children: [
        {
          name: 'Levels',
          url: '/buttons/buttons',
          icon: 'icon-cursor',
        },
        // {
        //   name: 'Button dropdowns',
        //   url: '/buttons/button-dropdowns',
        //   icon: 'icon-cursor',
        // },
        // {
        //   name: 'Button groups',
        //   url: '/buttons/button-groups',
        //   icon: 'icon-cursor',
        // },
        // {
        //   name: 'Brand Buttons',
        //   url: '/buttons/brand-buttons',
        //   icon: 'icon-cursor',
        // },
      ],
    },
    {
      name: 'Bushfires',
      url: '/icons',
      icon: 'fa fa-fire',
      children: [
        {
          name: 'Historical',
          url: '/icons/coreui-icons',
          icon: 'icon-star',
          badge: {
            variant: 'info',
            text: 'NEW',
          },
        }
      ],
    },
    {
      divider: true,
    },
    {
      title: true,
      name: 'Extras',
    },
    {
      name: 'Pages',
      url: '/pages',
      icon: 'fa fa-desktop',
      disable: true,
      children: [
        {
          name: 'Login',
          url: '/login',
          icon: 'fa fa-desktop',
        },
        {
          name: 'Register',
          url: '/register',
          icon: 'fa fa-desktop',
        },
        {
          name: 'Error 404',
          url: '/404',
          icon: 'fa fa-desktop',
        },
        {
          name: 'Error 500',
          url: '/500',
          icon: 'fa fa-desktop',
        },
      ],
    },
  ],
};
