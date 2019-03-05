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
      name: 'AQI Monitoring & Forecast',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Map',
      url: '/map',
      icon: 'fa fa-mixcloud',
    },
    {
      name: 'By Station',
      url: '/stations',
      icon: 'fa fa-crosshairs'
    },
    {
      title: true,
      name: 'Pollution Sources',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'Traffic',
      url: '/traffic',
      icon: 'fa fa-car',
      children: [
        {
          name: 'Levels',
          url: '/traffic',
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
      url: '/fires',
      icon: 'fa fa-fire',
      children: [
        {
          name: 'Live',
          url: '/fires',
          icon: 'icon-fire'
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
