import React from 'react';
import ContentLoader, { BulletList } from "react-content-loader";

const MapLoader = props => (
  <ContentLoader 
    height={100}
    width={100}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ececec"
    {...props}
  ><rect x="5" y="5" rx="5" ry="5" width="90" height="90" />
  </ContentLoader>
)

const TableLoader = props => (
  <ContentLoader 
    height={60}
    width={400}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    {...props}
  >
    <rect x="5" y="15" rx="5" ry="5" width="240" height="10" />
    <rect x="5" y="45" rx="5" ry="5" width="240" height="10" />
    <rect x="5" y="75" rx="5" ry="5" width="240" height="10" />
    <rect x="5" y="105" rx="5" ry="5" width="240" height="10" />
  </ContentLoader>
)

export {
  MapLoader,
  BulletList,
  TableLoader
}