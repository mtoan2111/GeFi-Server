import EntityRoute from './Entity.route';
import HomeRoute from './Home.route';
import AreaRoute from './Area.route';
import UserRoute from './User.route';

export const initRoute = (server: any = {}): void => {
    try {
        server.use(`/v2/entity`, EntityRoute);
        server.use(`/v2/user`, UserRoute);
        server.use(`/v2/home`, HomeRoute);
        server.use(`/v2/area`, AreaRoute);
        server.use(`/v2/user`, UserRoute);
    } catch (err) {}
};
