import React, { Component, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import {
// eslint-disable-next-line
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import { utils } from '../../utils';

// eslint-disable-next-line
const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));
const PrivateRoute = React.lazy(() => import('../../components/PrivateRoute'));

class DefaultLayout extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    e.preventDefault();
    utils.history.push('/login');
  }

  onProfile(e) {
    e.preventDefault();
    utils.history.push('/profile');
  }

  onSettings(e) {
    e.preventDefault();
    utils.history.push('/settings');
  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense  fallback={this.loading()}>
            <DefaultHeader onLogout={e=>this.signOut(e)}
                           onProfile={e=>this.onProfile(e)}
                           onSettings={e=>this.onSettings(e)}/>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
            <AppSidebarNav navConfig={navigation} {...this.props} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes}/>
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      route.routeType === 'private' ?
                        (<PrivateRoute
                            key={idx}
                            path={route.path}
                            exact={route.exact}
                            name={route.name}
                            component={props => (
                              <route.component {...props} />
                            )} />) :
                        (<Route
                            key={idx}
                            path={route.path}
                            exact={route.exact}
                            name={route.name}
                            render={props => (
                              <route.component {...props} />
                            )} />)
                    ) : (null);
                  })}
                </Switch>
              </Suspense>
            </Container>
          </main>
          {/*<AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>*/}
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
